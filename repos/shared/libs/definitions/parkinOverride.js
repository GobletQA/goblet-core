const Module = require('module')

const parkinCheck = (request) => request === `HerkinParkin`

const parkinOverride = (repo) => {
  return () => ({
    Given: repo.parkin.Given.bind(repo.parkin),
    When: repo.parkin.When.bind(repo.parkin),
    Then: repo.parkin.Then.bind(repo.parkin),
    And: repo.parkin.And.bind(repo.parkin),
    But: repo.parkin.But.bind(repo.parkin),
    BeforeAll: repo.parkin.hooks.beforeAll.bind(repo.parkin.hooks),
    AfterAll: repo.parkin.hooks.afterAll.bind(repo.parkin.hooks),
    Before: repo.parkin.hooks.beforeEach.bind(repo.parkin.hooks),
    After: repo.parkin.hooks.afterEach.bind(repo.parkin.hooks),
  })
}

/**
 * Overrides the default require method to allow require to return a custom module
 * @param {Function} isOverride A condition used to check whether to override Module._load.
 * @param {Function} resolveOverride A function used to override Module._load result.
 *
 * @returns {Function} - Reset require module 
 */
const requireOverride = (isOverride, resolveOverride) => {
  const originalLoad = Module._load

  Module._load = function (request, parent) {
    return isOverride(request, parent)
      ? resolveOverride(request, parent)
      : originalLoad.apply(this, arguments)
  }

  return () => Module._load = originalLoad
}

module.exports = {
  parkinCheck,
  parkinOverride,
  requireOverride
}