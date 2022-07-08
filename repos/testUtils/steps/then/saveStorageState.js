const { Then } = require('GobletParkin')
const { getBrowserContext } = require('GobletPWTestEnv')
const { defaultStateFile, saveContextState } = require('GobletPlaywright/browserContext')

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
const savePageState = async (name) => {
  const { getContext } = getBrowserContext()
  const context = await getContext()

  return await saveContextState(context, name)
}

const meta = {
  module: `savePageState`,
  examples: [
    `Then I save the page state`,
    `Then I save the page state as "my-browser-context"`,
  ],
  description: `Saves the state of the browser context to be reused at a later time.`,
  expressions: [],
}

Then('I save the page state', () => savePageState(false, world), meta)
Then('I save the page state as {string}', savePageState, {
  ...meta,
  expressions: [
    {
      type: 'string',
      description: `Name of the context state file that is being saved`,
      example: defaultStateFile,
    }
  ]
})

module.exports = { savePageState }
