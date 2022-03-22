const { Then } = require('HerkinParkin')
const { getBrowserContext } = require('HerkinTestEnv')
const { getPage } = getBrowserContext()

/**
 * Checks that element, matching `selector`, value (input & textarea elements) or textContent, contains `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - text to compare to selector value/textContent
 */
const resultText = async (selector, text) => {
  const page = await getPage()
  const textContent = await page.textContent(`${selector}:has-text("${text}")`)
  expect(textContent).toEqual(expect.stringContaining(text))
}

Then(
  'the results items {string} should include the text {string}',
  resultText,
  {
    description: `Locates an element by selector in google search results page and verifies an element contains text.
  
Module : resultText`,
    expressions: [
      {
        type: 'string',
        description: `The selector for the element.  Selector must be specific enough to locate a single element.`,
        example: '#search',
      },
      {
        type: 'string',
        description: `The text of the element to verify.`,
        example: 'what do goats eat',
      },
    ],
  }
)

module.exports = { resultText }
