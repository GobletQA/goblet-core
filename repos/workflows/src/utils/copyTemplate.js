const path = require('path')
const { Logger } = require('@keg-hub/cli-utils')
const { copyContent } = require('./copyContent')
const { aliases } = require('HerkinConfigs/aliases.config')
const { checkHerkinConfig } = require('./checkHerkinConfig')
const { getCurrentRepoPath } = require('./getCurrentRepoPath')

/**
 * Copies the herkin template files into the mounted repo
 * First checks if a herkin.config exists
 * If it does, the template copy is bypassed
 *
 * @param {string} local - The local path to the mounted git repo
 * @param {string} template - Path to a template folder for custom herkin configuration
 *
 * @return {boolean} - True if herkin is configured or the template is copied
 */
const copyTemplate = async (local, template) => {
  Logger.info(`Searching for herkin config...`)
  const configLoc = await checkHerkinConfig(local)
  if (configLoc) return true

  Logger.info(`Creating herkin setup from template...`)
  const src = template || path.join(aliases.HerkinWF, `src/templates/repo/*`)
  const dest = await getCurrentRepoPath(local)

  return await copyContent({ src, dest })
    .then(() => true)
    .catch(err => {
      Logger.error(`Creating herkin from template failed`)
      Logger.log(err.stack)
      return false
    })
}

module.exports = {
  copyTemplate,
}