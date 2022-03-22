const { deepMerge, pickKeys } = require('@keg-hub/jsutils')

/**
 * Builds a model with real values from the passed in overrides and Model objects
 * Only sets properties that exist in the existing Model
 *
 * @param {Object} overrides - Values to set to the model properties
 * @param {Object} Model - Defines the properties that exist on the model
 *
 * @returns {Object} - Built model
 */
const buildModel = (overrides, Model) =>
  deepMerge(Model, pickKeys(overrides, Object.keys(Model)))

module.exports = {
  buildModel,
}
