import DrawerWidgetType from '@gmod/jbrowse-core/pluggableElementTypes/DrawerWidgetType'
import Plugin from '@gmod/jbrowse-core/Plugin'
import { lazy } from 'react'
import {
  configSchema as SearchConfigSchema,
  HeadingComponent as SearchHeadingComponent,
  reactComponent as SearchReactComponent,
  stateModelFactory as SearchStateModelFactory,
} from './SearchDrawerWidget'
import {
  AdapterClass as FromConfigAdapterClass,
  configSchema as fromConfigAdapterConfigSchema,
} from './FromConfigAdapter'

export default class extends Plugin {
  install(pluginManager) {
    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'FromConfigAdapter',
          configSchema: fromConfigAdapterConfigSchema,
          AdapterClass: FromConfigAdapterClass,
        }),
    )

    pluginManager.addDrawerWidgetType(() => {
      return new DrawerWidgetType({
        name: 'SearchDrawerWidget',
        HeadingComponent: SearchHeadingComponent,
        configSchema: SearchConfigSchema,
        stateModel: SearchStateModelFactory(pluginManager),
        LazyReactComponent: lazy(() => SearchReactComponent),
      })
    })
  }
}

export { default as SearchDrawer } from './SearchDrawerWidget/components/Search'
