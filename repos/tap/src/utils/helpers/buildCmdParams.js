import {
  deepMerge,
  checkCall,
  noPropArr,
  exists,
  get,
} from '@keg-hub/jsutils'

const conditionalAdd = (key, value) => {
  return exists(value) ? (key ? `${key}=${value}` : `--value`) : ''
}

const defSettings = {
  browser: {
    slowMo: 100,
  },
}

/**
 * Loads the world and store settings and merges them together
 * Then sets test run specific options based on the merged settings
 *
 * @return {Array} - Group of options to pass to the test run command
 */
const resolveFromSettings = args => {
  const { state } = args
  const { repo, settings } = state?.items

  const mergedSettings = deepMerge(defSettings, repo?.world?.settings, settings)

  return [
    conditionalAdd(`slowMo`, mergedSettings?.browser?.slowMo),
    conditionalAdd(`testTimeout`, mergedSettings?.tests?.timeout),
    // TODO: Add other customizable settings here
  ]
}

/**
 * Builds the default params that all test exec type use
 * @function
 * @private
 * @param {Object} args.state - Redux Store State
 * @param {string} args.command - Command to be run
 * @param {Object} args.fileModel - Model of the file the command is being run for
 *
 * @return {Array} - Built default params for all command types
 */
const buildDefaultParams = args => {
  const { fileModel, state } = args
  const repo = get(state, `items.repo`)

  return [
    conditionalAdd(`context`, fileModel?.location),
    conditionalAdd(`base`, repo?.paths?.repoRoot),
    // Add user run settings here via state.settings and world.settings
    ...resolveFromSettings(args),
  ]
}

/**
 * Builds the params for feature file commands
 * @function
 * @private
 * @param {Object} args.state - Redux Store State
 * @param {string} args.command - Command to be run
 * @param {Object} args.fileModel - Model of the file the command is being run for
 *
 * @return {Array} - Built params for the command
 */
const buildFeatureParams = args => {

  return [
    // Build the default params for all text exec types
    ...buildDefaultParams(args),
    // Add Feature file specific params here
  ]
}

/**
 * Builds the params for waypoint commands
 * @function
 * @private
 * @param {Object} args.state - Redux Store State
 * @param {string} args.command - Command to be run
 * @param {Object} args.fileModel - Model of the file the command is being run for
 *
 * @return {Array} - Built params for the command
 */
const buildWaypointParams = args => {
  return [
    // Build the default params for all text exec types
    ...buildDefaultParams(args),
    // Add Waypoint file specific params here
  ]
}

/**
 * Builds the params for unit commands
 * @function
 * @private
 * @param {Object} args.state - Redux Store State
 * @param {string} args.command - Command to be run
 * @param {Object} args.fileModel - Model of the file the command is being run for
 *
 * @return {Array} - Built params for the command
 */
const buildUnitParams = args => {
  return [
    // Build the default params for all text exec types
    ...buildDefaultParams(args),
    // Add Unit file specific params here
  ]
}

/**
 * Holds methods for each text execution type based on fileType
 * @type {Object}
 */
const parmBuildMap = {
  unit: buildUnitParams,
  feature: buildFeatureParams,
  waypoint: buildWaypointParams,
}

/**
 * Finds the param build method based on file type and calls it
 * @function
 * @public
 * @export
 * @param {Object} args.state - Redux Store State
 * @param {string} args.command - Command to be run
 * @param {Object} args.fileModel - Model of the file the command is being run for
 *
 * @return {Array} - Built params for the command
 */
export const buildCmdParams = args => {
  return checkCall(parmBuildMap[args?.fileModel?.fileType], args) || noPropArr
}
