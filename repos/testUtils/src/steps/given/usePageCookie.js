const { Given } = require('@GTU/Parkin')
const { defaultCookieFile, getContext, setContextCookie } = require('@GTU/Playwright/browserContext')

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
const usePageCookie = async (name) => {
  const context = await getContext()
  await setContextCookie(context, name)
}

const meta = {
  module: `usePageCookie`,
  examples: [
    `Given I use the saved page cookie`,
    `Given I use the saved "saved-cookie-name" page cookie`,
  ],
  description: `Saves the cookie of the browser context to be reused at a later time.`,
  expressions: [],
}

Given('I use the saved page cookie', (world) => usePageCookie(false, world), meta)
Given('I use the saved {string} page cookie', usePageCookie, {
  ...meta,
  expressions: [
    {
      type: 'string',
      description: `Name of the context cookie file that is being saved`,
      example: defaultCookieFile,
    }
  ]
})

module.exports = { usePageCookie }
