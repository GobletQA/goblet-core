const { newContext } = require('./newContext')
const { getPage, getContext, setPage } = require('./browser')
const { getPageOpts } = require('../helpers/getPageOpts')

/**
 * Checks if the browser context already exists
 * If it does not, then it create it
 * @function
 * @private
 * @param {Object} browserConf - Options for starting the browser
 *
 * @returns {Object} - The playwright browser context object, and isNew state
 */
const ensureContext = async browserConf => {
  const pwContext = getContext(browserConf.type)
  if (pwContext) return pwContext

  // If no context exists, try to create it
  const { context } = await newContext(browserConf)
  return context
}

/**
 * Checks if the browser page already exists
 * If it does not, then it create it
 * @function
 * @private
 * @param {Object} context - The playwright browser context object
 * @param {Object} browserConf - Options for starting the browser
 *
 * @returns {Object} - The playwright browser page object
 */
const ensurePage = async (context, browserConf) => {
  const pwPage = getPage(browserConf.type)
  if (pwPage) return pwPage

  const page = await context.newPage(getPageOpts(browserConf.page))
  setPage(page, browserConf.type)

  return page
}

/**
 * Creates a new page from the current context and navigates to the passed in url
 * Also ensure the context exists before creating the page
 * @function
 * @private
 * @param {Object} browserConf - Options for starting the browser
 *
 * @returns {Object} - Contains the page, and context created from playwright
 */
const newPage = async (browserConf = noOpObj) => {
  const context = await ensureContext(browserConf)
  const page = await ensurePage(context, browserConf)

  return { context, page }
}

module.exports = {
  newPage,
}
