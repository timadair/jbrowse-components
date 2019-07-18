import { ConfigurationSchema } from '@gmod/jbrowse-core/configuration'

export { default as AdapterClass } from './GenerateNamesAdapter'

export const configSchema = ConfigurationSchema(
  'GenerateNamesAdapter',
  {
    baseUrl: {
      type: 'string',
    },
  },
  { explicitlyTyped: true },
)
