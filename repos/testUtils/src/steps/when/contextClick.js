const { When } = require('@GTU/Parkin')
const { getPage } = require('@GTU/Playwright')

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
const contextClick = async selector => {
  const page = await getPage()
  /**
   * Based on the element we are interacting with
   * There are times where using a locator in not consistent
   * For example dynamically created menu, with items that only exist when the menu is active
   * This can also happen with select drop downs
   * A good example is in Material UI 
   */
  await page.evaluate(({ selector }) => document.querySelector(selector).click(), { selector })

}

const meta = {
  module: `contextClick`,
  examples: [
    `When I click "button[name='unique_name']" in context`,
    `When I click the element "button[name='unique_name']" in context`,
  ],
  description: `Gets the page context, locate an element by selector and click it within the context of the page.\nThere are times finding an element in not consistent due to its dynamic nature. For example a dynamically created drop-down menu, with items that only exist when the menu is active. This common in component libraries such as Material UI.\nIf the test is having issues with clicking an element, using this step could help.`,
  expressions: [
    {
      type: 'string',
      description: `The element selector.  Selector must be specific enough to locate a single element.`,
      example: "button[name='unique_name']",
    },
  ],
}

When('I click {string} in context', contextClick, meta)
When('I click the {string} in context', contextClick, meta)

module.exports = {
  contextClick,
}
