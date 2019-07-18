import { observer } from 'mobx-react'
import { isStateTreeNode, getType } from 'mobx-state-tree'
import { ConfigurationSchema } from '@gmod/jbrowse-core/configuration'

export const reactComponent = import('./components/Search')
export { default as stateModelFactory } from './model'
export const configSchema = ConfigurationSchema(
  'SearchDrawerWidget',
  {},
)

