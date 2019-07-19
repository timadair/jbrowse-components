import { types } from 'mobx-state-tree'
import { ElementId } from '@gmod/jbrowse-core/mst-types'

export default pluginManager =>
  types
    .model('SearchDrawerWidget', {
      id: ElementId,
      type: types.literal('SearchDrawerWidget'),
      target: types.reference(
        types.union(
          pluginManager.pluggableConfigSchemaType('track'),
          pluginManager.pluggableMstType('view', 'stateModel'),
        ),
      ),
    })
    // .volatile(() => ({
    //   target: undefined,
    // }))
    .actions(self => ({
      setTarget(newTarget) {
        self.target = newTarget
      },
    }))
//    .views(self => ({}))
