const path = require('path')
const glob = require('glob')
const { DefinitionsParser } = require('./definitionsParser')
const { getDefaultGobletConfig } = require('@GSH/Config')
const { getPathFromBase } = require('@GSH/Utils/getPathFromBase')
const { parkinOverride } = require('@GSH/Libs/overrides/parkinOverride')

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
const parseDefinitions = async (repo, definitionFiles, overrideParkin) => {
  return definitionFiles.reduce(async (toResolve, file) => {
    const loaded = await toResolve
    if (!file) return loaded

    const fileModel = await DefinitionsParser.getDefinitions(file, repo, overrideParkin)
    fileModel && loaded.push(fileModel)

    return loaded
  }, Promise.resolve([]))
}

/**
 * Loads the definitions file from the passed in repo instance
 * @param {Object} repo - Repo Class instance for the currently active repo
 * @param {Object} [gobletConfig] - The global goblet.config
 *
 * @returns {Array} - Loaded Definitions models
 */
const loadDefinitions = async (repo, gobletConfig) => {
  // Clear out any steps that were already loaded
  DefinitionsParser.clear(repo)
  gobletConfig = gobletConfig || getDefaultGobletConfig()

  const { stepsDir } = repo.paths
  const pathToSteps = getPathFromBase(stepsDir, repo)
  const definitionFiles = stepsDir && (await loadDefinitionsFiles(pathToSteps))

  const gobletDefinitionFiles = await loadDefinitionsFiles(
    `${gobletConfig.internalPaths.testUtilsDir}/src/steps`
  )

  // The repo world may have been updated since the last time load definitions was called
  // Call refreshWorld to ensure repo and parkin have an updated world
  await repo.refreshWorld()
  const overrideParkin = parkinOverride(repo)

  const clientDefinitions =
    (await parseDefinitions(repo, definitionFiles, overrideParkin)) || []
  const gobletDefinitions =
    (await parseDefinitions(repo, gobletDefinitionFiles, overrideParkin)) || []

  // all the definition file models
  const defs = clientDefinitions.concat(gobletDefinitions)

  return defs
}

module.exports = {
  loadDefinitions,
  loadDefinitionsFiles,
  DefinitionsParser,
}
