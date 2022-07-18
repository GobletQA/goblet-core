const { When } = require('@GTU/Parkin')
const keyboardMap = require('./keyboardMap')
const { getPage } = require('@GTU/Playwright')

/**
 * Simulates a key press
 * @param {string} key - key name
 * @see possible `key` values here: https://playwright.dev/docs/api/class-page?_highlight=press#pagepressselector-key-options
 */
const pressKey = async key => {
  const page = await getPage()
  const pressedKey = keyboardMap.capitalize[key] || key
  await page.keyboard.press(pressedKey)
}

When('I press the key {string}', pressKey, {
  description: `Triggers a keyboard event.
  
Options : https://playwright.dev/docs/api/class-page?_highlight=press#pagepressselector-key-options
  
Module : pressKey`,
  expressions: [
    {
      type: 'string',
      description: `The keyboard key.

Examples : 
  Single key : I press the key "PageDown"
  Shortcut combination : I press the key "Control+a"`,
      example: 'PageDown',
    },
  ],
})

module.exports = { pressKey }
