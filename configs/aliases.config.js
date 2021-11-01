const { HERKIN_ROOT, TEST_UTILS_PATH } = require('../constants/backend')
const moduleAlias = require('module-alias')
const { deepFreeze } = require('@keg-hub/jsutils')
const path = require('path')

// aliases shared by jest and module-alias
const aliases = deepFreeze({
  // ---- General Alias ---- //
  HerkinRoot: HERKIN_ROOT,
  HerkinTemp: path.join(HERKIN_ROOT, 'temp'),
  HerkinRepos: path.join(HERKIN_ROOT, 'repos'),
  HerkinConfigs: path.join(HERKIN_ROOT, 'configs'),
  HerkinTasks: path.join(HERKIN_ROOT, 'tasks'),
  HerkinFrontConstants: path.join(HERKIN_ROOT, 'constants', 'frontend'),
  
  // ---- Shared Alias ---- //
  HerkinSharedModels: path.join(HERKIN_ROOT, 'repos/shared/models'),
  HerkinSharedMiddleware: path.join(HERKIN_ROOT, 'repos/shared/middleware'),
  HerkinSharedApp: path.join(HERKIN_ROOT, 'repos/shared/express/app.js'),
  HerkinSharedRouter: path.join(HERKIN_ROOT, 'repos/shared/express/appRouter.js'),
  HerkinSharedPaths: path.join(HERKIN_ROOT, 'repos/shared/utils/paths.js'),
  
  // ---- Backend Alias ---- //
  HerkinBackConstants: path.join(HERKIN_ROOT, 'constants', 'backend'),
  HerkinBackEndpoints: path.join(HERKIN_ROOT, 'repos/backend/endpoints'),

  // ---- TestUtils Alias ---- //
  HerkinParkin: path.join(TEST_UTILS_PATH, 'parkin'),
  HerkinSetup: path.join(TEST_UTILS_PATH, 'playwright', 'setupTestEnvironment'),
  HerkinPlaywright: path.join(TEST_UTILS_PATH, 'playwright'),
  HerkinSteps: path.join(TEST_UTILS_PATH, 'steps'),
  HerkinSupport: path.join(TEST_UTILS_PATH, 'support'),

  // ---- Screencast Alias ---- //
  HerkinSC: path.join(HERKIN_ROOT, 'repos/screencast'),
  HerkinSCConstants: path.join(HERKIN_ROOT, 'repos/screencast/src/constants'),
  HerkinSCEndpoints: path.join(HERKIN_ROOT, 'repos/screencast/src/endpoints'),
  HerkinSCScreencast: path.join(HERKIN_ROOT, 'repos/screencast/src/screencast'),
  HerkinSCLibs: path.join(HERKIN_ROOT, 'repos/screencast/src/libs'),
  HerkinSCPlaywright: path.join(HERKIN_ROOT, 'repos/screencast/src/libs/playwright'),
  HerkinSCVnc: path.join(HERKIN_ROOT, 'repos/screencast/src/libs/vnc'),
})

// Registers module-alias aliases (done programatically so we can reuse the aliases object for jest)
const registerAliases = () => moduleAlias.addAliases(aliases)

/**
 * Jest is not compatible with module-alias b/c it uses its own require function,
 * and it requires some slight changes to the format of each key and value.
 * `jestAliases` can be set as value of any jest config's `moduleNameMapper` property
 */
const jestAliases = deepFreeze(Object.keys(aliases).reduce(
  (aliasMap, key) => {
    const formattedKey = key + '(.*)'
    aliasMap[formattedKey] = aliases[key] + '$1'
    return aliasMap
  },
  {}
))

module.exports = {
  aliases,
  registerAliases,
  jestAliases
}
