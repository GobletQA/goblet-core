const babelJest = require('babel-jest')
const { createHash } = require('crypto')
const { getWorld } = require('@GTU/Support')

/**
 * Custom jest transformer for wrapping waypoint scripts in a test method
 *
 * @return {Object} - Jest custom transformer model object
 */
 module.exports = {
  getCacheKey(fileData, filename, ...rest) {
    const babelCacheKey = babelJest.getCacheKey(fileData, filename, ...rest)

    return createHash('md5')
      .update(babelCacheKey)
      .update('goblet')
      .digest('hex')
  },
  process(src, filename, ...rest) {
    const name = filename.split('/').pop()
    const world = getWorld()
    const worldStr = JSON.stringify(world)

    /**
     * Wrap the waypoint script in a single test
     * Ensure Jest doesn't throw or complain having no tests
     * It also allows us to use the same jest-html-test reporter
     */
    const content = [
      `describe('Goblet Waypoint', () => {`,
      `  test('Executing File: ${name}', async () => {`,
      `     delete jest.resetMocks`,
      `     delete jest.resetAllMocks`,
      `     delete jest.resetModules`,
      `     delete jest.resolver`,
      `     delete jest.restoreAllMocks;`,
      `     const $world = ${worldStr};`,
      `    ${src}`,
      `  })`,
      `})`
    ].join(`\n`)

    return babelJest.process(content, filename, ...rest);
  },
}
