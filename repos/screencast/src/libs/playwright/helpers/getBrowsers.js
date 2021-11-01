const { getOS } = require('../../utils/getOS')
const { eitherArr } = require('@keg-hub/jsutils')
const { browserNames } = require('HerkinSCConstants')

/**
 * Creates an array of browsers relative the passed params object properties
 * The webkit option is only included when on a mac OS regardless of params properties
 * @param {Object} params
 * @param {string} params.allBrowsers - Should all browsers be included
 * @param {string} params.firefox - Should the firefox browser be included
 * @param {string} params.chromium - Should the chromium browser be included
 * @param {string} params.webkit - Should the webkit browser be included ( mac only )
 * @param {string|Array} params.browsers - Comma separated list of browsers to start or Array
 *
 * @return {Array<string>} - list of browsers found in the params object
 */
const getBrowsers = params => {
  const {
    allBrowsers,
    firefox=false,
    chromium=false,
    webkit=false,
    browsers='',
  } = params

  const isMac = getOS() === 'mac'
  // get an array of browsers from the browsers string, comma or space delimited
  const browsersArr = eitherArr(browsers, browsers.split(/\s|,/gi))

  const found = Array.from(
    new Set([
      ...browsersArr.filter(br => browserNames.includes(br)),
      (allBrowsers || firefox) && 'firefox',
      (allBrowsers || chromium) && 'chromium',
      (isMac && (allBrowsers || webkit)) && 'webkit'
    ])
  ).filter(Boolean)
  
  return found.length ? found : [`chromium`]
}

module.exports = {
  getBrowsers
}