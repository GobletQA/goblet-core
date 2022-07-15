const { When } = require('@GTU/Parkin')
const { getLocator } = require('@GTU/Playwright')

/**
 * Sets the input text of selector to data
 * @param {string} selector - valid playwright selector
 * @param {string} data - set selector text to `data`
 * @param {Object} world
 */
const focusElement = async (selector) => {
  const element = await getLocator(selector)
  return await element.focus()
}

const meta = {
  module: `focusElement`,
  examples: [
    `When I focus on the element "input[name=email]"`
  ],
  description: `Locates element and focuses on a specific element.`,
  expressions: [
    {
      type: 'string',
      description: `The selector for a single input element.`,
      example: 'input[name=email]',
    },
  ],
}

When('I focus on {string}', focusElement, meta)
When('I focus on the element {string}', focusElement, meta)

module.exports = { focusElement }
