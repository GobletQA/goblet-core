const { capitalize } = require('@keg-hub/jsutils')
const { getBrowserType } = require('./getBrowserType')
const { browserStatus } = require('@GSC/Constants')

/**
 * Builds the status message for the browser type
 * @param {string} type - The type of browser the status relates to
 * @param {string} status - Current status of the browser
 * @param {string} [message] - Alternate message for the browser status
 *
 * @return {Object} - Status of the browser, with status and message properties
 */
const buildStatus = (type, status, message) => {
  const name = capitalize(getBrowserType(type))
  return {
    status: status,
    message: message || `${name} Browser is ${status}`,
    running: status === browserStatus.running || status === true,
  }
}

module.exports = {
  buildStatus,
}
