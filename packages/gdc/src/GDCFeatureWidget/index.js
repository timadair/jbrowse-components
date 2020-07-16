import { ConfigurationSchema } from '@gmod/jbrowse-core/configuration'
import { ElementId } from '@gmod/jbrowse-core/util/types/mst'
import { types } from 'mobx-state-tree'

export const configSchema = ConfigurationSchema('GDCFeatureWidget', {})
export const stateModel = types
  .model('GDCFeatureWidget', {
    id: ElementId,
    type: types.literal('GDCFeatureWidget'),
    featureData: types.frozen({}),
  })
  .actions(self => ({
    setFeatureData(data) {
      self.featureData = data
    },
    clearFeatureData() {
      self.featureData = {}
    },
  }))

export { default as ReactComponent } from './GDCFeatureWidget'