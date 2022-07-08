const path = require('path')
const { setupBuild } = require('./setupBuild')
const { appRoot, containerDir } = require('../../paths')
const { docker, toBuildArgsArr, buildTags } = require('../docker')

/**
 * Builds the Goblet Backend docker image
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {string} args.params - Passed in options, converted into an object
 * @param {Array} args.goblet - Local config, injected into the task args
 *
 * @returns {void}
 */
const buildBackend = async args => {
  const { params, envs, tags } = args
  
  const {
    env,
    dockerfile=path.join(containerDir, `Dockerfile`),
  } = params
  
  return await docker.build(
    [
      `--rm`,
      ...toBuildArgsArr(envs),
      ...buildTags(tags),
      `-f`,
      dockerfile,
      appRoot
    ],
    { cwd: containerDir, env, envs }
  )
}

module.exports = {
  buildBackend: setupBuild(buildBackend)
}