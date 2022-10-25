const path = require('path')
const {transformSync} = require('esbuild')
const { getWorld } = require('@gobletqa/shared/repo/world')
const { default:createCacheKeyFunction } = require('@jest/create-cache-key-function')

const loaders = ['js', 'jsx', 'ts', 'tsx']
const nodeVersion = process.env.NODE_ENV === 'test' ? '16' : process.versions.node

module.exports = {
  getCacheKey: createCacheKeyFunction([], []),
  process: (src, file, options) => {

    const name = file.split('/').pop()
    const extname = path.extname(file)
    const world = getWorld()
    const worldStr = JSON.stringify(world)

    const {
      map,
      code:transformCode,
    } = transformSync(src, {
      format: 'cjs',
      sourcefile: file,
      sourcemap: 'inline',
      target: `node${nodeVersion}`,
      loader: loaders.find(ext => `.${ext}` === extname)|| 'js',
    })

    /**
     * Wrap the transformed waypoint script in a single test
     * Ensure Jest doesn't throw or complain having no tests
     * It also allows us to use the same jest-html-test reporter
     */
    const code = [
      `describe('Goblet Waypoint', () => {`,
      `  test('Executing File: ${name}', async () => {`,
      `     delete jest.resetMocks`,
      `     delete jest.resetAllMocks`,
      `     delete jest.resetModules`,
      `     delete jest.resolver`,
      `     delete jest.restoreAllMocks;`,
      `     const $world = ${worldStr};`,
      `    ${transformCode}`,
      `  })`,
      `})`
    ].join(`\n`)

    return {
      map,
      code,
    }
  }
}
