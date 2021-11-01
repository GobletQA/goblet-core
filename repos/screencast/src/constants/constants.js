const { deepFreeze, keyMap } = require('@keg-hub/jsutils')

const browserNames = ['chromium', 'firefox', 'webkit']
/**
 * Global constants for the screencast app
 * @type {Object}
 */
const constants = deepFreeze({
  browserNames,
  defaultBrowser: 'chromium',
  browserMap: {
    ...keyMap(browserNames),
    ff: 'firefox',
    wk: 'webkit',
    chrome: 'chromium',
  },
  browserStatus: keyMap([
    `stopped`,
    `running`,
    `starting`,
    `unknown`,
  ])
})

module.exports = constants