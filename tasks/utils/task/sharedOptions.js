const { setSharedOptions } = require('@keg-hub/cli-utils')

const taskOptions = {
  jest: {
    sync: {
      description: 'Run all tests sequentially',
      alias: [ 'runInBand' ],
      example: `--sync`,
      default: true,
    },
    timeout: {
      description: 'Test timeout in seconds. Defaults to 90 seconds, so async tests have sufficient time to complete.',
      example: `--timeout 60`,
      type: 'number',
      default: 90, // 90 seconds || 1.5 min
    },
    jestConfig: {
      description: 'Path to jest config relative to the root directory',
      example: `--jestConfig relative/path/to/config`,
      required: true,
    },
    noTests: {
      description: 'The test runner will not fail when no tests exit',
      example: '--noTests',
      default: false
    },
    bail: {
      description: 'Stops all tests once a single step fails',
      example: '--bail',
      default: false
    },
  },
  docker: {
    container: {
      description: 'Name of container within which to run create command',
      example: '--container keg-herkin',
      default: 'keg-herkin',
    },
  },
  bdd: {
    tags: {
      description: 'Comma separated list of tags which determine which feature files are run',
      alias: ['tag', 'tg'],
      type: 'array',
      default: [],
      example: '--tags @foo,@bar,@baz',
    },
    filter: {
      alias: [ 'filters', 'fl' ],
      description: 'Filters test (feature and scenario names) by this substring. If not passed, all tests are run. Does nothing when context option is passed',
      type: 'array',
      default: [],
      example: `--filter auth`,
    },
  },
  herkin: {
    context: {
      alias: [ 'name' ],
      description: 'Path or name of the test file to run. If not passed, all tests are run.',
      example: `--context <value>`,
      default: null
    },
    log: {
      alias: [ 'lg' ],
      description: 'Log task output',
      type: 'bool',
      default: true,
      example: 'launch --no-log',
    }
  },
  playwright: {
    allBrowsers: {
      alias: [ 'all'],
      description: 'Launch all supported browsers',
      type: 'bool',
      example: `--all`,
    },
    chromium: {
      alias: [ 'chrome', 'chrom', 'ch' ],
      description: 'Launch Chromium browser through Playwright',
      type: 'bool',
      example: `--chrome`,
    },
    firefox: {
      alias: [ 'fire', 'fox', 'ff' ],
      description: 'Launch Firefox browser through Playwright',
      type: 'bool',
      example: `--firefox`,
    },
    webkit: {
      alias: [ 'webkit', 'safari', 'sa' ],
      description: 'Launch Safari browser through Playwright',
      type: 'bool',
      example: `--webkit`,
    },
    headless: {
      alias: [ 'hl' ],
      description: 'Launch the browser in headless mode',
      type: 'bool',
      default: false,
      example: `--no-headless`,
    },
    slowMo: {
      description: 'Speed actions within the browser will be performed in seconds',
      type: 'number',
      example: '--slowMo 5', // 5 seconds
    },
  }
}

// TODO: Update to this when cli-utils convert-from-sv branch is merged
// taskOptions.unit = {
//   ...taskOptions.herkin,
//   ...taskOptions.docker,
//   ...taskOptions.jest,
// }
// setSharedOptions(taskOptions)
// Have to a single level object so all options are available to tasks
setSharedOptions({
  ...taskOptions.jest,
  ...taskOptions.docker,
  ...taskOptions.herkin,
  ...taskOptions.playwright,
})