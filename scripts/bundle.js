const path = require('path')
const aliasPlugin = require('esbuild-plugin-path-alias')
const {aliases, registerAliases} = require('../configs/aliases.config')
const rootDir = path.join(__dirname, '../')
const backend = path.join(__dirname, '../repos/backend')
const screencast = path.join(__dirname, '../repos/screencast')

registerAliases()

require('esbuild').build({
  bundle: true,
  format: 'cjs',
  platform: 'node',
  logLevel: 'info',
  minify: false,
  external: [
    `playwright`,
    `module-alias`
  ],
  absWorkingDir: rootDir,
  entryPoints: [
    path.join(backend, `index.js`),
    path.join(screencast, `index.js`),
  ],
  outdir: path.join(rootDir, 'bundle'),
  plugins: [
    aliasPlugin(aliases),
  ]
})
.then(result => {
  console.log(result)
})
.catch(() => process.exit(1))