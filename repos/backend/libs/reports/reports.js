const { buildFileModel } = require('HerkinSharedUtils/buildFileModel')
const { resolveReportAst } = require('../../utils/resolveReportAst')
const { getRepoHerkinDir } = require('HerkinSharedUtils/getRepoHerkinDir')


/**
 * Checks the files path and if it exists creates a fileModel from the meta data
 * @param {Object} repo - Repo Class instance for the currently active repo
 * @param {string} location - Location within the test root path the file should exist
 *
 * @returns {Object} - fileModel for the file at the passed in location
 */
const loadReport = async (repo, location, baseDir) => {
  baseDir = baseDir || getRepoHerkinDir(repo)
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