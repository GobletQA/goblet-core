const { Then } = require('GobletParkin')
const { getBrowserContext } = require('GobletPWTestEnv')
const { getPage } = getBrowserContext()
const expect = require('expect')

/**
 * Checks that the page title is not `title`
 * @param {string} title - text to compare to page title
 */
const pageTitleIsNot = async title => {
  const page = await getPage()
  expect(await page.title()).not.toBe(title)
}

Then('the page title is not {string}', pageTitleIsNot, {
  description: `Verifies page title does not match expected string.`,
  expressions: [
    {
      type: 'string',
      description: `String that does not match page title.`,
      example: 'Goblet Blog',
    },
  ],
  module: `pageTitleIsNot`
})

module.exports = { pageTitleIsNot }
