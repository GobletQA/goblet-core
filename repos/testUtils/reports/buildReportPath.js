const path = require('path')
const { getPathFromBase } = require('GobletSharedUtils/getPathFromBase')

/**
 * Gets the name for the report based on the name of the test being run
 * If no name, then uses the test type
 *
 * @param {string} type - Type of tests for the report
 * @param {string} [name=type] - Name of the test related to the report
 *
 * @return {string} - Name to use for the report
 */
const getReportName = (type, name, browser) => {
  return !name
    ? `${type}s`
    : path.basename(name).trim().replace(/ /g, '-').split('.').shift()
}

/**
 * Builds a path to a test report based on the type and name
 * Adds a date timestamp to the report file name
 * @param {string} type - Type of tests for the report
 * @param {string} [name=type] - Name of the test related to the report
 * @param {Object} goblet - Goblet global config object
 *
 * @returns {string} - Path where the report should be created
 */
const buildReportPath = (type, { context, testReport }, goblet, browser) => {
  if (!type)
    throw new Error(`Test type is required to build the test report path!`)

  type = type === `bdd` ? `feature` : type
  const reportsDir = getPathFromBase(goblet.paths.reportsDir, goblet)
  const report = getReportName(type, testReport || context)
  const reportName = browser ? `${report}-${browser}` : report

  // Example: goblet/reports/features/my-tests/my-tests-chrome-12345.html
  // The date/time stamp is always added to allow search and filtering by name
  return path.join(reportsDir, `${type}/${report}/${reportName}-${Date.now()}.html`)
}

module.exports = {
  buildReportPath,
}
