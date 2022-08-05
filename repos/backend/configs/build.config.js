require('../resolveRoot')
const path = require('path')
const hq = require('alias-hq')
const { spawn } = require('child_process')
const { loadConfigs } = require('@keg-hub/parse-config')
const { aliases } = require('@GConfigs/aliases.config')
// eslint-disable-next-line import/no-extraneous-dependencies
const { build } = require('esbuild')
// eslint-disable-next-line import/no-extraneous-dependencies
const aliasPlugin = require('esbuild-plugin-path-alias')

let __server
const isDev = process.env.DEV_BUILD === `1`
const nodeEnv = process.env.NODE_ENV || `local`
const rootDir = path.join(__dirname, `../`)
const distDir = path.join(rootDir, `dist`)
const outFile = path.join(distDir, `index.js`)
const entryFile = path.join(rootDir, `index.js`)

/**
 * Load the ENVs from <node-env>.env ( local.env || prod.env )
 */
const envs = loadConfigs({
  noYml: true,
  env: nodeEnv,
  name: 'goblet',
  locations: [hq.get(`webpack`)[`@root`]],
})

/**
 * Helper to start the dev server after bundling the app
 */
const devServer = async () => {
  if (!isDev) return

  __server = spawn('nodemon', [`--config`, `configs/nodemon.config.json`], {
    cwd: rootDir,
    env: { ...envs, ...process.env },
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  })

  __server.stdout.on('data', (data) => process.stdout.write(data))
  __server.stderr.on('data', (data) => process.stderr.write(data))
  process.on(`exit`, () => __server && __server.pid && process.kill(__server.pid))
}

/**
 * Build the code, then run the devServer
 * ESBuild config object
 * [See here for more info](https://esbuild.github.io/api/#build-api)
 */
build({
  outfile: outFile,
  bundle: true,
  minify: false,
  sourcemap: true,
  target: 'es2017',
  platform: 'node',
  assetNames: '[name]',
  allowOverwrite: true,
  entryPoints: [entryFile],
  watch: isDev && {
    onRebuild(error, result) {
      if (error) console.error(`Error rebuilding app`, error)
      else console.log(`Rebuilt app successfully`, result)
      __server && __server.send('restart')
    },
  },
  plugins: [
    aliasPlugin(aliases),
    /**
     * Custom plugin to filter out node_modules
     * See more info [here](https://github.com/evanw/esbuild/issues/619#issuecomment-751995294)
     */
    {
      name: 'external-node-modules',
      setup(build) {
        // Must not start with "/" or "./" or "../" which means it's a node_modules
        // eslint-disable-next-line no-useless-escape
        const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/
        build.onResolve({ filter }, (args) => ({
          path: args.path,
          external: true,
        }))
      },
    },
  ],
}).then(devServer)
