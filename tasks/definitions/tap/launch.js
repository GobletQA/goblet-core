const { sharedOptions } = require('@keg-hub/cli-utils')
const { setHerkinMode } = require('HerkinTasks/utils/helpers/setHerkinMode')
const {
  launchBrowsers,
} = require('HerkinTasks/utils/playwright/launchBrowsers')

/**
 * Launches a Playwright browser based on passed in options and config settings
 * @function
 * @private
 * @param {Object} args - Task arguments
 *
 * @returns {Object} - Browser launch options and websocket endpoint
 */
const launchAction = async args => {
  const { params } = args
  const herkinMode = setHerkinMode(params)
  const websockets = await launchBrowsers(params, herkinMode)

  return {
    websockets,
  }
}

module.exports = {
  launch: {
    name: 'launch',
    alias: ['lch'],
    action: launchAction,
    example: 'yarn test:launch',
    description: 'Launch one or more locally installed browsers',
    // TODO:  add other browser launch options here and in (tap.js) => keg.playwright.config
    options: sharedOptions('launch', {}, [
      'browsers',
      'allBrowsers',
      'chromium',
      'firefox',
      'webkit',
      'headless',
      'log',
      'mode',
    ]),
  },
}
