const { runCmd, error } = require('@keg-hub/cli-utils')
const { appRoot, containerDir } = require('../../paths')
const { loadEnvs } = require('../../utils/envs/loadEnvs')

const contextFn = async args => {
  const { params } = args
  const { env, context } = params

  const envs = loadEnvs({
    env,
    noEnv: true,
    locations: [
      containerDir,
    ],
  }, false)

  const cmdOpts = {cwd: appRoot, envs}
  const ctx = context || envs.GB_FN_CONTEXT

  ctx
    ? await runCmd(`fn`, [
        `use`,
        `context`,
        ctx
      ], cmdOpts)
    : error.throwError(`An fn context is required. Missing context ${ctx}`)

}

module.exports = {
  context: {
    name: 'context',
    alias: ['ct'],
    action: contextFn,
    example: 'keg goblet fn context',
    description: '',
    options: {
      context: {
        alias: [`ctx`],
        example: `--context my-fn-context`,
        description: `Name of the fn context to use`
      }
    },
  },
}
