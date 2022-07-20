const { gobletMountDir } = require('@GTasks/paths')
const { setSharedOptions } = require('@keg-hub/cli-utils')
const { ARTIFACT_SAVE_OPTS } = require('@GTU/constants')
const artifactSaveOpts = Object(ARTIFACT_SAVE_OPTS).values

const dynamicOpts = {
  version: (type='<cmd>', action='<action>') => ({
    version: {
      alias: ['ver'],
      example: `${type} ${action} --version minor`,
      description: 'The new version of goblet',
    },
    confirm: {
      default: false,
      alias: ['conf'],
      example: `${type} ${action} --no-confirm`,
      description: 'Ask to confirm version before updating',
    },
    log: {
      default: true,
      alias: ['lg'],
      example: `${type} ${action} --no-log`,
      description: 'Log output of the task',
    },
  }), 
  deploy: (type='<cmd>', action='<action>') => ({
    mode: {
      allowed: ['vnc', 'local'],
      example: `${type} ${action} --mode local`,
      description:
        'Mode to run goblet in. In not set, uses launch option',
    },
    local: {
      allowed: ['lc'],
      example: `${type} ${action} --local`,
      description: `Build goblet in local mode. Same as '--mode local' option`,
    },
    vnc: {
      example: `${type} ${action} --vnc`,
      description: `Build goblet in vnc mode. Same as '--mode vnc' option`,
    },
  }),
}

