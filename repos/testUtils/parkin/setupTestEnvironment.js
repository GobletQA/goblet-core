const { parkin } = require('./instance')

/**
 * Global helper to allow re-using the same parking instance for each test
 */
global.getParkinInstance = () => parkin

/**
 * Gets the options to be passed on to parkin
 * Currently set using envs, but would be better to define a config object
 * TODO: investigate loading in the herkin.config in this content
 */
global.getParkinOptions = () => {
  // Load the both herkin and parkin version
  // Herkin version overrides parkin version
  const {
    PARKIN_FEATURE_NAME,
    PARKIN_FEATURE_TAGS,
    GOBLET_FEATURE_NAME = PARKIN_FEATURE_NAME,
    GOBLET_FEATURE_TAGS = PARKIN_FEATURE_TAGS,
  } = process.env

  return {
    ...(GOBLET_FEATURE_NAME && { name: GOBLET_FEATURE_NAME }),
    ...(GOBLET_FEATURE_TAGS && { tags: GOBLET_FEATURE_TAGS }),
  }
}
