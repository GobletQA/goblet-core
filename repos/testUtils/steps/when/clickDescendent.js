const { When } = require('HerkinParkin')
const { getElement } = require('HerkinPlaywright')
const { checkForAncestor } = require('HerkinSupport/validate')

/**
 * Clicks the element `selector` that is a descendant of the registered ancestor.
 * @param {String} selector - valid playwright selector
 * @param {Object} world - world object, containing the ancestor metadata
 */
const clickDescendent = async (selector, world) => {
  checkForAncestor(world)
  const descendent = await getElement(
    `${world.meta.ancestorSelector} ${selector}`
  )
  if (!descendent)
    throw new Error(
      `Found no descendent of "${world.meta.ancestorSelector}", with selector: "${selector}"`
    )
  // Actionability checks (Auto-Waiting) seem to fail in headless mode
  // So we use locator.waitFor to ensure the element exist on the dom
  // Then pass {force: true} options to page.click because we know it exists
  await descendent.waitFor()
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
