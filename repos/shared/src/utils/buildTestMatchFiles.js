const { noPropArr, isStr } = require('@keg-hub/jsutils')


/**
 * Helper to build the path to a test match file type
 * @function
 * @private
 * @param {string} prefix - Base path of the test match path
 * @param {string} tag - Identifier for matching test files
 * @param {string} ext - Custom file extension
 *
 * @returns {Array<string>} - Built test match file paths
 */
const buildFilePaths = (prefix, tag) => {
  return tag && isStr(tag)
    ? [
        `${prefix}/*.${tag}.js`,
        `${prefix}/${tag}.*.js`
      ]
    : noPropArr
}

/**
 * If a custom ext is passed, then search for files with the custom ext
 * @function
 * @private
 * @param {string} prefix - Base path of the test match path
 * @param {string} ext - Custom file extension
 *
 * @returns {Array<string>} - Built test match file paths
*/
const buildCustomExt = (prefix, ext) => {
  return ext ? [`${prefix}/*.${ext}`] : noPropArr
}

/**
 * Builds the paths to where test files can be found and their name
 * See here for info https://jestjs.io/docs/next/configuration#testmatch-arraystring
 * @function
 * @public
 * @param {string} testDir - Base directory to search for files
 * @param {string} opts.type - Type of files to search for (waypoint | unit | etc...)
 * @param {string} opts.shortcut - Type shortcut of files to search for (wp | un | etc...)
 * @param {string} [opts.ext] - Extension of the test files to find
 *
 * @returns {Array<string>} - Paths matching Jests testMatch config property
 */
const buildTestMatchFiles = (testDir, {type, shortcut, ext}) => {
  if(!isStr(testDir) || (!isStr(type) && !isStr(ext)) ) return noPropArr

  const prefix = testDir ? `${testDir}/**` : `**`

  return [
    ...buildCustomExt(prefix, ext),
    ...buildFilePaths(prefix, type),
    ...buildFilePaths(prefix, shortcut),
    ...buildFilePaths(prefix, `test`),
    ...buildFilePaths(prefix, `spec`),
  ]
}

module.exports = {
  buildTestMatchFiles
}