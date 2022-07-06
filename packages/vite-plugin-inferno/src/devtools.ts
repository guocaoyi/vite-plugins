import { Plugin, ResolvedConfig, normalizePath } from 'vite'
import path from 'path'
import debug from 'debug'

import type { RollupFilter } from './types'

function parseId(url: string) {
  return { id: url.split('?', 2)[0] }
}

export interface DevtoolsPluginOptions {
  /**  */
  injectInProd?: boolean
  /**  */
  shouldTransform: RollupFilter
}

export function infernoDevtoolsPlugin({
  injectInProd = false,
  shouldTransform,
}: DevtoolsPluginOptions): Plugin {
  const log = debug('vite:inferno-devtools')

  let entry = ''
  let config: ResolvedConfig
  let found = false

  return {
    name: 'inferno:devtools',

    // Ensure that we resolve before everything else
    enforce: 'pre',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    resolveId(url, importer = '') {
      const { id } = parseId(url)

      // Get the main entry file to inject into
      if (!found && /\.html$/.test(importer) && shouldTransform(id)) {
        found = true

        entry = normalizePath(path.join(config.root, id))

        // TODO: Vite types require explicit return
        // undefined here. They're lacking the "void" type
        // in their declarations
        return undefined
      }
    },
  } as Plugin
}
