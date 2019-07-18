import { getSnapshot } from 'mobx-state-tree'
import { createTestEnv } from '@gmod/jbrowse-web/src/JBrowse'
import MyPlugin from './index'

describe('Search drawer', () => {
  let pluginManager

  beforeAll(async () => {
    ;({ pluginManager } = await createTestEnv({ configId: 'testing' }))
  })

  it("won't add if already added", () => {
    expect(() => pluginManager.addPlugin(new MyPlugin())).toThrow(
      /JBrowse already configured, cannot add plugins/,
    )
  })

  it('adds search drawer widget', () => {
    const SearchDrawerWidget = pluginManager.getDrawerWidgetType(
      'SearchDrawerWidget',
    )
    const config = SearchDrawerWidget.configSchema.create({
      type: 'SearchDrawerWidget',
    })
    expect(getSnapshot(config)).toMatchSnapshot({
      configId: expect.any(String),
    })
  })
})
