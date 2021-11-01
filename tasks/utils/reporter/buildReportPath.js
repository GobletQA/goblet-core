const path = require('path')
const { get } = require('@keg-hub/jsutils')
const { HERKIN_TESTS_ROOT, HERKIN_REPORTS_DIR } = require('HerkinBackConstants')

/**
 * Gets the reports directory from the herkin config, or defined ENVs
 * @param {Object} herkin - Keg-Herkin global config object
 *
 * @return {string} - Path to the reports directory
 */
const getReportsDir = herkin => {
  const reportsDir = get(herkin, 'paths.reportsDir', HERKIN_REPORTS_DIR)
  const testsRootDir = get(herkin, `paths.testsRoot`, HERKIN_TESTS_ROOT)

  return path.join(HERKIN_TESTS_ROOT, HERKIN_REPORTS_DIR)
}

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
  return name
    ? path.basename(name).split('.').shift()
    : `${type}s`
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
  if(!type) throw new Error(`Test type is required to build the test report path!`)

  const reportsDir = getReportsDir(herkin)
  const report = getReportName(type, name)

  return path.join(
    HERKIN_TESTS_ROOT,
    HERKIN_REPORTS_DIR,
    `${type}/${report}/${report}-${(new Date()).getTime()}.html`
  )

}


module.exports = {
  buildReportPath
}