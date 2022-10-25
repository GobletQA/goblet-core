const path = require('path')
const {transformSync} = require('esbuild')
const { getWorld } = require('@GTU/Support/world')
const { default:createCacheKeyFunction } = require('@jest/create-cache-key-function')

const loaders = ['js', 'jsx', 'ts', 'tsx']
const nodeVersion = process.env.NODE_ENV === 'test' ? '16' : process.versions.node



module.exports = {
  getCacheKey: createCacheKeyFunction([], []),
  process: (src, file, options) => {
    const methodName = `Method${new Date().getTime()}`
    const wrapped = [
      `const ${methodName} = async () => {`,
      `  ${src}`,
      `};`,
    ].join('\n')

    const name = file.split('/').pop()
    const extname = path.extname(file)
    const world = getWorld()
    const worldStr = JSON.stringify(world)

    const {
      map,
      code:transformCode,
    } = transformSync(wrapped, {
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
      `     ${transformCode}`,
      `     ;await ${methodName}()`,
      `  })`,
      `})`
    ].join(`\n`)

    return {
      map,
      code,
    }
  }
}
