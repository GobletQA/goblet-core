const path = require('path')
const glob = require('glob')
const { DefinitionsParser } = require('./definitionsParser')
const { getDefaultHerkinConfig } = require('HerkinSharedConfig')
const { getPathFromBase } = require('HerkinSharedUtils/getPathFromBase')

/**
 * Searches the step definition directory for step definitions
 * @param {Object} repo - Repo Class instance for the currently active repo
 *
 * @returns {Array} - Found paths to step definition files
 */
const loadDefinitionsFiles = stepsDir => {
  return new Promise((res, rej) => {
    // TODO: Investigate if it's better to include the ignore
    // Would make loading the definitions faster, but
    // Would mean users can't use index files
    // Would look like this { ignore: [ '**/index.js' ] }
    // For the section argument passed to the glob pattern
    glob(path.join(stepsDir, '**/*.js'), {}, async (err, files = []) => {
      err || !files
        ? rej('No step definition files found in ' + stepsDir)
        : res(files)
    })
  })
}

/**
 * Builds the definitions models from the loaded definitions
 * @param {Object} repo - Repo Class instance for the currently active repo
 *
 * @returns {Array} - Loaded Definitions models
 */
const parseDefinitions = async (repo, definitionFiles) => {
  return definitionFiles.reduce(async (toResolve, file) => {
    const loaded = await toResolve
    if (!file) return loaded

    const fileModel = await DefinitionsParser.getDefinitions(file, repo)
    fileModel && loaded.push(fileModel)

    return loaded
  }, Promise.resolve([]))
}

/**
 * Loads the definitions file from the passed in repo instance
 * @param {Object} repo - Repo Class instance for the currently active repo
 * @param {Object} [herkinConfig] - The global herkin.config
 *
 * @returns {Array} - Loaded Definitions models
 */
const loadDefinitions = async (repo, herkinConfig) => {
  // Clear out any steps that were already loaded
  DefinitionsParser.clear(repo)
  herkinConfig = herkinConfig || getDefaultHerkinConfig()

  const { stepsDir } = repo.paths
  const pathToSteps = getPathFromBase(stepsDir, repo)
  const definitionFiles = stepsDir && (await loadDefinitionsFiles(pathToSteps))

  const herkinDefinitionFiles = await loadDefinitionsFiles(
    `${herkinConfig.internalPaths.testUtilsDir}/steps`
  )

  // The repo world may have been updated since the last time load definitions was called
  // Call refreshWorld to ensure repo and parkin have an updated world
  await repo.refreshWorld()

  const clientDefinitions =
    (await parseDefinitions(repo, definitionFiles)) || []
  const herkinDefinitions =
    (await parseDefinitions(repo, herkinDefinitionFiles)) || []

  // all the definition file models
  const defs = clientDefinitions.concat(herkinDefinitions)

  return defs
}

module.exports = {
  loadDefinitions,
  loadDefinitionsFiles,
  DefinitionsParser,
}
