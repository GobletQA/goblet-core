const { findProc } = require('../../proc')
const { browserNames } = require('@GSC/Constants')
const { limbo, exists } = require('@keg-hub/jsutils')

/**
 * Gets the current running status of browser server the process
 * @function
 * @throws
 * @param {string} type - Name of the browser server to get the status for
 *
 * @return {Object} - Process Status object
 */
const statusServer = async browser => {
  const hasBrowser = exists(browser)
  if (hasBrowser && !browserNames.includes(browser))
    throw new Error(
      `Can not get browser status, invalid browser type. Must be one of:\n\t${browserNames.join(
        ', '
      )}`
    )

  return await browserNames.reduce(async (resp, type) => {
    const acc = await resp

    if (exists(browser) && browser !== type) return acc
    // chromium runs as a chrome process name, so use that instead
    const [err, status] = await limbo(
      findProc(type === 'chromium' ? `chrome` : type)
    )

    return err ? acc : { ...acc, [type]: status }
  }, Promise.resolve({}))
}

module.exports = {
  statusServer,
}
