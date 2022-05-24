const { loadFeatures } = require('HerkinSharedFeatures/features')
const { buildFileTree } = require('HerkinBackLibs/fileSys/fileTree')
const { loadDefinitions } = require('HerkinSharedDefinitions/definitions')
const { definitionsByType, fileModelArrayToObj } = require('HerkinShared/utils')

/**
 * Loads all the needed content for a repo
 * Includes the fileTree, features and step definitions
 *
 * @param {Object} repo - Repo Class Instance
 * @param {Object} config - Herkin config object for the repo class instance
 * @param {Object} status - status response object from the statusHerkin workflow
 *
 * @returns {Object} - Repo file content object
 */
const loadRepoContent = async (repo, config, status) => {
  const content = { repo, status }
  content.fileTree = await buildFileTree(repo)
  const definitions = await loadDefinitions(repo, config)
  content.definitionTypes = definitionsByType(definitions)
  const features = await loadFeatures(repo, content.definitionTypes)

  content.features = fileModelArrayToObj(features)
  content.definitions = fileModelArrayToObj(definitions)

  return content
}

module.exports = {
  loadRepoContent,
}
