const { Then } = require('@GTU/Parkin')
const { getLocator, getPage } = require('@GTU/Playwright')

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
const generalAction = async (action, selector) => {
  const page = await getPage()
  await getLocator(selector)
  return page[action](selector, { force: true })
}

const meta = {
  module: `general-action`,
  examples: [
    `Given I click "button[name='submit']"`,
    `When I check "input[name='checkbox']"`,
    `Then I uncheck "input[name='checkbox']"`,
  ],
  description: `Locates an element by selector and preforms an action on it.`,
  expressions: [
    {
      type: 'word',
      description: `The action to perform on the element`,
      example: "click",
    },
    {
      type: 'string',
      description: `The element selector.  Selector must be specific enough to locate a single element.`,
      example: "button[name='unique_name']",
    },
  ],
}

Then('I {word} {word}', generalAction, meta)
Then('I {word} {string}', generalAction, meta)
Then('I {word} the {word}', generalAction, meta)
Then('I {word} the {string}', generalAction, meta)


module.exports = {
  generalAction,
}
