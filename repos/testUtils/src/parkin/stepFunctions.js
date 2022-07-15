const { getParkinInstance } = require('./instance')

const getStepHandler = (name) => {
  return (...args) => {
    const parkin = getParkinInstance()
    return parkin[name].apply(parkin, args)
  }
}

/**
 * Cucumber-like step functions
 * @example
 * import { Given } from '@GTU/Parkin'
 * Given('<some matcher>', () => doSomething(p))
 */
module.exports = {
  Given: getStepHandler('Given'),
  When: getStepHandler('When'),
  Then: getStepHandler('Then'),
  And: getStepHandler('And'),
  But: getStepHandler('But'),
}
