const path = require('path')
const { setupBuild } = require('./setupBuild')
const { containerDir } = require('../../paths')
const { loadConfigs } = require('@keg-hub/parse-config')
const { docker, toBuildArgsArr, buildTags } = require('../docker')

/**
 * Builds the Goblet Screencast docker image
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
const buildScreencast = async ({ params }) => {
  // const {
  //   env,
  //   dir = containerDir,
  //   envFile,
  //   tag=`goblet-screencast:prod`,
  //   dockerfile=path.join(containerDir, `Dockerfile.screencast.prod`),
  // } = params

  // const envs = loadConfigs({
  //   env,
  //   noEnv: true,
  //   name: 'goblet',
  //   locations: [envFile, containerDir],
  // })

  // return await docker.build(
  //   [...toBuildArgsArr(envs), ...buildTags(tag), `-f`, dockerfile, dir],
  //   { cwd: dir, env, envs }
  // )
}

module.exports = {
  buildScreencast: setupBuild(buildScreencast)
}