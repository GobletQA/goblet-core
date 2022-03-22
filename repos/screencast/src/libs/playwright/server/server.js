const metadata = require('../helpers/metadata')

/**
 * Cache holder for the launched playwright browser
 * @type {Object|undefined}
 */
let PW_SERVER

/**
 * Returns the cached playwrite server
 * @function
 */
const getServer = () => PW_SERVER

/**
 * Sets the cached playwrite server
 * @function
 */
const setServer = server => {
  PW_SERVER = server

  return PW_SERVER
}

/**
 * Gets the cached browser server metadata
 * @function
 * @public
 * @param {string} [type] - Name of the browser metadata to get
 *
 * @returns {string} - Browser metadata
 */
const getMetadata = async type => {
  return await metadata.read(type)
}

module.exports = {
  getMetadata,
  getServer,
  setServer,
}
