const { Then } = require('@GTU/Parkin')
const { getPage } = require('@GTU/Playwright')

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
const pageTitleContainsText = async title => {
  const page = await getPage()
  const actualTitle = await page.title()
  // TODO: update to use expect contains text for better test output
  expect(actualTitle.includes(title)).toBe(true)
}

Then('the page title contains {string}', pageTitleContainsText, {
  description: `Verifies page title contains the string.`,
  expressions: [
    {
      type: 'string',
      description: `String expected to be contained within the page title.`,
      example: 'Goblet Blog',
    },
  ],
  module: `pageTitleContainsText`
})

module.exports = { pageTitleContainsText }
