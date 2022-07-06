import { transformAsync } from '@babel/core'

import { infernoDevtoolsPlugin } from './devtools.js'

import { createFilter } from '@rollup/pluginutils'

import type { Plugin, ResolvedConfig } from 'vite'
import type { ParserPlugin } from '@babel/parser'
import type { InfernoPluginOptions, InfernoBabelOptions } from './types'

function parseId(url: string) {
  return { id: url.split('?', 2)[0] }
}

// Taken from https://github.com/vitejs/vite/blob/main/packages/plugin-react/src/index.ts
export default function infernoPlugin({
  devtoolsInProd,
  include,
  exclude,
  babel,
}: InfernoPluginOptions = {}): Plugin[] {
  let config: ResolvedConfig

  let babelOptions = {
    babelrc: false,
    configFile: false,
    ...babel,
  } as InfernoBabelOptions

  babelOptions.plugins ?? (babelOptions.plugins = [])
  babelOptions.presets ?? (babelOptions.presets = [])
  babelOptions.overrides ?? (babelOptions.overrides = [])
  babelOptions.parserOpts ?? (babelOptions.parserOpts = {} as any)
  babelOptions.parserOpts.plugins ?? (babelOptions.parserOpts.plugins = [])

  const shouldTransform = createFilter(include || [/\.[tj]sx?$/], exclude || [/node_modules/])

  return [
    {
      name: 'inferno:config',
      config() {
        return {
          resolve: {},
        }
      },
    },
    {
      // jsxPlugin
      name: 'vite:inferno-jsx',
      enforce: 'pre',
      config() {
        return {}
      },
      configResolved(resolvedConfig) {
        config = resolvedConfig ?? {}
      },
      async transform(code, url) {
        // Ignore query parameters, as in Vue SFC virtual modules.
        const { id } = parseId(url)

        if (!shouldTransform(id)) return

        const parserPlugins = [
          'importMeta',
          // This plugin is applied before esbuild transforms the code,
          // so we need to enable some stage 3 syntax that is supported in
          // TypeScript and some environments already.
          'topLevelAwait',
          'classProperties',
          'classPrivateProperties',
          'classPrivateMethods',
          !id.endsWith('.ts') && 'jsx',
          /\.tsx?$/.test(id) && 'typescript',
        ].filter(Boolean) as ParserPlugin[]

        const result = await transformAsync(code, {
          ...babelOptions,
          ast: true,
          root: config.root,
          filename: id,
          parserOpts: {
            ...babelOptions.parserOpts,
            sourceType: 'module',
            allowAwaitOutsideFunction: true,
            plugins: parserPlugins,
          },
          generatorOpts: {
            ...babelOptions.generatorOpts,
            decoratorsBeforeExport: true,
          },
          plugins: [
            ...babelOptions.plugins,
            [
              config.isProduction
                ? '@babel/plugin-transform-react-jsx'
                : '@babel/plugin-transform-react-jsx-development',
            ],
            ...(config.isProduction
              ? ['babel-plugin-inferno']
              : ['babel-plugin-transform-hook-names', 'babel-plugin-inferno']),
          ],
          sourceMaps: true,
          inputSourceMap: false as any,
        })

        // NOTE: Since no config file is being loaded, this path wouldn't occur.
        if (!result) return

        return {
          code: result.code || code,
          map: result.map,
        }
      },
    } as Plugin,
    infernoDevtoolsPlugin({ injectInProd: devtoolsInProd, shouldTransform }),
  ]
}
