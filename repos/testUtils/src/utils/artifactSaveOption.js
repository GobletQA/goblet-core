const { ARTIFACT_SAVE_OPTS } = require('@GTU/constants')

/**
 * Checks the value of the passed in option to define when an artifact should be saved
 * @param {string|boolean} option - value check
 *
 * @returns {string} - Save option value
 */
const artifactSaveOption = (option) => {
  return !option || option === ARTIFACT_SAVE_OPTS.never
    ? false
    : option === ARTIFACT_SAVE_OPTS.always
      ? ARTIFACT_SAVE_OPTS.always
      : ARTIFACT_SAVE_OPTS.failed
}

/**
 * Checks the value of the passed in option to define when an artifact should be saved
 * @param {string|boolean} option - value check
 *
 * @returns {boolean} - True if an artifact could be saved. Either `always` || `failed`
 */
const artifactSaveActive = (option) => {
  return Boolean(artifactSaveOption(option))
}

module.exports = {
  artifactSaveActive,
  artifactSaveOption,
}