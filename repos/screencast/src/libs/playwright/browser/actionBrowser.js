const { startBrowser } = require('./startBrowser')
const { isArr, isStr, isFunc, noPropArr } = require('@keg-hub/jsutils')

/**
 * Helper to thrown an error
 * @param {string} message - Error message to throw
 */
const throwErr = message => {
  throw new Error(message)
}

/**
 * Helper to validate the correct arguments exist to run the actions
 */
const validateArgs = (args, component) => {
  const { ref, actions = noPropArr } = args

  if (!isStr(ref))
    throwErr(`Playwright ${ref} must be one of browser, context, or page`)

  if (!component)
    throwErr(
      `Playwright ${ref} does not exist. Must be one of browser, context, or page`
    )

  if (!isArr(actions))
    throwErr(
      `Actions must be an array of actions to execute on a Playwright ${ref}`
    )
}

/**
 * Calls a method on a playwright component (browser, context, page)
 * @param {Object} action - Action metadata defining the method to call
 * @param {string} action.action - Name of the action on the component to call
 * @param {boolean} action.prev - Add the response from the previous action as first prop
 * @param {string} [action.ref] - Reference to a playwright component (browser, context, or page)
 * @param {Array} action.props - Arguments to pass to the playwright component method
 * @param {Object} component - Default component to use if none defined in the action
 * @param {Object} pwComponents - Playwright component (browser, context, page)
 * @param {*} prevResp - Response from the previous action
 *
 * @returns {*} - Response from the component action
 */
const callAction = async (action, component, pwComponents, prevResp) => {
  const comp = pwComponents[action.ref] || component
  // Ensure props is an array
  const props = isArr(action.props) ? [...action.props] : []
  // Add the previous response to the props array if it exists and action.prev is true
  action.prev === true && prevResp && props.unshift(prevResp)

  return isFunc(comp[action.action])
    ? await comp[action.action](...props)
    : throwErr(
        `Playwright ${action.ref} must be one of browser, context, or page`
      )
}

/**
 * Execute an action on a browser
 * @param {Object} args
 * @param {string} [args.ref='browser'] - Reference to a playwright component (browser, context, or page)
 * @param {array} [args.actions=[]] - List of actions to execute on the ref
 *
 * @example
 * // Should open a browser page and navigate to google.com
 * actionBrowser({
 *  ref: 'page',
 *  actions: [{
 *    action: 'goto',
 *    props: [`https://google.com`]
 *  }]
 * })
 *
 * @returns {Array} - Responses of all executed actions in order of execution
 */
const actionBrowser = async (args, browserConf) => {
  const { ref = 'browser', actions = noPropArr } = args
  const pwComponents = await startBrowser(browserConf)
  const component = pwComponents[ref]
  validateArgs(args, component)

  const responses = []
  return actions.reduce(async (toResolve, action) => {
    await toResolve
    const prevResp = responses[responses.length - 1]
    // If the action if a method, cal if an pass the callAction method and params
    const resp = isFunc(action.action)
      ? await action.action(
          callAction,
          action,
          component,
          pwComponents,
          prevResp,
          responses
        )
      : await callAction(action, component, pwComponents, prevResp)

    return responses
  }, Promise.resolve())
}

module.exports = {
  actionBrowser,
}
