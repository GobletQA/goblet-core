/**
 * Use the Parkin hooks to initialize and cleanup the playwright browser
 * Called from a separate file then parkin and playwright to fix circular dependency
 * `playwrightTestEnv` load the parkin world to get the app url
 * `GobletParkin`  also load the parkin world to pass to Parkin when creating the parkin instance
 * By moving the hooks out of the GobletParkin initializaion to this support file
 * we can resolve circular dependency
 */

const { initialize, cleanup } = require('@GTU/PlaywrightEnv')

/**
 * Add wrap method to ensure no arguments are passed to initialize and cleanup
 */
beforeAll(async () => initialize())
afterAll(async () => cleanup())
