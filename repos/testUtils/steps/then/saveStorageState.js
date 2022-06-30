const { Then } = require('HerkinParkin')
const { getBrowserContext } = require('HerkinTestEnv')
const { saveStorageState } = require('HerkinSupport/helpers')

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
const saveStorageState = async (name, world) => {
  const { getContext } = getBrowserContext()
  const context = await getContext()
  const location = name || 'browser-context-state'

  return await saveStorageState(context, location)
}

const meta = {
  module: `saveStorageState`,
  examples: [
    `Then I save the page state`,
    `Then I save the page state as "my-browser-context"`,
  ],
  description: `Saves the state of the browser context to be reused at a later time.`,
  expressions: [],
}

Then('I save the page state', () => saveStorageState(false, world), meta)
Then('I save the page state as {string}', saveStorageState, {
  ...meta,
  expressions: [
    {
      type: 'string',
      description: `Name of the context state file that is being saved`,
      example: 'browser-context-state',
    }
  ]
})

module.exports = { saveStorageState }
