const { getPage } = require('@GTU/Playwright/browserContext')

/**
 * @param {String} selector
 * @return {Locator?} - the Playwright.Locator object found with `selector`, or null if it does not exist
 */
const getLocator = async (selector, waitFor=true) => {
  const page = await getPage()
  const element = await page.locator(selector)
  if (!element) throw new Error(`The element with selector "${selector}" could not be found.`)

  waitFor && await element.waitFor()

  return element
}

module.exports = { getLocator }
