const { Given } = require('@GTU/Parkin')
const { getPage } = require('@GTU/Playwright')

/**
 * Calls page.pause to stop test execution until playwright.resume() is called
 * Should be used for debugging only when running with a headed browser
 */
const pagePause = async (world) => {
  const page = await getPage()
  await page.pause()
}

Given('I pause the page', pagePause, {
  module : `pagePause`,
  description: `Pauses the steps execution of a feature. Should be used for debugging only.`,
  expressions: [],
})

module.exports = { pagePause }
