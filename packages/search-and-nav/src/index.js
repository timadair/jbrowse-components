import DrawerWidgetType from '@gmod/jbrowse-core/pluggableElementTypes/DrawerWidgetType'
import Plugin from '@gmod/jbrowse-core/Plugin'
import NameStoreType from '@gmod/jbrowse-core/pluggableElementTypes/NameStoreType'
import { lazy } from 'react'
import {
  configSchema as SearchConfigSchema,
  reactComponent as SearchReactComponent,
  stateModelFactory as SearchStateModelFactory,
} from './SearchDrawerWidget'
import {
  AdapterClass as GenerateNamesAdapterClass,
  configSchema as generateNamesAdapterConfigSchema,
} from './GenerateNamesAdapter'

export default class extends Plugin {
  install(pluginManager) {
    pluginManager.addNameStoreType(
      () =>
        new NameStoreType({
          name: 'GenerateNamesAdapter',
          configSchema: generateNamesAdapterConfigSchema,
          AdapterClass: GenerateNamesAdapterClass,
        }),
    )

    pluginManager.addDrawerWidgetType(() => {
      return new DrawerWidgetType({
        name: 'SearchDrawerWidget',
        configSchema: SearchConfigSchema,
        stateModel: SearchStateModelFactory(pluginManager),
        LazyReactComponent: lazy(() => SearchReactComponent),
      })
    })
  }
}

export { default as SearchDrawer } from './SearchDrawerWidget/components/Search'
