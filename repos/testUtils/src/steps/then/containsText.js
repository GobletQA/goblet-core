const { Then } = require('@GTU/Parkin')
const { getLocatorContent } = require('@GTU/Support/helpers')

/**
 * Checks that element, matching `selector`, value (input & textarea elements) or textContent, contains `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - text to compare to selector value/textContent
 */
const containsText = async (selector, data) => {
  const content = await getLocatorContent(selector)
  expect(content).toEqual(expect.stringContaining(data))
}

const meta = {
  module: `containsText`,
  description: `Locates an element by selector and verifies element contains text.`,
  examples: [
    `Then the element "div.temp" contains the text "85°"`,
  ],
  expressions: [
    {
      type: 'string',
      description: `The selector for a single element.`,
      example: 'div.weather-container >> div.temp',
    },
    {
      type: 'string',
      description: `The text of the element to verify.`,
      example: '85°',
    },
  ],
}

Then('{string} contains {string}', containsText, meta)
Then('{string} contains the text {string}', containsText, meta)
Then('the element {string} contains the text {string}', containsText, meta)

module.exports = { containsText }
