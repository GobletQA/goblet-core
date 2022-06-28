const { Given } = require('HerkinParkin')
const { getLocator } = require('HerkinPlaywright')
const { cleanWorldPath } = require('HerkinSupport/helpers')

/**
 * Finds the element matching selector returned from selectorAlias, and registers it as the current ancestor
 * @param {string} selector - valid playwright selector
 * @param {string} alias - mapped selector alias if there is one otherwise the word `selector`
 * @param {string} data - if mapped alias exists then this is the on-screen text of the selector.  if no mapped alias exists then this is the selector + on-screen text of the element
 * @param {Object} world
 */
const saveElementFromSelector = async (selector, worldPath, world) => {
  const element = getLocator(selector)
  const cleaned = cleanWorldPath(worldPath)

  set(world, cleaned, { selector, element })

  return element
}

Given('{string} is saved as {string}', saveElementFromSelector, {
  description: `Locates and saves an element for use in subsequent steps.`,
  module: `findElAsAncestor`,
  examples: [
    `Given ".item[data-test-id='the-goblet-pub'])" is saved as "page.elements.parent"`
  ],
  expressions: [
    {
      type: 'string',
      description: `The selector or alias of the element to be saved`,
      examples: [
        'li.hotel-items',
      ],
    },
    {
      type: 'string',
      description: `Path on the world where the element should be saved`,
      example: 'page.elements.parent',
    },
  ],
})

module.exports = { saveElementFromSelector }
