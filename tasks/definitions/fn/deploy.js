const { runCmd, error } = require('@keg-hub/cli-utils')
const { appRoot, containerDir } = require('../../paths')
const { loadEnvs } = require('../../utils/envs/loadEnvs')

const deployFn = async args => {
  const { params } = args
  const { env, name, local } = params

  const envs = loadEnvs({
    env,
    noEnv: true,
    locations: [
      containerDir,
    ],
  }, false)

  const cmdOpts = {cwd: appRoot, envs}
  const nm = name || envs.GB_FN_APP_NAME
  if(!nm) error.throwError(`An fn app name is required. Missing context ${nm}`)

  const cmdArgs = [`deploy`, `--app`, nm]
  local && cmdArgs.push(`--local`)

  await runCmd(`fn`, cmdArgs, cmdOpts)
}

module.exports = {
  deploy: {
    name: 'deploy',
    alias: ['dpl'],
    action: deployFn,
    example: 'keg goblet fn deploy <options>',
    description: '',
    options: {
      name: {
        alias: [ `name`, `nm`, `app`, `ap`],
        example: `--app my-fn-app`,
        description: `Name of the fn app to create`
      },
      local: {
        default: true,
        alias: [ `lc`],
        type: 'boolean',
        example: `--local`,
        description: `Set true if it's it a local deployment`
      }
    },
  },
}