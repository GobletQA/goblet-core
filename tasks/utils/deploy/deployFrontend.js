const { loadEnvs } = require('../envs/loadEnvs')
const { updateVersion } = require('./updateVersion')
const { get, deepMerge } = require('@keg-hub/jsutils')
const { Logger, runCmd, yarn } = require('@keg-hub/cli-utils')
const { appRoot, distDir, containerDir } = require('../../paths')
const { getFirebaseToken } = require('../firebase/getFirebaseToken')
const { copyFromContainer } = require('../docker/copyFromContainer')
const { getFirebaseProject } = require('../firebase/getFirebaseProject')

/**
 * Loads ENVs from config files for the current env
 * @param {string} env - Current env ( local | staging | production | etc... )
 * 
 * @returns {Object} - Loaded EVNs Object
 */
 const getConfigEnvs = env => {
  return loadEnvs({
    env,
    noEnv: true,
    locations: [
      containerDir,
    ],
  }, false)
}


/**
 * Runs the Keg-CLI tap.action task via the passed in tasks object
 * Calls the tap:bundle action defined in the Values.yml file
 * This means it must be run via the Keg-CLI for now
 *  - This will be fixed down the road when the Keg-CLI tasks are modularized
 * @param {Object} args - All arguments passed to the frontendDeploy task
 * 
 * @returns {*} - Response from the Keg-CLI tap.action task
 */
 const runBundleActions = async args => {
  const { params, tasks }= args
  const { version, confirm, log } = params
  process.env.KEG_ACTION_PARAMS = [
    `frontend=true`,
    `version=${version || false}`,
    `confirm=${confirm}`,
    `log=${log}`,
  ].join(' ')
  
  const actionTask = get(tasks, `tap.tasks.action`)
  if(!actionTask)
    throw new Error(`Tap action task not found. Command must be run with the Keg-CLI`)

  return await actionTask.action(deepMerge(args, {
    task: actionTask,
    params: {
      ...args.params,
      action: `tap:bundle`,
      workdir: `/keg/tap`,
      log: true,
    },
  }))
}

/**
 * Copies the generated bundle from the docker container to the host machine
 * @param {Object} envs - Load envs object for the current environment
 * @param {boolean} log - Should log status output
 * 
 * @returns {Void}
 */
 const copyBundleToLocal = async (envs, log) => {
  log && Logger.log(`Copying bundle from docker container ${envs.CONTAINER_NAME}...`)

  await copyFromContainer({
    local: distDir,
    container: envs.CONTAINER_NAME,
    // Copy directly from the web-build export in keg-core
    remote: `/keg/tap/node_modules/keg-core/web-build/.`,
  })
}

/**
 * Deploys the frontend to firebase hosting
 * @function
 * @public
 * @param {Object} args.params - Options passed to the task parsed as an object
 * @param {Object} args.envs - Envs loaded for the current environment
 * 
 * @returns {string} - Found firebase project name
 */
const deployToFirebase = async (args, envs) => {
  const { log } = args.params
  const cmdOpts = {cwd: appRoot, envs}

  // Ensure firebase-tools are installed
  log && Logger.log(`Ensuring firebase is installed...`)
  await yarn([`global`, `add`, `firebase-tools`], cmdOpts)

  // Get the firebase token
  const token = await getFirebaseToken(args, envs)

  // Get the project name to be deployed
  const project = await getFirebaseProject(args, envs)
  
  // Run the deploy command
  log && Logger.log(`Deploying build to firebase...`)
  return await runCmd(`firebase`, [
    `deploy`,
    `--non-interactive`,
    `--token`,
    token,
    `--project`,
    project,
    `--only`,
    `hosting`
  ], cmdOpts)

}

/**
 * Builds the frontend bundle in the running docker container
 * Copies the bundle to the host machine
 * Then uploads the bundle to firebase
 * @param {Object} args - All arguments passed to the frontendDeploy task
 * 
 * @returns {number} Firebase deploy exit code
 */
const deployFrontend = async args => {
  const { params } = args
  const { confirm, env, log, version } = params

  version && await updateVersion(version, confirm, log)

  await runBundleActions(args)

  const envs = getConfigEnvs(env)
  await copyBundleToLocal(envs, log)

  return await deployToFirebase(args, envs)
}

module.exports = {
  deployFrontend
}
