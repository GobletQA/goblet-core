const path = require('path')
const { appRoot } = require('../../paths')
const { fileSys } = require('@keg-hub/cli-utils')


/**
 * Gets the name of a firebase project based on those defined in the .firebaserc file
 * @function
 * @public
 * @throws
 * @param {Object} params - Options passed to the task parsed as an object
 * @param {Object} envs - Envs loaded for the current environment
 * @param {string} env - Environment the task was run in
 * 
 * @returns {string} - Found firebase project name
 */
const getFirebaseProject = async ({ params }, envs) => {
  const { env } = params

  const project = params.project || envs.NODE_ENV || env
  const content = fileSys.readFileSync(path.join(appRoot, `.firebaserc`))
  const data = JSON.parse(content)

  return data.projects[project] || project
}


module.exports = {
  getFirebaseProject
}