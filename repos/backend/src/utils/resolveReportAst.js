const path = require('path')
const { noOpObj } = require('@keg-hub/jsutils')
const { getMountRootDir } = require('@GSH/Utils/getMountRootDir')
/**
 * Checks if a path is in the reports folder
 * If it is, then build an ast object with the fileType
 * @param {string} fullPath - Full path to the file to check
 * @param {string} baseDir - Root location of test files
 * @param {string} reportsDir - Directory where reports are stored
 *
 * @returns {Object} - Reports ast || empty object
 */
const resolveReportAst = (repo, fullPath, baseDir) => {
  const { reportsDir } = repo.paths
  return fullPath.startsWith(path.join(baseDir, reportsDir))
    ? {
        ast: {
          fileType: fullPath.split(`${reportsDir}/`).pop().split('/').shift(),
          // Generate the full url for resolving the report file, not including the domain
          reportUrl: `/repo/${repo.name}/reports${fullPath.replace(
            getMountRootDir(),
            ''
          )}`,
        },
      }
    : noOpObj
}

module.exports = {
  resolveReportAst,
}
