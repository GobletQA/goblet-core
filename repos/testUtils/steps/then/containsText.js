const { Then } = require('HerkinParkin')
const { getBrowserContext } = require('HerkinTestEnv')
const { getPage } = getBrowserContext()

/**
 * Checks that element, matching `selector`, value (input & textarea elements) or textContent, contains `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - text to compare to selector value/textContent
 */
const containsText = async (selector, data) => {
  const page = await getPage()

  const locator = await page.locator(selector)
  const { tagName, textContent, value } = await locator.evaluate(el => ({
    value: el.value,
    tagName: el.tagName,
    textContent: el.textContent,
  }))

  //if tagName is (input or textarea) use value else use textContent
  const content =
    tagName === 'INPUT' || tagName === 'TEXTAREA' ? value : textContent

  //assert element text contains expected text
  expect(content).toEqual(expect.stringContaining(data))
}

Then('the element {string} contains the text {string}', containsText, {
  description: `Locates an element by selector and verifies element contains text.
  
Module : containsText`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the element.  Selector must be specific enough to locate a single element.`,
      example: 'div.weather-container >> div.temp',
    },
    {
      type: 'string',
      description: `The text of the element to verify.`,
      example: '85°',
    },
  ],
})

module.exports = { containsText }
