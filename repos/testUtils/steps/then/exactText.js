const { Then } = require('HerkinParkin')
const { getBrowserContext } = require('HerkinTestEnv')
const { getPage } = getBrowserContext()

/**
 * Checks that element, matching `selector`, value (input & textarea elements) or textContent, is equal to `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - text to compare to selector value/textContent
 */
const exactText = async (selector, data) => {
  const page = await getPage()

  //get element tagName
  const getElTagName = await page.$eval(selector, el => el.tagName)

  // If tagName is (input or textarea) use value else use textContent
  const content =
    getElTagName === 'INPUT' || getElTagName === 'TEXTAREA'
      ? await page.$eval(selector, el => el.value)
      : await page.$eval(selector, el => el.textContent)

  //assert element text contains expected text
  expect(content).toEqual(data)
}

const meta = {
  module: `exactText`,
  description: `Locates an element by selector and verifies element text matches exactly.`,
  examples: [
    `Then the element "div.name" text is "Mr. Goblet"`
  ],
  expressions: [
    {
      type: 'string',
      description: `The selector for a single element.`,
      example: '#search',
    },
    {
      type: 'string',
      description: `The text of the element to verify.`,
      example: 'cucumber',
    },
  ],
}

Then('{string} text is {string}', exactText, meta)
Then('the element {string} text is {string}', exactText, meta)

module.exports = { exactText }
