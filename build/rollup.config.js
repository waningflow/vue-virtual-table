// rollup.config.js
import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
import minimist from 'minimist'
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only'

const argv = minimist(process.argv.slice(2))

const baseConfig = {
  input: 'src/entry.js',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    resolve(),
    commonjs(),
    vue({
      css: true,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    css(),
    babel()
  ]
}

// UMD/IIFE shared settings: externals and output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  // eg. 'jquery'
]
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
}

// Customize configs for individual targets
const buildFormats = []
if (!argv.format || argv.format === 'es') {
  const esConfig = {
    ...baseConfig,
    output: {
      file: 'dist/vue-virtual-table.esm.js',
      format: 'esm',
      exports: 'named'
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        output: {
          ecma: 6
        }
      })
    ]
  }
  buildFormats.push(esConfig)
}

if (!argv.format || argv.format === 'umd') {
  const umdConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: 'dist/vue-virtual-table.umd.js',
      format: 'umd',
      name: 'VueVirtualTable',
      exports: 'named',
      globals
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        output: {
          ecma: 6
        }
      })
    ]
  }
  buildFormats.push(umdConfig)
}

if (!argv.format || argv.format === 'iife') {
  const unpkgConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: 'dist/vue-virtual-table.min.js',
      format: 'iife',
      name: 'VueVirtualTable',
      exports: 'named',
      globals
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        output: {
          ecma: 5
        }
      })
    ]
  }
  buildFormats.push(unpkgConfig)
}

// Export config
export default buildFormats
