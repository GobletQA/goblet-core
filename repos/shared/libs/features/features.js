const path = require('path')
const glob = require('glob')
const { fileSys } = require('@keg-hub/cli-utils')
const { featuresParser } = require('./featuresParser')
const { limbo, noPropArr } = require('@keg-hub/jsutils')
const { getParkinInstance } = require('@GTU/Parkin/instance')
const { buildFileModel } = require('@GSH/Utils/buildFileModel')
const { getPathFromBase } = require('@GSH/Utils/getPathFromBase')

/**
 * TODO: Move this to the Parkin Lib
 * Should run while the feature AST is being parsed
 * Maps feature.scenario.steps to existing step definitions
 * Step definitions should be pre-registered with parkin
 * @param {Object} fileModel - Model the feature file to have it's steps mapped
 *
 * @returns {Object} - FileModel of the feature file
 */
const mapStepsToDefinitions = fileModel => {
  const parkin = getParkinInstance()

  fileModel.ast && 
    fileModel.ast.map(feature => {
      feature.scenarios &&
        feature.scenarios.map(scenario => {
          scenario.steps &&
            scenario.steps.map(step => {
              const match = parkin.steps.match(step.step)
              match &&
                match.definition &&
                (step.definition = match.definition.uuid)
            })
        })
    })
  
  return fileModel
} 

/**
 * Builds the file model for a feature file
 * @param {Object} ast - Parkin parsed version of a feature file
 * @param {string} content - The content of the feature file
 * @param {string} location - Location of the file on the file system
 * @param {Object} repo - Git Repo object the file is apart of
 *
 * @returns {Object} - FileModel of the feature file
 */
const buildFeatureFileModel = async (repo, ast, content, location) => {
  const fileModel = await buildFileModel({
    ast,
    content,
    location,
    fileType: 'feature',
  }, repo)

  return mapStepsToDefinitions(fileModel)
}

/**
 * Loads a feature from the passed in fullPath argument
 * @param {string} location - Location of the file on the file system
 * @param {Object} repo - Git Repo object the file is apart of
 *
 * @returns {Object} - FileModel of the feature file
 */
const loadFeature = async (repo, location) => {
  const parkin = getParkinInstance()
  const [_, content] = await fileSys.readFile(location)

  return await buildFeatureFileModel(
    repo,
    parkin.parse.feature(content),
    content,
    location,
  )
}

/**
 * Loads feature files base on the passed in features directory
 * @function
 * @private
 * @param {string} featuresDir - Location where feature files can be found
 *
 * @returns {Promise<Array<string>>} - Found feature file paths
 */
const loadFeatureFiles = featuresDir => {
  return new Promise((res, rej) => {
    glob(
      path.join(featuresDir, '**/*.feature'),
      {},
      async (err, files = []) => {
        err || !files
          ? rej('No feature files found in ' + featuresDir)
          : res(files)
      }
    )
  })
}

/**
 * Makes call to parse feature files, and convert them into Parkin feature AST objects
 * @function
 * @private
 * @param {Array<string>} featureFiles - feature file paths
 * @param {string} featuresDir - Path to the features test directory
 *
 * @returns {Promise<Array<string>>} - Group of parsed feature file AST Objects including their location
 */
const parseFeatures = (featureFiles, featuresDir) => {
  return featureFiles.reduce(async (toResolve, file) => {
    const loaded = await toResolve
    if (!file) return loaded

    const [err, features = noPropArr] = await limbo(
      featuresParser({
        location: file,
        relative: file.replace(`${featuresDir}/`, ''),
      })
    )

    err &&
      console.error(
        `Error parsing ${file}\n`,
        `This feature file will be skipped!\n`,
        error.message
      )

    return features ? loaded.concat(features) : loaded
  }, Promise.resolve([]))
}

/**
 * Loads features files from the file system as File Model objects
 * Then maps the passed in definitions to the Feature steps
 * @function
 * @export
 * @param {Object} config - Goblet Config object
 * @param {Array<Object>} definitions - Loaded definitions
 *
 * @returns {Promise<Array<string>>} - Group of parsed feature files as FileModel objects
 */
const loadFeatures = async (repo, definitions) => {
  const { featuresDir, repoRoot } = repo.paths
  if (!featuresDir || !repoRoot)
    throw new Error(
      `Goblet config featuresDir and repoRoot must be defined. Found: 
        - featuresDir=${featuresDir}
        - repoRoot=${repoRoot}
      `
    )

  const pathToFeatures = getPathFromBase(featuresDir, repo)
  const featureFiles = featuresDir && (await loadFeatureFiles(pathToFeatures))
  const features = await parseFeatures(featureFiles, pathToFeatures)

  const featuresFiles = features.map(async feat => {
    const { location, content, ast } = feat
    return await buildFeatureFileModel(
      repo,
      ast,
      content,
      location,
    )
  })

  return Promise.all(featuresFiles)
}

module.exports = {
  loadFeature,
  loadFeatures,
  mapStepsToDefinitions,
}
