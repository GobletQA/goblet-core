const { When } = require('@GTU/Parkin')
const { getLocator } = require('@GTU/Playwright')

const states = ['attached', 'detached', 'visible', 'hidden']

/**
 * Waits for the element at `selector` to be in state `state`
 * @param {string} selector - valid playwright selector
 * @param {string} state - one of four valid states noted above
 */
const waitForSelectorState = async (selector, state) => {
  if (!states.includes(state))
    throw new Error('Invalid Selector State: ' + state)

  const element = await getLocator(selector)
  return await element.waitFor({
    state: `${state}`,
  })
}

const meta = {
  module: `waitForSelectorState`,
  description: `Locates an element by selector and verifies its state.
  https://playwright.dev/docs/api/class-page/#pagewaitforselectorselector-options`,
  examples: [
    `I wait for element ".tab-bar-title:text(\'Code Editor\')" to be "visible"`,
  ],
  expressions: [
    {
      type: 'string',
      description: `The selector for a single element.`,
      example: ".tab-bar-title:text('Code Editor')",
    }
  ],
}

const stateExpression = {
  type: 'string',
  example: 'visible',
  description: `The state of the element to wait for. Must be one of ${states.join(', ')}.`,
} 
const multiMeta = {
  ...meta,
  expressions: meta.expressions.concat([stateExpression])
}


When('I wait for {string}', selector => waitForSelectorState(selector, 'attached'), meta)
When('I wait for {string} to hide', selector => waitForSelectorState(selector, 'hidden'), meta)
When('I wait for {string} to show', selector => waitForSelectorState(selector, 'visible'), meta)
When('I wait for {string} to detach', selector => waitForSelectorState(selector, 'detached'), meta)
When('I wait for {string} to attach', selector => waitForSelectorState(selector, 'attached'), meta)
When('I wait for {string} to be {string}', waitForSelectorState, multiMeta)
When('I wait for element {string} to be {string}', waitForSelectorState, multiMeta)

module.exports = { waitForSelectorState }
