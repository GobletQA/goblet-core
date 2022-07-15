const { Given } = require('@GTU/Parkin')
const { set } = require('@keg-hub/jsutils')
const { getLocator } = require('@GTU/Playwright')
const { cleanWorldPath } = require('@GTU/Support/helpers')

/**
 * Finds the element matching selector returned from selectorAlias, and registers it as the current ancestor
 * @param {string} selector - valid playwright selector
 * @param {string} alias - mapped selector alias if there is one otherwise the word `selector`
 * @param {string} data - if mapped alias exists then this is the on-screen text of the selector.  if no mapped alias exists then this is the selector + on-screen text of the element
 * @param {Object} world
 */
const saveElement = async (selector, worldPath, world) => {
  const element = getLocator(selector)
  const cleaned = cleanWorldPath(worldPath)

  set(world, cleaned, { selector, element })

  return element
}

const meta = {
  description: `Locates and saves an element for use in subsequent steps.`,
  module: `saveElement`,
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
  ],
}

const metaExp = {
  ...meta,
  expressions: meta.expressions.concat([{
    type: 'string',
    description: `Path on the world where the element should be saved`,
    example: 'page.elements.parent',
  }])
}

Given('{string} is saved', (selector, world) => saveElement(selector, `__meta.savedElement`, world), meta)


Given('{string} is saved as {string}', saveElement, metaExp)
Given('I save {string} as {string}', saveElement, metaExp)
Given('I save the element {string} as {string}', saveElement, metaExp)

module.exports = { saveElement }
