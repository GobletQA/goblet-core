/**
 * Use the Parkin hooks to initialize and cleanup the playwright browser
 * Called from a separate file then parkin and playwright to fix circular dependency
 * `playwrightTestEnv` load the parkin world to get the app url
 * `HerkinParkin`  also load the parkin world to pass to Parkin when creating the parkin instance
 * By moving the hooks out of the HerkinParkin initializaion to this support file
 * we can resolve circular dependency
 */

const { AfterAll, BeforeAll } = require('HerkinParkin')
const { initialize, cleanup } = require('HerkinRepos/testUtils/playwright/playwrightTestEnv')

BeforeAll(initialize)
AfterAll(cleanup)
