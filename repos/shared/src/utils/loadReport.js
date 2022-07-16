const path = require('path')
const { noOpObj } = require('@keg-hub/jsutils')
const { buildFileModel } = require('@GSH/Utils/buildFileModel')
const { getMountRootDir } = require('@GSH/Utils/getMountRootDir')
const { getRepoGobletDir } = require('@GSH/Utils/getRepoGobletDir')

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
  const { reportsDir=`artifacts/reports` } = repo.paths
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

/**
 * Checks the files path and if it exists creates a fileModel from the meta data
 * @param {Object} repo - Repo Class instance for the currently active repo
 * @param {string} location - Location within the test root path the file should exist
 *
 * @returns {Object} - fileModel for the file at the passed in location
 */
const loadReport = async (repo, location, baseDir) => {
  baseDir = baseDir || getRepoGobletDir(repo)
  const reportContent = resolveReportAst(repo, location, baseDir)

  // Build the file model for the report file
  return await buildFileModel({
    location,
    fileType: 'report',
    ...reportContent,
  }, repo)
}


module.exports = {
  loadReport
}