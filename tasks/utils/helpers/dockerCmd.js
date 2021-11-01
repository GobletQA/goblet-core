// -----
// TODO: Remove this file once new version of @keg-hub/cli-utils it published
// -----
const { inDocker } = require('HerkinSC')
const { runCmd } = require('@keg-hub/cli-utils')
const {
  isArr,
  isStr,
  exists,
  noOpObj,
  noPropArr,
  camelCase,
} = require('@keg-hub/jsutils')


/**
 * Converts the passed in envs Object into an array of docker argument envs
 * @param {Object} envs - Key value pair of envs
 *
 * @returns {Array} - Formatted array of envs matching docker cli requirements
 */
const envToStr = envs => Object.keys(envs)
  .reduce((acc, key) => {
    acc.push(`--env`)
    acc.push(`${key}=${envs[key]}`)

    return acc
  }, [])


/**
 * Ensures the passed in data is an array
 * If data is not an array, it must has a split method to convert to an array
 * @function
 * @private
 * @param {string|Array} [data=[]] - Data to ensure is an array
 *
 * @returns {Array} - Data converted to an array
 */
const ensureArray = (data=noPropArr) => (
  !exists(data)
    ? noPropArr
    : isArr(data)
      ? data
      : isStr(data)
        ? data.split(' ')
        : Logger.error(
            `The runCmd method requires arguments be an Array or string.\n`,
            `Instead got ${typeof data}: ${data}\n`,
            `Args will be ignored!\n`,
          ) || noPropArr
)

/**
 * Runs a command inside a docker container
 * @param {String} containerName - name of container to run command within
 * @param {Array<string>} args - docker exec args
 * @param  {Array<string>} extra.opts - docker exec opts
 * @param  {Array<string>} extra.envs - docker exec envs
 * @example
 * dockerExec('keg-herkin', 'npx qawolf create localhost:3000 foo')
 */
const dockerExec = (containerName, args, extra=noOpObj) => {
  const { opts=[], envs={} } = extra

  const allArgs = [
    'exec',
    '-it',
    ...envToStr(envs),
    containerName,
    ...ensureArray(args)
  ]

  return runCmd('docker', allArgs, opts)
}

/**
 * Runs a command inside the docker container
 * @param {String} containerName - name of container to run command within
 * @param {Array<string>} args - docker exec args
 * @param  {Array<string>} extra.opts - docker exec opts
 * @param  {Array<string>} extra.envs - docker exec envs
 * @example
 * containerExec('', 'npx playwright install firefox')
 */
const containerExec = (_, args, options=noOpObj, ...extra) => {
  const cmd = args.shift()
  const { opts=[], envs={} } = options

  return runCmd(
    cmd,
    ensureArray(args),
    {...options, ...opts, envs},
    ...extra
  )
}

const dockerCmd = (...args) => inDocker() ? containerExec(...args) : dockerExec(...args)


module.exports = {
  dockerCmd,
  dockerExec,
  containerExec,
}
