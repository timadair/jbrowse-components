import { ElementId } from '@gmod/jbrowse-core/mst-types'
import { getSession } from '@gmod/jbrowse-core/util'
import { stringToFunction } from '@gmod/jbrowse-core/util/functionStrings'
import saveAs from 'file-saver'
import { getSnapshot, types } from 'mobx-state-tree'

export const MenuItemModel = types
  .model('MenuItemModel', {
    name: types.string,
    icon: types.optional(types.string, ''),
    callback: types.optional(
      types.string,
      'function(model){console.log(model)}',
    ),
  })
  .views(self => ({
    get func() {
      const action = this.getAction(self.callback)
      if (action) return action
      return stringToFunction(self.callback)
    },
  }))
  .actions(self => ({
    getAction(action) {
      return this[action]
    },
    openAbout() {
      const session = getSession(self)
      if (!session.drawerWidgets.get('aboutDrawerWidget'))
        session.addDrawerWidget('AboutDrawerWidget', 'aboutDrawerWidget')
      session.showDrawerWidget(session.drawerWidgets.get('aboutDrawerWidget'))
    },
    openHelp() {
      const session = getSession(self)
      if (!session.drawerWidgets.get('helpDrawerWidget'))
        session.addDrawerWidget('HelpDrawerWidget', 'helpDrawerWidget')
      session.showDrawerWidget(session.drawerWidgets.get('helpDrawerWidget'))
    },
    openConfigurationImport() {
      const session = getSession(self)
      if (!session.drawerWidgets.get('importConfigurationDrawerWidget'))
        session.addDrawerWidget(
          'ImportConfigurationDrawerWidget',
          'importConfigurationDrawerWidget',
        )
      session.showDrawerWidget(
        session.drawerWidgets.get('importConfigurationDrawerWidget'),
      )
    },
    exportConfiguration() {
      const session = getSession(self)
      const initialSnap = JSON.stringify(getSnapshot(session.configuration))
      const filter = (key, value) => {
        if (key === 'configId' || key === 'id') {
          const re = new RegExp(`"${value}"`, 'g')
          if ((initialSnap.match(re) || []).length < 2) return undefined
        }
        return value
      }
      const configSnap = JSON.stringify(
        getSnapshot(session.configuration),
        filter,
        '  ',
      )
      saveAs(new Blob([configSnap]), 'jbrowse_configuration.json')
      return configSnap
    },
    importConfiguration() {
      self.openConfigurationImport()
    },
  }))

const MenuModel = types
  .model('MenuModel', {
    name: types.string,
    menuItems: types.array(MenuItemModel),
  })
  .actions(self => ({
    addMenuItem({ name, icon = undefined, callback = undefined }) {
      self.menuItems.push(MenuItemModel.create({ name, icon, callback }))
    },
  }))

export default types
  .model('MainMenuBarModel', {
    id: ElementId,
    type: types.literal('MainMenuBar'),
    menus: types.array(MenuModel),
  })
  .actions(self => ({
    afterCreate() {
      self.pushMenu({
        name: 'Help',
        menuItems: [
          { name: 'About', icon: 'info', callback: 'openAbout' },
          { name: 'Help', icon: 'help', callback: 'openHelp' },
        ],
      })
    },
    unshiftMenu({ name, menuItems = [] }) {
      self.menus.unshift(MenuModel.create({ name, menuItems }))
    },
    pushMenu({ name, menuItems = [] }) {
      self.menus.push(MenuModel.create({ name, menuItems }))
    },
  }))
