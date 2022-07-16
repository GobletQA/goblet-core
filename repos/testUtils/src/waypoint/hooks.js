/**
 * 
 */
const { initialize, cleanup } = require('@GTU/PlaywrightEnv')
const { getBrowserContext } = require('@GTU/Playwright/browserContext')

/**
 * Add wrap method to ensure no arguments are passed to initialize and cleanup
 */
beforeAll(async () => {
  await initialize()
  const { getPage } = getBrowserContext()
  global.page = await getPage()
})

afterAll(async () => {
  await cleanup()
  global.page = undefined
})
