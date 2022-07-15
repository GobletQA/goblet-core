const { Given } = require('@GTU/Parkin')
const { set } = require('@keg-hub/jsutils')
const { getLocators } = require('@GTU/Playwright')
const { cleanWorldPath } = require('@GTU/Support/helpers')


/**
 * Expects the number of dom elements matching `selector` to equal `count`
 * @param {string} selector - valid playwright selector
 * @param {string} worldPath - Path on the world object
 */
const saveElementCount = async (selector, worldPath, world) => {

  const cleaned = cleanWorldPath(worldPath)
  if(!cleaned) throw new Error(`World Path to save the element count "${worldPath}", is invalid.`)

  const elements = await getLocators(selector)
  const count = await elements.count()
  
  set(world, cleaned, { selector, count })
}

Given('I save the count of {string} as {string}', saveElementCount, {
  module : `saveElementCount`,
  description: `Locates elements by selector and stores the amount that exist`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the elements.`,
      example: 'li.list-item',
    },
    {
      type: 'string',
      description: `Path on the world where the count should be saved`,
      example: 'page.items.count',
    },
  ],
})

module.exports = { saveElementCount }
