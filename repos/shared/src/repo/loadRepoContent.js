const { Logger } = require('@keg-hub/cli-utils')
const { loadFeatures } = require('@GSH/Features/features')
const { buildFileTree } = require('@GSH/FileSys/fileTree')
const { loadDefinitions } = require('@GSH/Definitions/definitions')
const { definitionsByType } = require('@GSH/Utils/definitionsByType')
const { fileModelArrayToObj } = require('@GSH/Utils/fileModelArrayToObj')

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
  try {
    const content = { repo, status }
    content.fileTree = await buildFileTree(repo)
    const definitions = await loadDefinitions(repo, config)
    content.definitionTypes = definitionsByType(definitions)
    const features = await loadFeatures(repo, content.definitionTypes)

    content.features = fileModelArrayToObj(features)
    content.definitions = fileModelArrayToObj(definitions)

    return content
  }
  catch(err){
    Logger.warn(`[Repo Content Error] Could not load repo content files...`)
    Logger.stderr(err)
    throw err
  }
}

module.exports = {
  loadRepoContent,
}
