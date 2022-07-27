const path = require("path")
const aliasPlugin = require('esbuild-plugin-path-alias')
const aliasConfig = path.join(process.cwd().split(`/repos`).shift(), `configs/aliases.config`)
const { aliases } = require(aliasConfig)

const rootDir = path.join(__dirname, `..`)
const outfile = path.join(rootDir, `dist/index.js`)
const entryFile = path.join(rootDir, `src/app.js`)
const appTSConf = path.join(rootDir, `tsconfig.app.json`)
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
  esbuild: {
    outfile,
    bundle: true,
    clear: false,
    minify: false,
    sourcemap: true,
    target: "es2015",
    platform: "node",
    entry: entryFile,
    tsconfig: appTSConf,
    allowOverwrite: true,
    plugins: [
      aliasPlugin(aliases),
      externalPlugin,
    ],
  },
};