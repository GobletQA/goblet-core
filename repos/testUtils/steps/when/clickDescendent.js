const { When } = require('HerkinParkin')
const { getLocator } = require('HerkinPlaywright')
const { checkForAncestor } = require('HerkinSupport/validate')

/**
 * Clicks the element `selector` that is a descendant of the registered ancestor.
 * @param {String} selector - valid playwright selector
 * @param {Object} world - world object, containing the ancestor metadata
 */
const clickDescendent = async (selector, world) => {
  checkForAncestor(world)
  const descendent = await getLocator(
    `${world.meta.ancestorSelector} ${selector}`
  )

  return descendent.click({
    force: true
  })
}

When('I click the descendent element {string}', clickDescendent, {
  description: `Locates a element by selector and clicks.
There must be a preceding step that establishes an ancestor.
  
Module : clickDescendent`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the element.  Selector must be specific enough to locate a single element.`,
      example: "button[name='unique_name']",
    },
  ],
})

module.exports = { clickDescendent }
