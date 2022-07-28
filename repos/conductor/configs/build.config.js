const path = require("path")
const { build } = require('esbuild');
const { spawn } = require('child_process');
const aliasPlugin = require('esbuild-plugin-path-alias')
const aliasConfig = path.join(process.cwd().split(`/repos`).shift(), `configs/aliases.config`)
const { aliases } = require(aliasConfig)

const isDev = process.env.DEV_BUILD === `1`
const rootDir = path.join(__dirname, `..`)
const outDir = path.join(rootDir, `dist`)
const outFile = path.join(outDir, `index.js`)
const entryFile = path.join(rootDir, `src/app.js`)

/**
 * Helper to start the dev server after bundling the app
 */
const devServer = async () => {
  if (!isDev) return;

  __server = spawn('nodemon', [`--config`, `configs/nodemon.config.json`], {
    cwd: rootDir,
    env: process.env,
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  });

  __server.stdout.on('data', (data) => process.stdout.write(data));
  __server.stderr.on('data', (data) => process.stderr.write(data));
};

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
  target: 'es2015',
  platform: 'node',
  allowOverwrite: true,
  entryPoints: [entryFile],
  watch: isDev && {
    onRebuild(error, result) {
      if (error) console.error(`Error rebuilding app`, error);
      else console.log(`Rebuilt app successfully`, result);
      __server && __server.send('restart');
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
        const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
        build.onResolve({ filter }, (args) => ({
          path: args.path,
          external: true,
        }));
      },
    },
  ],
}).then(devServer);
