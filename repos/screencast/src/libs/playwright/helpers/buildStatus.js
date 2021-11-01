const { capitalize} = require('@keg-hub/jsutils')
const { getBrowserType } = require('./getBrowserType')
const { browserStatus } = require('HerkinSCConstants')

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
    running: status === browserStatus.running,
    message: message || `${name} Browser is ${status}`,
  }
}

module.exports = {
  buildStatus
}