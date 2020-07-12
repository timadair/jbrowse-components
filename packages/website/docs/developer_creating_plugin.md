---
id: developer_creating_plugin
title: Creating a new plugin
---

JBrowse 2 plugins can be used to add track types, view types, data adapter. For
a full list, see the [pluggable elements](developer_pluggable_elements) page.
The plugins can also extend logic in many arbitary ways beyond even adding
these elements too.

We will go over creating an example plugin. The first thing that we have is a
`src/index.js` which exports a default class containing the plugin registration
code

src/index.js

```js
import AdapterType from '@gmod/jbrowse-core/pluggableElementTypes/AdapterType'
import Plugin from '@gmod/jbrowse-core/Plugin'
import { AdapterClass, configSchema } from './UCSCAdapter'

export default class UCSCPlugin extends Plugin {
  install(pluginManager) {
    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'UCSCAdapter',
          configSchema,
          AdapterClass,
        }),
    )
  }
}
```

src/UCSCAdapter/index.ts

```js
import { ConfigurationSchema } from '@gmod/jbrowse-core/configuration'
import { ObservableCreate } from '@gmod/jbrowse-core/util/rxjs'
import { readConfObject } from '@gmod/jbrowse-core/configuration'

export const configSchema = ConfigurationSchema(
  'UCSCAdapter',
  {
    baseUrl: {
      type: 'fileLocation',
      description: 'base URL for the API, in case a different UCSC installation is used',
      defaultValue: { uri: 'https://api.genome.ucsc.edu/' },
    },
    track: {
      type: 'string',
      description: 'the track to select data from',
      defaultValue: '',
    },
  },
  { explicitlyTyped: true },
)


export class AdapterClass extends BaseFeatureDataAdapter {
  constructor(config) {
    super(config)
    this.config = config
  }

  getFeatures(region) {
    const { assemblyName, start, end, refName } = region
    return new ObservableCreate(async observer => {
      const base = readConfObject(this.config, 'baseUrl')
      const track = readConfObject(this.config, 'track')
      try {
        const result = await fetch(`${base}/getData/track?` +
           `genome=${assemblyName};track=${track};` +
           `chrom=${refName};start=${start};end=${end}')
        if(result.ok) {
          const data = await result.json()
          data[track].forEach(feature => {
            observer.next(new SimpleFeature({
              ...feature
              start: feature.chromStart,
              end: feature.chromEnd,
              refName: feature.chrom,
              uniqueId: feature.ID,
            })
          })
          observer.complete()
        }
      } catch(e) {
        observer.error(e)
      }
    })
  }
}
```

[Example response from the UCSC
API](https://api.genome.ucsc.edu/getData/track?genome=galGal6;track=ncbiRefSeqOther;chrom=chr1;start=750000;end=55700000)
illustrates the code we're using to
return these features

I hope this example helps to illustrate that a simple plugin can be built that
demonstrates a data adapter
