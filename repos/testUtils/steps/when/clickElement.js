const { When } = require('HerkinParkin')
const { getBrowserContext } = require('HerkinTestEnv')
const { getPage } = getBrowserContext()
const { getLocator } = require('HerkinPlaywright')

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
const clickElement = async selector => {
  const page = await getPage()
  // Actionability checks (Auto-Waiting) seem to fail in headless mode
  // So we use locator.waitFor to ensure the element exist on the dom
  // Then pass {force: true} options to page.click because we know it exists
  await getLocator(selector)
  return page.click(selector, {
    force: true
  })

}

When('I click the element {string}', clickElement, {
  description: `Locates an element by selector and clicks it.

Module : clickElement`,
  expressions: [
    {
      type: 'string',
      description: `The element selector.  Selector must be specific enough to locate a single element.`,
      example: "button[name='unique_name']",
    },
  ],
})

module.exports = {
  clickElement,
}
