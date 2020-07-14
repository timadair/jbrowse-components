import { isAlive, isStateTreeNode } from 'mobx-state-tree'
import { objectFromEntries } from '../util'
import { serializeAbortSignal } from './remoteAbortSignals'
import PluginManager from '../PluginManager'

interface WorkerHandle {
  destroy(): void
  call(functionName: string, args?: unknown, options?: {}): Promise<unknown>
}

function isClonable(thing: unknown): boolean {
  if (typeof thing === 'function') return false
  if (thing instanceof Error) return false
  return true
}

const WORKER_MAX_PING_TIME = 30 * 1000 // 30 secs

// watches the given worker object, returns a promise that will be rejected if
// the worker times out
function watchWorker(worker: WorkerHandle, pingTime: number): Promise<void> {
  return new Promise((resolve, reject): void => {
    let pingIsOK = true
    const watcherInterval = setInterval(() => {
      if (!pingIsOK) {
        clearInterval(watcherInterval)
        reject(
          new Error(
            `worker look longer than ${pingTime} ms to respond. terminated.`,
          ),
        )
      } else {
        pingIsOK = false
        worker
          .call('ping', [], { timeout: 2 * WORKER_MAX_PING_TIME })
          .then(() => {
            pingIsOK = true
          })
      }
    }, pingTime)
  })
}

function detectHardwareConcurrency() {
  if (
    typeof window !== 'undefined' &&
    'hardwareConcurrency' in window.navigator
  ) {
    return window.navigator.hardwareConcurrency
  }
  return 1
}


type LazyWorkerHandle = () => WorkerHandle
export default abstract class BaseRpcDriver {
  private lastWorkerAssignment = -1

  private workerAssignments = new Map<string, number>() // sessionId -> worker number

  private workerCount = 0

  abstract makeWorker(pluginManager: PluginManager): WorkerHandle

  private workerPool?: LazyWorkerHandle[]

  // filter the given object and just remove any non-clonable things from it
  filterArgs<THING_TYPE>(
    thing: THING_TYPE,
    pluginManager: PluginManager,
    sessionId: string,
  ): THING_TYPE {
    if (Array.isArray(thing)) {
      return (thing
        .filter(isClonable)
        .map(t =>
          this.filterArgs(t, pluginManager, sessionId),
        ) as unknown) as THING_TYPE
    }
    if (typeof thing === 'object' && thing !== null) {
      // AbortSignals are specially handled
      if (thing instanceof AbortSignal) {
        return (serializeAbortSignal(
          thing,
          this.remoteAbort.bind(this, pluginManager, sessionId),
        ) as unknown) as THING_TYPE
      }

      if (isStateTreeNode(thing) && !isAlive(thing))
        throw new Error('dead state tree node passed to RPC call')

      const newobj = objectFromEntries(
        Object.entries(thing)
          .filter(e => isClonable(e[1]))
          .map(([k, v]) => [k, this.filterArgs(v, pluginManager, sessionId)]),
      )
      return newobj as THING_TYPE
    }
    return thing
  }

  remoteAbort(
    pluginManager: PluginManager,
    sessionId: string,
    functionName: string,
    signalId: number,
  ) {
    const worker = this.getWorker(sessionId, functionName, pluginManager)
    worker.call(functionName, signalId, { timeout: 1000000 })
  }

  createWorkerPool(pluginManager: PluginManager): WorkerHandle[] {
    const hardwareConcurrency = detectHardwareConcurrency()

    const workerCount =
      this.workerCount || Math.max(1, Math.ceil((hardwareConcurrency - 2) / 3))

    const workerHandles: LazyWorkerHandle[] = new Array(workerCount)
    
    // eslint-disable-next-line  @typescript-eslint/no-this-alias
    const thisB = this

    for (let i = 0; i < workerCount; i += 1) {
      workerHandles[i] = function workerGenerator() {
        // @ts-ignore
        if (!this.worker) {
          // @ts-ignore
          this.worker = thisB.makeWorker()
          // @ts-ignore
          watchWorker(this.worker, WORKER_MAX_PING_TIME).catch(() => {
            console.warn(
              'worker did not respond, killing and generating new one',
            )
            // @ts-ignore
            this.worker.destroy()
            // @ts-ignore
            this.worker.status = 'killed'
            // @ts-ignore
            this.worker = workerGenerator.call(this)
          })
        }
        // @ts-ignore
        return this.worker
      }
    }

    return workerHandles
  }

  getWorkerPool(pluginManager: PluginManager) {
    if (!this.workerPool) {
      const res = this.createWorkerPool(pluginManager)
      this.workerPool = res
      return res // making this several steps makes TS happy
    }
    return this.workerPool
  }

  getWorker(
    sessionId: string,
    functionName: string,
    pluginManager: PluginManager,
  ): WorkerHandle {
    const workers = this.getWorkerPool(pluginManager)
    let workerNumber = this.workerAssignments.get(sessionId)
    if (workerNumber === undefined) {
      const workerAssignment = (this.lastWorkerAssignment + 1) % workers.length
      this.workerAssignments.set(sessionId, workerAssignment)
      this.lastWorkerAssignment = workerAssignment
      workerNumber = workerAssignment
    }

    // console.log(`${sessionId} -> worker ${workerNumber}`)
    const worker = workers[workerNumber]()
    if (!worker) {
      throw new Error('no web workers registered for RPC')
    }
    return worker
  }

  async call(
    pluginManager: PluginManager,
    sessionId: string,
    functionName: string,
    args: {},
    options = {},
  ) {
    if (!sessionId) {
      throw new TypeError('sessionId is required')
    }
    const worker = this.getWorker(sessionId, functionName, pluginManager)
    const rpcMethod = pluginManager.getRpcMethodType(functionName)
    const serializedArgs = await rpcMethod.serializeArguments(args)
    const filteredAndSerializedArgs = this.filterArgs(
      serializedArgs,
      pluginManager,
      sessionId,
    )
    const resultP = worker.call(functionName, filteredAndSerializedArgs, {
      timeout: 5 * 60 * 1000, // 5 minutes
      ...options,
    })
    let handle: ReturnType<typeof setInterval>
    const result = await Promise.race([
      resultP,
      new Promise((resolve, reject) => {
        handle = setInterval(() => {
          // must've been killed
          // @ts-ignore
          if (worker.status === 'killed') {
            reject(new Error('operation timed out'))
          }
        }, 5000)
      }).finally(() => {
        clearInterval(handle)
      }),
    ])

    return rpcMethod.deserializeReturn(result)
  }
}
