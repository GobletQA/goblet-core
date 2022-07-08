const { Logger } = require('@keg-hub/cli-utils')

/**
 * Successful goblet workflow response
 * @param {Object} resArgs - Response properties
 * @param {Object} extra - Extra properties to add to the response
 * @param {string} message - Success message
 *
 * @return {Object} - Success response object
 */
const successResp = (
  resArgs,
  extra,
  message = 'Workflow executed successfully'
) => {
  Logger.success(message)

  return {
    ...resArgs,
    ...extra,
    message,
    mounted: true,
  }
}

/**
 * Failed goblet workflow response
 *
 * @param {Object} resArgs - Response properties
 * @param {string} message - Fail message
 *
 * @return {Object} - Failed response object
 */
const failResp = (resArgs, message = 'Workflow failed to execute') => {
  Logger.error(message)

  return {
    ...resArgs,
    message,
    mounted: false,
  }
}

module.exports = {
  successResp,
  failResp,
}
