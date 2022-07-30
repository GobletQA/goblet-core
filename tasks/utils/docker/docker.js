const { appRoot } = require('../../paths')
const { loadEnvs } = require('../envs/loadEnvs')
const { getPlatforms } = require('./getPlatforms')
const { docker: dockerCmd, Logger } = require('@keg-hub/cli-utils')
const {
  isStr,
  isObj,
  noOpObj,
  noPropArr,
  deepMerge,
} = require('@keg-hub/jsutils')


/**
 * Sets up docker to use buildX build instead of build
 * Also check and add platforms, if the build is being pushed
 */
const buildX = (cmd, callback, cmdArgs=noPropArr, options=noOpObj, params=noOpObj) => {
  // Add the build platform for the image
  const platformOpts = !params.push
    ? [ cmd, `--load`]
    : [ cmd, `--push`, ...getPlatforms(options, {envs: {...process.env, ...options.envs}})]

  // Call the callback, adding the platform args array with the first arg, which should be an array
  // Then spread the other args to match calling the docker command
  return callback(
    `buildx`,
    platformOpts.concat(toArr(cmdArgs)),
    options
  )
}

/**
 * Checks the passed in arguments and reorders them based on their type
 * If no opts and dynArgs is an Object
 * Then treat argsArr as an empty array
 * then update dynArgs and opts
 * @param {function} method - Function to be called with the other arguments
 * @param {cmd} cmd - String that's just passed through to the method
 * @param {Array} argsArr - Could be the pre | post args of the passed in method
 * @param {Object|Array} dynArgs - If an object, then is set as the value of argsArr
 * @param {Object|undefined} opts - If undefined, and dynArgs is an object, then is set as the value of dynArgs
 *
 * @returns {*} - Response from the passed in method
 */
const resolveArgs = (method, cmd, argsArr = noPropArr, dynArgs, opts) => {
  // If no opts are passed, and dynArgs is an object
  // The update the args to match the other call signature
  if (!opts && isObj(dynArgs)) {
    opts = dynArgs
    dynArgs = argsArr
    argsArr = noPropArr
  }

  return method(cmd, argsArr, dynArgs, opts || noOpObj)
}

/**
 * Converts the passed in args to an array if it's a string
 * @param {Array<string>|string} args - To be converted into an array
 *
 * @return {Array<string>} - The args converted into an array
 */
const toArr = args => {
  return [...(isStr(args) ? args.split(' ') : args)]
}

/**
 * Runs a docker command based on the passed in arguments
 * @param {string} cmd - Docker command to run
 * @param {Array<string>|string} args - arguments of the command
 * @param {Object} opts - Options to pass to the spawned child process
 *
 * @returns {*} - Response from the spawned child process
 */
const dockerExec = async (cmd, preArgs, postArgs, opts) => {
  const {
    env,
    log,
    envFile,
    envFiles = noPropArr,
    cwd = appRoot,
    envs = noOpObj,
    ...cmdOpts
  } = opts

  const cmdEnvs = {
    ...(envFile || envFiles ? loadEnvs({ env, locations: [...envFiles, envFile] }) : noOpObj),
    ...envs,
  }

  const options = deepMerge({ env: cmdEnvs, log }, cmdOpts)
  const cmdArgs = [...toArr(preArgs), cmd, ...toArr(postArgs)].filter(arg => arg)

  log && Logger.log(cmdArgs.join(' '))

  return await dockerCmd(cmdArgs, options, cwd)
}

const login = async (args=noPropArr, options=noOpObj, cwd=appRoot) => {
  return await dockerCmd(['login', ...args], options, cwd)
}

const createContext = async (args, options=noOpObj, cwd=appRoot) => {
  return await dockerCmd([`context` `create`, ...args], options, cwd)
}

const useContext = async (args, options=noOpObj, cwd=appRoot) => {
  return await dockerCmd([`context`, `use`, ...args], options, cwd)
}

const docker = (...args) => resolveArgs(dockerExec, ...args)
docker.run = (...args) => docker('run', ...args)
docker.stop = (...args) => docker('stop', ...args)
docker.remove = (...args) => docker('rm', ...args)
docker.exec = (...args) => docker('exec', ...args)
docker.build = (...args) => buildX('build', (...args) => docker(...args), ...args)
docker.attach = docker.exec
docker.login = login
docker.context = {
  use: useContext,
  create: createContext,
}


module.exports = {
  docker,
}
