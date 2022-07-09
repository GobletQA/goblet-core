const { get, exists, noOpObj } = require('@keg-hub/jsutils')

const platformMap = {
  amd: `linux/amd64`,
  arm: `linux/arm64`,
  all: `linux/amd64,linux/arm64`
}

/**
 * Gets the platforms to use during the build process
 * Looks in the param.platform, container.envs.KEG_BUILD_PLATFORMS
 * Or uses the default `linux/amd64,linux/arm64`
 * If param.platform of container.envs.KEG_BUILD_PLATFORMS is set to false,
 * no platforms will be included
 * @param {Object} options - options for configuring the docker command
 * @param {Object} options.platform - The platform to be used
 * @param {Object} contextData - Metadata for the current context
 * @param {Object} contextData.contextEnvs - Envs for the current context
 * 
 * @returns {Array} - Docker Platform options
 */
const getPlatforms = (options, contextData=noOpObj) => {
  const { platform } = options
  const paramPlatform = platformMap[platform] || platform
  const platformsEnv = get(contextData, `envs.KEG_BUILD_PLATFORMS`)

  const platforms = exists(paramPlatform)
    ? paramPlatform
    : exists(platformsEnv)
      ? platformsEnv
      : `linux/amd64,linux/arm64`

  // Add --platforms, then remove it from platforms if it already exists
  // This way it works regardless if it was already added or not
  return `--platform ${platforms.replace(`--platform`, ``).trim()}`.trim().split(' ')
}

module.exports = {
  getPlatforms
}