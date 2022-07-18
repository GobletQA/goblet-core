/**
 * 
 */
const { getPage } = require('@GTU/Playwright')
const { initialize, cleanup } = require('@GTU/PlaywrightEnv')

/**
 * Add wrap method to ensure no arguments are passed to initialize and cleanup
 */
beforeAll(async () => {
  await initialize()
  global.page = await getPage()
})

afterAll(async () => {
  await cleanup()
  global.page = undefined
})
