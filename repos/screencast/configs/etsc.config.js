const path = require("path")
const aliasPlugin = require('esbuild-plugin-path-alias')
const aliasConfig = path.join(process.cwd().split(`/repos`).shift(), `configs/aliases.config`)
const { aliases } = require(aliasConfig)

const rootDir = path.join(__dirname, `..`)
const outDir = path.join(rootDir, `dist`)
const entryFile = path.join(rootDir, `index.js`)

/**
 * Custom plugin to filter out node_modules
 * See more info [here](https://github.com/evanw/esbuild/issues/619#issuecomment-751995294) 
 */
const externalPlugin = {
  name: 'external-node-modules',
  setup(build) {
    // Must not start with "/" or "./" or "../" which means it's a node_modules
    const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/
    build.onResolve({ filter }, args => ({ path: args.path, external: true }))
  },
}

module.exports = {
  outdir: outDir,
  esbuild: {
    bundle: true,
    clear: false,
    minify: false,
    sourcemap: true,
    target: "es2015",
    platform: "node",
    entry: entryFile,
    allowOverwrite: true,
    plugins: [
      aliasPlugin(aliases),
      externalPlugin,
    ],
  },
};