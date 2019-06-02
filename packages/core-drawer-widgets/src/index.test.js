import { getSnapshot } from 'mobx-state-tree'
import { createTestEnv } from '@gmod/jbrowse-web/src/JBrowse'
import MyPlugin from './index'

describe('Core Drawer Widgets', async () => {
  let pluginManager

  beforeAll(async () => {
    ;({ pluginManager } = await createTestEnv({ configId: 'testing' }))
  })

  it("won't add if already added", () => {
    expect(() => pluginManager.addPlugin(new MyPlugin())).toThrow(
      /JBrowse already configured, cannot add plugins/,
    )
  })

  it('adds track add widget', () => {
    const AddTrackDrawerWidget = pluginManager.getDrawerWidgetType(
      'AddTrackDrawerWidget',
    )
    const config = AddTrackDrawerWidget.configSchema.create({
      type: 'AddTrackDrawerWidget',
    })
    expect(getSnapshot(config)).toMatchSnapshot({
      configId: expect.any(String),
    })
  })

  it('adds config editor drawer widget', () => {
    const ConfigurationEditorDrawerWidget = pluginManager.getDrawerWidgetType(
      'ConfigurationEditorDrawerWidget',
    )
    const config = ConfigurationEditorDrawerWidget.configSchema.create({
      type: 'ConfigurationEditorDrawerWidget',
    })
    expect(getSnapshot(config)).toMatchSnapshot({
      configId: expect.any(String),
    })
  })

  it('adds data hub manager', () => {
    const DataHubDrawerWidget = pluginManager.getDrawerWidgetType(
      'DataHubDrawerWidget',
    )
    const config = DataHubDrawerWidget.configSchema.create({
      type: 'DataHubDrawerWidget',
    })
    expect(getSnapshot(config)).toMatchSnapshot({
      configId: expect.any(String),
    })
  })

  it('adds hierarchical track selector', () => {
    const HierarchicalTrackSelectorDrawerWidget = pluginManager.getDrawerWidgetType(
      'HierarchicalTrackSelectorDrawerWidget',
    )
    const config = HierarchicalTrackSelectorDrawerWidget.configSchema.create({
      type: 'HierarchicalTrackSelectorDrawerWidget',
    })
    expect(getSnapshot(config)).toMatchSnapshot({
      configId: expect.any(String),
    })
  })
})
