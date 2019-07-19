import { types } from 'mobx-state-tree'
import { ElementId } from '@gmod/jbrowse-core/mst-types'

// The search drawer can target a specific track or a view
// TODO: global search across views?
export default pluginManager =>
  types
    .model('SearchDrawerWidget', {
      id: ElementId,
      type: types.literal('SearchDrawerWidget'),
      target: types.reference(
        types.union(
          pluginManager.pluggableConfigSchemaType('track'),
          types.union(pluginManager.pluggableConfigSchemaType('view')),
        ),
      ),
    })
    .actions(self => ({
      setTarget(newTarget) {
        self.target = newTarget
      },
    }))
