const { Then } = require('HerkinParkin')
const { getBrowserContext } = require('HerkinTestEnv')
const { defaultCookieFile, saveBrowserCookie } = require('HerkinPlaywright/browserContext')

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
const savePageCookie = async (name, world) => {
  const { getContext } = getBrowserContext()
  const context = await getContext()

  return await saveBrowserCookie(context, name)
}

const meta = {
  module: `savePageCookie`,
  examples: [
    `Then I save the page cookie`,
    `Then I save the page cookie as "saved-cookie-name"`,
  ],
  description: `Saves the cookie of the browser context to be reused at a later time.`,
  expressions: [],
}

Then('I save the page cookie', () => savePageCookie(false, world), meta)
Then('I save the page cookie as {string}', savePageCookie, {
  ...meta,
  expressions: [
    {
      type: 'string',
      description: `Name of the context cookie file that is being saved`,
      example: defaultCookieFile,
    }
  ]
})

module.exports = { savePageCookie }
