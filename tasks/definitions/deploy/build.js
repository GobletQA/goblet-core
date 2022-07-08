const { Logger } = require('@keg-hub/cli-utils')
const { sharedOptions } = require('../../utils/task/sharedOptions')
const { buildBackend } = require('../../utils/deploy/buildBackend')
const { updateVersion } = require('../../utils/deploy/updateVersion')
const { buildFrontend } = require('../../utils/deploy/buildFrontend')
const { buildScreencast } = require('../../utils/deploy/buildScreencast')

const buildTypeError = (type) => {
  Logger.error(`Invalid build type(s) => "${type.join(' | ')}"`)
  Logger.log(`  * Must be one of "frontend" "backend" "screencast"`)
  Logger.empty()
  process.exit(1)
}

const getBuildTypes = props => {
  const { all, context, backend, screencast, frontend } = props
  if(all || context.includes('all')) return ['frontend', 'backend', 'screencast']

  const buildTypes = []

  if(frontend || context.includes('frontend') || context.includes('fe')) buildTypes.push('frontend')
  if(backend || context.includes('backend') || context.includes('be')) buildTypes.push('backend')
  if(screencast || context.includes('screencast') || context.includes('sc')) buildTypes.push('screencast')

  return buildTypes.length
    ? buildTypes
    : buildTypeError(context)
}

/**
 * Builds the Goblet docker image
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
const buildHerkin = async args => {
  const { params } = args 
  const { log } = params
  const buildTypes = getBuildTypes(params)

  params.version && await updateVersion(params.version, params.confirm, log)

  return await buildTypes.reduce(async (toResolve, buildType) => {
    await toResolve

    log && Logger.pair(`Running build for`, buildType)

    switch(buildType){
      case 'frontend':
        return await buildFrontend(args, buildType)
      case 'backend':
        return await buildBackend(args, buildType)
      case 'screencast':
        return await buildScreencast(args, buildType)
      default: 
        return buildTypeError(buildType)
    }
  }, Promise.resolve())
  
}

module.exports = {
  build: {
    name: 'build',
    alias: ['bld'],
    action: buildHerkin,
    example: 'keg goblet deploy build <options>',
    description: 'Build the Goblet production docker image',
    options: {
      context: {
        type: 'array',
        alias: ['type', 'name'],
        env: `GOBLET_DEPLOY_BUILD_CONTEXT`,
        example: 'keg goblet deploy build --context frontend,backend',
        allowed: ['all', 'frontend', 'fe', 'backend', 'be', 'screencast', 'sc'],
        description: `Context of the app to be built. Separate by a comma to build multiple`,
      },
      frontend: {
        alias: ['fe'],
        type: 'boolean',
        env: `GOBLET_DEPLOY_BUILD_FE`,
        example: 'keg goblet deploy build --frontend',
        description: 'Build the Goblet frontend application',
      },
      backend: {
        alias: ['be'],
        type: 'boolean',
        env: `GOBLET_DEPLOY_BUILD_BE`,
        example: 'keg goblet deploy build --backend',
        description: 'Build the Goblet backend application',
      },
      screencast: {
        alias: ['sc'],
        type: 'boolean',
        env: `GOBLET_DEPLOY_BUILD_SC`,
        example: 'keg goblet deploy build --screencast',
        description: 'Build the Goblet screencast application',
      },
      all: {
        type: 'boolean',
        env: `GOBLET_DEPLOY_BUILD_ALL`,
        example: 'keg goblet deploy build --all',
        description: 'Build all Goblet applications',
      },
      envs: {
        type: 'array',
        alias: ['envs'],
        env: `GOBLET_DEPLOY_BUILD_ENVS`,
        example: 'keg goblet deploy build --envs EXTRA=env-value,ANOTHER=env-value-2',
        description: 'Comma separated list of extra envs to app on to the build process',
      },
      tags: {
        type: 'array',
        alias: [`tag`, `tg`],
        env: `GOBLET_DEPLOY_BUILD_TAGS`,
        example: 'keg goblet deploy build --tag backend-app',
        description: 'Custom tags for the built docker images',
      },
      ...sharedOptions.version(`deploy`, `build`),
    },
  },
}
