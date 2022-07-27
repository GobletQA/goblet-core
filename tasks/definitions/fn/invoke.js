const { runCmd, error } = require('@keg-hub/cli-utils')
const { appRoot, containerDir } = require('../../paths')
const { loadEnvs } = require('../../utils/envs/loadEnvs')

const invokeFn = async args => {
  const { params } = args
  const { env, name, func } = params

  const envs = loadEnvs({
    env,
    noEnv: true,
    locations: [
      containerDir,
    ],
  }, false)

  const nm = name || envs.GB_FN_APP_NAME
  if(!nm) error.throwError(`An fn app name is required. Missing context ${nm}`)
  
  const fn = func || envs.GB_FN_APP_FUNC
  if(!func) error.throwError(`An fn app function is required. Missing context ${fn}`)

  const cmdOpts = {cwd: appRoot, envs}
  const cmdArgs = [`invoke`, nm, fn]

  await runCmd(`fn`, cmdArgs, cmdOpts)
}

module.exports = {
  invoke: {
    name: 'invoke',
    alias: ['in', `call`, `run`],
    action: invokeFn,
    example: 'keg goblet fn invoke <options>',
    description: '',
    options: {
      name: {
        alias: [ `name`, `nm`, `app`, `ap`],
        example: `--app my-fn-app`,
        description: `Name of the fn app to run`
      },
      func: {
        alias: [ `function`, `fn`, `method`],
        example: `--func my-fn`,
        description: `Name of the fn function to run`
      },
    },
  },
}