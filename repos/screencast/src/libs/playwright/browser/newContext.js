const { newBrowser } = require('./newBrowser')
const { noPropArr, noOpObj } = require('@keg-hub/jsutils')
const { getBrowser, getContext, setContext } = require('./browser')
const { getContextOpts } = require('../helpers/getContextOpts')

/**
 * Checks if the browser already exists
 * If it does not, then it create it
 * @function
 * @private
 * @param {Object} browserConf - Config used when starting the browser via playwright
 *
 * @returns {Object} - The playwright browser context object, and isNew state
 */
const ensureBrowser = async (browserConf = noOpObj) => {
  const pwBrowser = getBrowser(browserConf.type)
  if (pwBrowser) return pwBrowser

  const { browser } = await newBrowser(browserConf)
  return browser
}

/**
 * Checks if the browser context already exists
 * If it does not, then it create it
 * @function
 * @private
 * @param {Object} browser - The playwright browser object
 * @param {Object} browserConf - Config used when starting the browser via playwright
 *
 * @returns {Object} - The playwright browser context object
 */
const ensureContext = async (browser, browserConf) => {
  const pwContext = getContext(browserConf.type)
  if (pwContext) return pwContext

  try {
    const context = await browser.newContext(getContextOpts(browserConf.context))
    setContext(context, browserConf.type)

    return context
  }
  catch(err){
    console.log(`------- TODO: Fix This, check for error name / type and handle properly -------`)
    console.log(`------- is browser-closed error -------`)
    console.log(err.message.includes(`browserContext.newPage: Browser closed`))
    console.log(`------- err.message -------`)
    console.log(err.message)
  }
}

/**
 * Starts new browser context from the running browser
 * @function
 * @private
 * @param {Object} browserConf - Config used when starting the browser via playwright
 *
 * @returns {Object} - Contains the context, and browser created from playwright
 */
const newContext = async (browserConf = noOpObj) => {
  const browser = await ensureBrowser(browserConf)
  const context = await ensureContext(browser, browserConf)

  return { browser, context }
}

module.exports = {
  newContext,
}
