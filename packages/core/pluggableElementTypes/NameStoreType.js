import PluggableElementType from './PluggableElementBase'

export default class NameStoreType extends PluggableElementType {
  constructor(stuff, subClassDefaults = {}) {
    super(stuff, subClassDefaults)
    if (!this.AdapterClass) {
      throw new Error(
        `no AdapterClass defined for name store type ${this.name}`,
      )
    }
  }
}
