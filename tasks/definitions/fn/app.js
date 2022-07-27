const { runCmd, error } = require('@keg-hub/cli-utils')
const { appRoot, containerDir } = require('../../paths')
const { loadEnvs } = require('../../utils/envs/loadEnvs')

const appFn = async args => {
  const { params } = args
  const { env, name } = params

  const envs = loadEnvs({
    env,
    noEnv: true,
    locations: [
      containerDir,
    ],
  }, false)

  const cmdOpts = {cwd: appRoot, envs}
  const nm = name || envs.GB_FN_APP_NAME

  nm
    ? await runCmd(`fn`, [
        `create`,
        `app`,
        nm
      ], cmdOpts)
    : error.throwError(`An fn app name is required. Missing context ${nm}`)

}

module.exports = {
  app: {
    name: 'app',
    alias: ['ap'],
    action: appFn,
    example: 'keg goblet fn app <options>',
    description: '',
    options: {
      name: {
        alias: [`nm`, `app`],
        example: `--name my-fn-name`,
        description: `Name of the fn app to create`
      }
    },
  },
}