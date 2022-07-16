const path = require('path')
const { Logger } = require('@keg-hub/cli-utils')
const { copyContent } = require('./copyContent')
const { aliases } = require('@GConfigs/aliases.config')
const { checkGobletConfig } = require('./checkGobletConfig')
const { getCurrentRepoPath } = require('./getCurrentRepoPath')

/**
 * Copies the goblet template files into the mounted repo
 * First checks if a goblet.config exists
 * If it does, the template copy is bypassed
 *
 * @param {string} local - The local path to the mounted git repo
 * @param {string} template - Path to a template folder for custom goblet configuration
 *
 * @return {boolean} - True if goblet is configured or the template is copied
 */
const copyTemplate = async (local, template) => {
  Logger.info(`Searching for goblet config...`)
  const configLoc = await checkGobletConfig(local)
  if (configLoc) return true

  Logger.info(`Creating goblet setup from template...`)
  const src = template || path.join(aliases[`@GWF`], `templates/repo/*`)
  const dest = await getCurrentRepoPath(local)

  return await copyContent({ src, dest })
    .then(() => true)
    .catch(err => {
      Logger.error(`Creating goblet from template failed`)
      Logger.log(err.stack)
      return false
    })
}

module.exports = {
  copyTemplate,
}
