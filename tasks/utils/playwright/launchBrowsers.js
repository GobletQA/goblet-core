const { launchBrowser } = require('./launchBrowser')
const { runSeq, noOpObj } = require('@keg-hub/jsutils')
const { getBrowsers } = require('@GSC/Playwright/helpers/getBrowsers')

/**
 *
 * @param {Object} launchParams - params for launching, including sharedOptions.js values
 * @return {Object} - {
 *   output: an array of the result of each browser launch,
 *   browsers: the browsers that were launched
 * }
 */
const launchBrowsers = (launchParams, gobletMode) => {
  if (gobletMode === 'vnc') return noOpObj

  const { headless, log, ...browserParams } = launchParams
  const browsers = getBrowsers(browserParams)

  // launch each browser in a series
  const output = runSeq(
    browsers.map(
      browser => () =>
        launchBrowser({
          ...browserParams,
          browser,
          headless,
          log,
        })
    )
  )

  return {
    output,
    browsers,
  }
}

module.exports = { launchBrowsers }
