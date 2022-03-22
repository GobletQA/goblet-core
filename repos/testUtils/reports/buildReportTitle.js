const path = require('path')
const { wordCaps } = require('@keg-hub/jsutils')

/**
 * Builds a title of a test report based on the type and context
 * @param {string} type - Type of tests for the report
 * @param {string} [name=type] - Name of the test related to the report
 *
 * @returns {string} - Title of the report
 */
const buildReportTitle = (type, name) => {
  const title = name && path.basename(name).split('.').shift()

  return title
    ? wordCaps(title)
    : type
    ? `${wordCaps(type)} Test Suite`
    : `Test Suite`
}

module.exports = {
  buildReportTitle,
}
