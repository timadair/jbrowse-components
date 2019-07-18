import BaseAdapter from '@gmod/jbrowse-core/BaseAdapter'
import SimpleFeature, { Feature } from '@gmod/jbrowse-core/util/simpleFeature'
import { ObservableCreate } from '@gmod/jbrowse-core/util/rxjs'
import { INoAssemblyRegion } from '@gmod/jbrowse-core/mst-types'
import { Observable, Observer } from 'rxjs'

interface NameRecord {
  start: number
  end: number
  refSeq: string
  trackLabel: string
}

interface BaseNameAdapter {
  search(query: { name: string }): Observable<NameRecord>
}
/**
 * Adapter that just returns the features defined in its `features` configuration
 * key, like:
 *   "features": [ { "refName": "ctgA", "start":1, "end":20 }, ... ]
 */

export default class GenerateNamesAdapter implements BaseNameAdapter {
  public static capabilities = ['search']

  constructor(config: { refNameAliases?: [] }) {
    const { refNameAliases } = config
  }

  /**
   * Fetch features for a certain region
   * @param {Region} param
   * @param {AbortSignal} [signal] optional AbortSignal for aborting the request
   * @returns {Observable[Feature]} Observable of Feature objects in the region
   */
  search(query: { name: string }): Observable<NameRecord> {
    const { name } = query

    return ObservableCreate(async (observer: Observer<NameRecord>) => {
      observer.complete()
    })
  }

  /**
   * called to provide a hint that data tied to a certain region
   * will not be needed for the forseeable future and can be purged
   * from caches, etc
   */
  freeResources(/* { region } */): void {}
}
