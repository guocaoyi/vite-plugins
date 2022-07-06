import type { CreateFilter } from '@rollup/pluginutils'
import type { FilterPattern } from '@rollup/pluginutils'
import type { ParserOptions } from '@babel/parser'
import type { TransformOptions } from '@babel/core'

export type BabelOptions = Omit<
  TransformOptions,
  'ast' | 'filename' | 'root' | 'sourceFileName' | 'sourceMaps' | 'inputSourceMap'
>

export interface InfernoPluginOptions {
  /**
   * Inject devtools bridge in production bundle instead of only in development mode.
   * @default false
   */
  devtoolsInProd?: boolean
  /**
   * RegExp or glob to match files to be transformed
   */
  include?: FilterPattern

  /**
   * RegExp or glob to match files to NOT be transformed
   */
  exclude?: FilterPattern

  /**
   * Babel configuration applied in both dev and prod.
   */
  babel?: BabelOptions
}

export interface InfernoBabelOptions extends BabelOptions {
  plugins: Extract<BabelOptions['plugins'], any[]>
  presets: Extract<BabelOptions['presets'], any[]>
  overrides: Extract<BabelOptions['overrides'], any[]>
  parserOpts: ParserOptions & {
    plugins: Extract<ParserOptions['plugins'], any[]>
  }
}

export type RollupFilter = ReturnType<CreateFilter>
