/**
 * Sets up the environment for running parkin with Jest
 * Loaded via the jest config options `setupFilesAfterEnv`
 * Is loaded after `parkinTestInit.js` to ensure the parkin instance is already configured
 * Which adds the `getParkinInstance` method to the global object, which is called here
 */

const getHook = (hookName) => {
  return (...args) => {
    const parkin = global.getParkinInstance()
    return parkin.hooks[hookName].apply(parkin.hooks, args)
  }
}

/**
 * Cucumber-like hooks
 * @example
 * import { BeforeAll, AfterAll } from '@GTU/Parkin'
 * BeforeAll(() => setupMyTestEnv())
 * AfterAll(() => cleanupMyEnv())
 */
module.exports = {
  BeforeAll: getHook('beforeAll'),
  AfterAll: getHook('afterAll'),
  BeforeEach: getHook('beforeEach'),
  AfterEach: getHook('afterEach'),
  Before: getHook('beforeEach'),
  After: getHook('afterEach'),
}
