const path = require('path')
const { testUtilsDir } = require('../paths')
const { deepFreeze } = require('@keg-hub/jsutils')

const constants = deepFreeze({
  browsers: {
    all: `--all-browsers`,
    chrome: `--chromium`,
    firefox: `--firefox`,
    safari: `--webkit`,
    webkit: `--webkit`,
  },
  browserNames: ['chromium', 'firefox', 'webkit'],
  jestConfigMap: {
    unit: path.join(testUtilsDir, `configs/jest.unit.config.js`),
    feature: path.join(testUtilsDir, `configs/jest.parkin.config.js`),
    waypoint: path.join(testUtilsDir, `configs/jest.waypoint.config.js`),
  },
  testTypes: {
    unit: `unit`,
    feature: `feature`,
    waypoint: `waypoint`,
  },
  envFilter: {
    starts: [
      `npm_`,
      `DOC`,
      `COMPOSE`,
      `HOME`,
      `KEG_`,
      `FIRE`,
      `GIT`,
      `GOOGLE`,
      `AZURE`,
      `AWS`
    ],
    contains: [
      `PWD`,
      `KEY`,
      `AUTH`,
      `COOKIE`,
      `PASS`
    ],
    ends: [
      `_PATH`,
      `_PORT`,
    ],
    exclude: [
      `PLAYWRIGHT_BROWSERS_PATH`
    ]
  }
})

module.exports = constants
