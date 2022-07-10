const { loadFeatures } = require('GobletSharedFeatures/features')
const { buildFileTree } = require('GobletSharedFileSys/fileTree')
const { loadDefinitions } = require('GobletSharedDefinitions/definitions')
const { definitionsByType } = require('GobletSharedUtils/definitionsByType')
const { fileModelArrayToObj } = require('GobletSharedUtils/fileModelArrayToObj')

/**
 * Loads all the needed content for a repo
 * Includes the fileTree, features and step definitions
 *
 * @param {Object} repo - Repo Class Instance
 * @param {Object} config - Goblet config object for the repo class instance
 * @param {Object} status - status response object from the statusGoblet workflow
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
