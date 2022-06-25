const { When } = require('HerkinParkin')
const { get } = require('@keg-hub/jsutils')
const { getBrowserContext } = require('HerkinTestEnv')
const { buildScreenShotName } = require('../../support/buildScreenShotName')

const { getPage } = getBrowserContext()

/**
 * Sets the input text of selector to data
 * @param {string} selector - valid playwright selector
 * @param {string} data - set selector text to `data`
 * @param {Object} world
 */
const setText = async (selector, data, world) => {
  const page = await getPage()
  // Actionability checks (Auto-Waiting) seem to fail in headless mode
  // So we use locator.waitFor to ensure the element exist on the dom
  // Then pass {force: true} options to page.click because we know it exists
  const element = await page.locator(selector)
  await element.waitFor()
  await page.click(selector, {
    force: true
  })

  //clear value before setting otherwise data is appended to end of existing value
  await page.fill(selector, '')

  const [_, ...worldVar] = data.split('.')
  const parsed = get(world, worldVar)
  const rtnData = !data.startsWith(`$world`) ? data : parsed

  await page.type(selector, rtnData)
}

When('I set the element {string} text to {string}', setText, {
  description: `Locates input element by selector and replaces existing value, if any, to the desired text.

Module : setText`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the input element.  Selector must be specific enough to locate only one element.`,
      example: '#search',
    },
    {
      type: 'string',
      description: `Desired text of the element.\n\nExample : I set the element "input[name=email]" text to "my.name@company.com"`,
      example: 'I desire to type this text.',
    },
  ],
})

module.exports = { setText }
