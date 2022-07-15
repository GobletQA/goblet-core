const { Given } = require('@GTU/Parkin')
const { defaultStateFile, contextStateLoc } = require('@GTU/Playwright/browserContext')

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
const usePageState = async (name, world) => {
  const contextState = contextStateLoc(name)
  // TODO: Figure out how to add state to a context

}

const meta = {
  module: `usePageState`,
  examples: [
    `Given I use the saved page state`,
    `Given I use the saved "saved-state-name" page state`,
  ],
  description: `Saves the state of the browser context to be reused at a later time.`,
  expressions: [],
}

Given('I use the saved page state', (world) => usePageState(false, world), meta)
Given('I use the saved {string} page state', usePageState, {
  ...meta,
  expressions: [
    {
      type: 'string',
      description: `Name of the context state file that is being saved`,
      example: defaultStateFile,
    }
  ]
})

module.exports = { usePageState }
