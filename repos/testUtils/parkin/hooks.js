const { getParkinInstance } = require('./instance')

const getHook = (hookName) => {
  return (...args) => {
    const parkin = getParkinInstance()
    return parkin.hooks[hookName].apply(parkin.hooks, args)
  }
}

/**
 * Cucumber-like hooks
 * @example
 * import { BeforeAll, AfterAll } from 'HerkinParkin'
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
