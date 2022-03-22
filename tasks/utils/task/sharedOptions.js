const { herkinMountDir } = require('HerkinTasks/paths')
const { setSharedOptions } = require('@keg-hub/cli-utils')

const dynamicOpts = {
  version: (type='<cmd>', action='<action>') => ({
    version: {
      alias: ['ver'],
      example: `${type} ${action} --version minor`,
      description: 'The new version of keg-herkin',
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
        'Mode to run keg-herkin in. In not set, uses launch option',
    },
    local: {
      allowed: ['lc'],
      example: `${type} ${action} --local`,
      description: `Build keg-herkin in local mode. Same as '--mode local' option`,
    },
    vnc: {
      example: `${type} ${action} --local --vnc`,
      description: `Build keg-herkin in vnc mode. Same as '--mode vnc' option`,
    },
  }),
}

const taskOptions = {
  jest: {
    jestConfig: {
      enforced: true,
      example: `--jestConfig relative/path/to/config`,
      description: 'Absolute path to a jest config relative to the root directory',
    },
    sync: {
      description: 'Run all tests sequentially',
      alias: ['runInBand'],
      example: `--sync`,
      default: true,
    },
    timeout: {
      description:
        'Test timeout in seconds. Defaults to 90 seconds, so async tests have sufficient time to complete.',
      example: `--timeout 60`,
      type: 'number',
      default: 90, // 90 seconds || 1.5 min
    },
    noTests: {
      description: 'The test runner will not fail when no tests exit',
      example: '--noTests',
      default: false,
    },
    bail: {
      description: 'Stops all tests once a single step fails',
      example: '--bail',
      default: false,
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
  herkin: {
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
      description: 'Mode to run keg-herkin in. In not set, uses launch option',
    },
    base: {
      alias: ['baseDir', 'rootDir', 'root'],
      example: ['--base /my/test/repo/directory'],
      description: `The root or base directory containing a herkin.config outside of Keg-Herkin root directory`,
    },
    repo: {
      alias: [ 'cwd', 'workdir', 'repoDir'],
      description: 'Root directory to run the command from',
      example: '--repo /path/to/repo/root',
      default: herkinMountDir,
    },
  },
  playwright: {
    concurrent: {
      default: false,
      alias: ['async'],
      example: '--concurrent' ,
      description: 'Run the defined browsers concurrently',
    },
    browsers: {
      type: 'array',
      alias: ['browser'],
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
      alias: ['hl'],
      description: 'Launch the browser in headless mode',
      type: 'bool',
      default: false,
      example: `--no-headless`,
    },
    slowMo: {
      description:
        'Speed actions within the browser will be performed in milliseconds',
      type: 'number',
      example: '--slowMo 500',
    },
    browserTimeout: {
      type: 'number',
      example: '--browserTimeout 10000', // 10 seconds
      description:
        'Amount of time until a browser request will timeout should be less the timeout option',
    },
    devices: {
      type: 'array',
      alias: ['device'],
      example: '--devices Pixel-2,Galaxy-S5-landscape',
      description: 'Comma separated list of devices to emulate running a browser. Spaces in device names should use a "-" instead.  See https://github.com/microsoft/playwright/blob/5ba7903ba098586a13745e0d7ac894f1d55d47aa/packages/playwright-core/src/server/deviceDescriptorsSource.json for a list of devices.',
    },
    launchType: {
      default: 'launch',
      example: `--launchType persistent`,
      allowed: ['launch', 'l', 'persistent', 'p', 'server', 's'],
      description: `Sets the playwright browser launch type method used to launch the browser`,
    },
    debug: {
      description: 'Runs with playwright debug mode activated',
      example: 'keg herkin cr test --debug',
      default: false,
    },
    devtools: {
      example: '--devtools',
      description:
        'Open devtools be automatically when the browser opens. The debug option must also be set true',
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
      example: '--record ',
      description: 'Records a video of all browser page interactions, and saves to herkin.config#downloads directory'
    },
    // TOODO: Need to investigate this further
    // storageState: {},
    timezone: {
      example: '--timezone America/Los_Angeles',
      description: 'Emulate running the browser in a specific timezone'
    }
  },
  waypoint: {
    
  }
}

const sharedOptions = {
  ...dynamicOpts,
  ...taskOptions,
}

// TODO: Update to this when cli-utils convert-from-sv branch is merged
// sharedOptions.unit = {
//   ...sharedOptions.herkin,
//   ...sharedOptions.docker,
//   ...sharedOptions.jest,
// }
// setSharedOptions(sharedOptions)
// Have to a single level object so all options are available to tasks
setSharedOptions({
  ...taskOptions.jest,
  ...taskOptions.docker,
  ...taskOptions.herkin,
  ...taskOptions.playwright,
  ...taskOptions.pwContext,
})


module.exports = {
  sharedOptions
}