const path = require('path')
const { docker } = require('./docker')
const { buildTags } = require('./buildTags')
const { loadEnvs } = require('../envs/loadEnvs')
const { toBuildArgsArr } = require('./buildArgs')
const { appRoot, containerDir } = require('../../paths')
const { formatParamEnvs }  = require('../envs/formatParamEnvs')


/**
 * Builds the Goblet Base docker image
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
const buildBase = async args => {
  const { params  } = args
  const { env, envs, tags, log } = params
  const dockerfile = path.join(containerDir, `Dockerfile.base`)

    const loadedEnvs = loadEnvs({
      env,
      noEnv: true,
      locations: [
        containerDir,
      ],
    })

  const formattedEnvs = formatParamEnvs(envs)
  const buildEnvs = {...loadedEnvs, ...formattedEnvs}
  const cmdArgs = [
    ...buildTags(tags),
    `-t`,
    loadedEnvs.GB_BASE_IMAGE,
    ...toBuildArgsArr(buildEnvs),
    `-f`,
    dockerfile,
    appRoot
  ]

  return await docker.build(cmdArgs, {
    env,
    log,
    cwd: containerDir,
    envs: {
      ...buildEnvs,
      // Ensure npx auto-installs repos
      npm_config_yes: true,
    }
  }, params)
}

module.exports = {
  buildBase: buildBase
}