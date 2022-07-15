const { Given } = require('@GTU/Parkin')
const { getLocators } = require('@GTU/Playwright')
const { greaterLessEqual } = require('@GTU/Support/helpers')

/**
 * Expects the number of dom elements matching `selector` to match `count` based on the comparison screen
 * @param {string} selector - valid playwright selector
 * @param {number} count - expected number of selectors in the DOM
 */
const greaterThanLessThan = async (selector, type, count) => {
  const elements = await getLocators(selector)
  const current = await elements.count()

  greaterLessEqual(current, count, type)
}

Given('the count of {string} is {string} than/to {int}', greaterThanLessThan, {
  module : `greaterThanLessThan`,
  description: `Locates elements by selector and verifies count is greater than or less than a number`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the elements.`,
      example: 'div.listing',
    },
    {
      type: 'string',
      description: `The word or symbol that defines the validation check. Must be one of ${greaterLessEqual.matchTypes}`,
      example: '<',
    },
    {
      type: 'int',
      description: `Integer. The count to verify.`,
      example: '5',
    },
  ],
})

module.exports = { greaterThanLessThan }