const taskOptions = {
  jest: {
    noTests: {
      description: 'The test runner will not fail when no tests exit',
      example: '--noTests',
      default: false,
    },
    testSync: {
      default: true,
      type: `boolean`,
      alias: ['runInBand'],
      example: `--no-testSync`,
      description: 'Run all tests sequentially',
    },
    testBail: {
      default: false,
      type: `boolean`,
      example: '--testBail',
      description: 'Stops all tests once a single step fails',
    },
    testConfig: {
      enforced: true,
      example: `--jestConfig relative/path/to/config`,
      description: 'Absolute path to a jest config relative to the root directory',
    },
    testTimeout: {
      type: 'number',
      default: 30000, // 30 seconds
      env: `GOBLET_TEST_TIMEOUT`,
      example: `--timeout 15000`,
      description: 'Test timeout in seconds. Defaults to 60000 milliseconds (1min).',
    },
    testDebug: {
      default: false,
      type: `boolean`,
      example: '--testDebug',
      env: `GOBLET_TEST_DEBUG`,
      description: 'Pass the --debug flag to the jest command',
    },
    testRetry: {
      type: `number`,
      example: '--testRetry 3',
      env: `GOBLET_TEST_RETRY`,
      description: 'Amount of times to retry the test if it fails',
    },
    testReport: {
      alias: [`report`],
      example: '--testReport',
      env: `GOBLET_TEST_REPORT`,
      allowed: artifactSaveOpts,
      description: 'Context in which the html test report should be saved',
    },
    testReportName: {
      alias: [`reportName`],
      example: '--testReportName',
      env: `GOBLET_TEST_REPORT_NAME`,
      description: 'Name of the generated HTML test report file',
    },
    testCache: {
      default: true,
      type: `boolean`,
      example: '--testCache',
      env: `GOBLET_TEST_CACHE`,
      description: 'Use internal test cache when executing test',
    },
    testColors: {
      default: false,
      type: `boolean`,
      example: '--testColors',
      env: `GOBLET_TEST_COLORS`,
      description: 'Force use of colors even when not a TTY',
    },
    testWorkers: {
      example: '--testWorkers',
      env: `GOBLET_TEST_WORKERS`,
      description: 'Number of workers to use when running tests',
    },
    testVerbose: {
      default: false,
      type: `boolean`,
      example: '--testVerbose',
      env: `GOBLET_TEST_VERBOSE`,
      description: 'Output verbose test results as the tests run',
    },
    testOpenHandles: {
      default: false,
      type: `boolean`,
      example: '--testOpenHandles',
      env: `GOBLET_TEST_OPEN_HANDLES`,
      description: 'Detect handles left open when tests run. Forces tests to run in sync.',
    },
    testCI: {
      default: false,
      type: `boolean`,
      example: '--testCI',
      env: `GOBLET_RUN_FROM_CI`,
      description: 'Run the tests in CI mode when running in a CI environment',
    }
  },
  docker: {
    container: {
      description: 'Name of container within which to run create command',
      example: '--container goblet',
      default: 'goblet',
    },
  },
  bdd: {
    tags: {
      description:
        'Comma separated list of tags which determine which feature files are run',
      alias: ['tag', 'tg'],
      type: 'array',
      default: [],
      example: '--tags @foo,@bar,@baz',
    },
    filter: {
      alias: ['filters', 'fl'],
      description:
        'Filters test (feature and scenario names) by this substring. If not passed, all tests are run. Does nothing when context option is passed',
      type: 'array',
      default: [],
      example: `--filter auth`,
    },
  },
  goblet: {
    context: {
      alias: ['name'],
      description:
        'Path or name of the test file to run. If not passed, all tests are run.',
      example: `--context <value>`,
      default: null,
    },
    log: {
      alias: ['lg'],
      description: 'Log task output',
      type: 'bool',
      default: true,
      example: '--no-log',
    },
    mode: {
      allowed: ['vnc', 'local'],
      example: `--mode local`,
      description: 'Mode to run goblet in. In not set, uses launch option',
    },
    base: {
      env: `GOBLET_CONFIG_BASE`,
      alias: ['baseDir', 'rootDir', 'root'],
      example: ['--base /my/test/repo/directory'],
      description: `The root or base directory containing a goblet.config outside of Goblet root directory`,
    },
    repo: {
      alias: [ 'cwd', 'workdir', 'repoDir'],
      description: 'Root directory to run the command from',
      example: '--repo /path/to/repo/root',
      default: gobletMountDir,
    },
  },
  playwright: {
    concurrent: {
      default: false,
      alias: ['async'],
      example: '--concurrent' ,
      env: `GOBLET_BROWSER_CONCURRENT`,
      description: 'Run the defined browsers concurrently',
    },
    browsers: {
      type: 'array',
      alias: ['browser'],
      env: `GOBLET_BROWSERS`,
      example: '--browsers chrome,wk' ,
      description: 'Launch a specific browser by name. Seperate by comma to launch multiple',
      allowed: ['chromium', 'chrome', 'ch', 'firefox', 'ff', 'webkit', 'wk', 'safari', 'sa'],
    },
    allBrowsers: {
      alias: ['all'],
      description: 'Launch all supported browsers',
      type: 'bool',
      example: `--all`,
    },
    chromium: {
      alias: ['chrome', 'chrom', 'ch'],
      description: 'Launch Chromium browser through Playwright',
      type: 'bool',
      example: `--chrome`,
    },
    firefox: {
      alias: ['fire', 'fox', 'ff'],
      description: 'Launch Firefox browser through Playwright',
      type: 'bool',
      example: `--firefox`,
    },
    webkit: {
      alias: ['webkit', 'safari', 'sa'],
      description: 'Launch Safari browser through Playwright',
      type: 'bool',
      example: `--webkit`,
    },
    headless: {
      type: 'bool',
      alias: ['hl'],
      env: `GOBLET_HEADLESS`,
      example: `--no-headless`,
      description: 'Launch the browser in headless mode',
    },
    slowMo: {
      default: 100,
      type: `number`,
      example: `--slowMo 500`,
      env: `GOBLET_BROWSER_SLOW_MO`,
      description: `Speed actions within the browser will be performed in milliseconds`,
    },
    browserTimeout: {
      type: 'number',
      default: 15000, // 15 seconds
      env: `GOBLET_BROWSER_TIMEOUT`,
      example: '--browserTimeout 15000', // 15 seconds
      description: 'Amount of time until a browser request will timeout should be less the timeout option',
    },
    devices: {
      type: 'array',
      alias: ['device'],
      env: `GOBLET_BROWSER_DEVICES`,
      example: '--devices Pixel-2,Galaxy-S5-landscape',
      description: 'Comma separated list of devices to emulate running a browser. Spaces in device names should use a "-" instead.  See https://github.com/microsoft/playwright/blob/5ba7903ba098586a13745e0d7ac894f1d55d47aa/packages/playwright-core/src/server/deviceDescriptorsSource.json for a list of devices.',
    },
    launchType: {
      default: 'launch',
      env: `GOBLET_BROWSER_LAUNCH_TYPE`,
      example: `--launchType persistent`,
      allowed: ['launch', 'l', 'persistent', 'p', 'server', 's'],
      description: `Sets the playwright browser launch type method used to launch the browser`,
    },
    debug: {
      default: false,
      type: `boolean`,
      env: 'GOBLET_BROWSER_DEBUG',
      description: 'Runs with playwright debug mode activated',
      example: 'keg goblet bdd test --debug',
    },
    devtools: {
      type: `boolean`,
      default: false,
      example: '--devtools',
      env: 'GOBLET_DEV_TOOLS',
      description: 'Open devtools automatically when the browser opens. The debug option must also be set true',
    },
    tracing: {
      allowed: artifactSaveOpts,
      env: 'GOBLET_TEST_TRACING',
      example: '--tracing failed',
      description: 'Activates playwrights tracing functionality for all executed tests',
    },
    screenshot: {
      type: `boolean`,
      default: false,
      example: '--screenshot',
      env: 'GOBLET_TEST_SCREENSHOT',
      description: 'Activates playwrights tracing functionality for all executed tests',
    }
  },
  pwContext: {
    width: {
      type: 'number',
      example: '--width 1080',
      description: 'The width of the browser window',
    },
    height: {
      type: 'number',
      example: '--height 720',
      description: 'The height of the browser window',
    },
    appUrl: {
      example: '--appUrl https://google.com',
      description: 'The default url a browser will navigate to when running',
    },
    downloads: {
      example: '--downloads',
      description: 'The accept downloads from visited pages. Downloads automatically cancelled by default',
    },
    geolocation: {
      type: 'array',
      alias: ['geo'],
      example: '--geolocation 85,134',
      description: `Emulate a custom geolocation, in the format of <latitude>,<longitude>`
    },
    hasTouch: {
      alias: ['touch'],
      example: '--hasTouch',
      description: `Sets viewport to supports touch events`
    },
    isMobile: {
      example: '--isMobile',
      description: 'Sets the meta viewport tag to be accounted for and enables touch events'
    },
    permissions: {
      type: 'array',
      example: '--permissions gyroscope,notifications',
      description: 'A list of permissions to grant to all browser pages, seperated by comma'
    },
    record: {
      allowed: artifactSaveOpts,
      example: '--record failed',
      env: `GOBLET_TEST_VIDEO_RECORD`,
      description: 'Records a video of browser interactions based on a condition. Saves to config#artifactsDir/videos'
    },
    // TOODO: Need to investigate this further
    // storageState: {},
    timezone: {
      example: '--timezone America/Los_Angeles',
      description: 'Emulate running the browser in a specific timezone'
    }
  },
  waypoint: {
  },
  test: {
    artifactsDebug: {
      default: false,
      type: `boolean`,
      env: 'GOBLET_ARTIFACTS_DEBUG',
      alias: [ `artDebug`, `artD`, `adebug` ],
      description: 'Enable debug logs for artifacts generated durring test execution',
      example: 'keg goblet bdd test --artifactsDebug',
    },
  }
}

const sharedOptions = {
  ...dynamicOpts,
  ...taskOptions,
}

// TODO: Update to this when cli-utils convert-from-sv branch is merged
// sharedOptions.unit = {
//   ...sharedOptions.goblet,
//   ...sharedOptions.docker,
//   ...sharedOptions.jest,
// }
// setSharedOptions(sharedOptions)
// Have to a single level object so all options are available to tasks
setSharedOptions({
  ...taskOptions.jest,
  ...taskOptions.docker,
  ...taskOptions.goblet,
  ...taskOptions.playwright,
  ...taskOptions.pwContext,
  ...taskOptions.test,
})


module.exports = {
  sharedOptions
}