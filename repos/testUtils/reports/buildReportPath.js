const path = require('path')
const { getPathFromBase } = require('HerkinSharedUtils/getPathFromBase')

/**
 * Gets the name for the report based on the name of the test being run
 * If no name, then uses the test type
 *
 * @param {string} type - Type of tests for the report
 * @param {string} [name=type] - Name of the test related to the report
 *
 * @return {string} - Name to use for the report
 */
const getReportName = (type, name) => {
  return !name
    ? `${type}s`
    : path.basename(name).trim().replace(/ /g, '-').split('.').shift()
}

/**
 * Builds a path to a test report based on the type and name
 * Adds a date timestamp to the report file name
 * @param {string} type - Type of tests for the report
 * @param {string} [name=type] - Name of the test related to the report
 * @param {Object} herkin - Keg-Herkin global config object
 *
 * @returns {string} - Path where the report should be created
 */
const buildReportPath = (type, name, herkin) => {
  if (!type)
    throw new Error(`Test type is required to build the test report path!`)

  const reportsDir = getPathFromBase(herkin.paths.reportsDir, herkin)
  const report = getReportName(type, name)

  // Example: herkin/reports/features/my-tests/my-tests-12345.html
  return path.join(reportsDir, `${type}/${report}/${report}-${Date.now()}.html`)
}

module.exports = {
  buildReportPath,
}
