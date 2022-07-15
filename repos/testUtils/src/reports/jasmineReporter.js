const { Logger } = require('@keg-hub/cli-utils')
const { noOp, get, noPropArr, isFunc, isStr } = require('@keg-hub/jsutils')

const spaceMap = {
  feature: `  `,
  scenario: `    `,
  background: `    `,
  step: `      `,
}

const eventMap = {
  featureStart: [],
  scenarioStart: [],
  backgroundStart: [],
  ruleStart: [],
  stepStart: [],
  featureEnd: [],
  scenarioEnd: [],
  backgroundEnd: [],
  ruleEnd: [],
  stepEnd: [],
}

/**
 * Holds the name of a test mapped to its current jasmine result context
 */
const failedSpecMap = {}


/**
 * Resolves jasmine from the global context in a safe way
 */
const resolveJasmine = () => {
  return typeof global.jasmine !== 'undefined'
    ? global.jasmine
    : { getEnv: noOp }
}

/**
 * Helper to log test execution status as it happends
 */
const logResult = (context) => {
  if(!context.action) return

  switch(context.action){
    case 'start': {
        Logger.stdout(`${spaceMap[context.type] || ``}${context.description}\n`)
      break
    }
    case 'end': {
      Logger.stdout(`${spaceMap[context.type] || ``}${context.description} - ${context.status}\n`)
      break
    }
  }
}

/**
 * Gets the suite type based on the description text
 * The first word should be the type, if not, then it's a feature
 * @function
 * @private
 * @param {Object} suite - Suite object from jasmine reported
 *
 * @returns {string} - The suite type
 */
const getSuiteData = suite => {
  const description = get(suite, `description`)

  let type = !description
    ? `Feature`
    : description.startsWith(`Scenario >`)
      ? `Scenario`
      : description.startsWith(`Background >`)
        ? `Background`
        : description.startsWith(`Rule >`)
          ? `Rule`
          : `Feature`

  return {
    type: type.toLowerCase(),
    description: description.replace(`${type} >`, `${type}:`),
  }
}

const dispatchEvent = async (event, data) => {
  const callbacks = eventMap[event] || noPropArr
  return await Promise.all(callbacks.map(cb => cb(data)))
}

const addListener = (event, callback, key) => {
  if(!isFunc(callback))
    throw new Error(`Cannot register ${event} event, callback is not a function`)

  if(!eventMap[event])
    throw new Error(`Cannot register ${event} event, ${event} is not an event type`)

  callback.name = callback.name || key
  eventMap[event].push(callback)
}

const removeListener = (event, callback, key) => {
  if(!eventMap[event])
    throw new Error(`Cannot register ${event} event, ${event} is not an event type`)

  if(isStr(callback) && !key) key = callback
  eventMap[event] = eventMap[event].filter(cb => key ? cb.name !== key : cb !== callback)
}

/**
 * Gets the status of the currently active test
 */
const getTestResult = (testPath) => {
  return failedSpecMap[testPath]
}

/**
 * Builds a custom jasmine reporter
 * Checks failed specs and sets all all specs in a suite to disable when found
 * @function
 * @private
 * @param {Object} jasmineEnv - The current jasmine environment
 *
 * @returns {Object} - Custom jasmine reporter
 */
const buildReporter = jasmineEnv => {

  return {
    suiteStarted: suite => {
      const data = getSuiteData(suite)
      return dispatchEvent(`${data.type}Start`, {
        ...suite,
        ...data,
        action: `start`,
        testPath: global?.jasmine?.testPath,
      })
    },
    specStarted: result => {
      return dispatchEvent(`stepStart`, {
        ...result,
        type: `step`,
        action: `start`,
        testPath: global?.jasmine?.testPath,
      })
    },
    specDone: result => {
      if(result.status === 'failed') failedSpecMap[result.testPath] = result

      return dispatchEvent(`stepEnd`, {
        ...result,
        type: 'step',
        action: 'end',
        testPath: global?.jasmine?.testPath,
      })
    },
    suiteDone: suite => {
      const data = getSuiteData(suite)
      return dispatchEvent(`${data.type}End`, {
        ...suite,
        ...data,
        action: `end`,
        testPath: global?.jasmine?.testPath,
      })
    }
  }
}

/**
 * Creates a custom Jasmine reporter when the jasmine global exists
 */
const jasmineReporter = () => {
  const jasmineEnv = resolveJasmine().getEnv()
  jasmineEnv &&
    jasmineEnv.describe &&
    jasmineEnv.addReporter(buildReporter(jasmineEnv))
}

module.exports = {
  addListener,
  dispatchEvent,
  getTestResult,
  removeListener,
  jasmineReporter,
}