const { runCmd } = require('@keg-hub/cli-utils')
const { appRoot, containerDir } = require('../../paths')
const { loadEnvs } = require('../../utils/envs/loadEnvs')

const startFn = async args => {
  const { params } = args
  const { env, port } = params

  const envs = loadEnvs({
    env,
    noEnv: true,
    locations: [
      containerDir,
    ],
  }, false)

  const cmdOpts = {cwd: appRoot, envs}
  const cmdArgs = [`start`]
  port ? cmdArgs.push(`-p`, prt) : envs.GB_FN_PORT && cmdArgs.push(`-p`, envs.GB_FN_PORT)

  await runCmd(`fn`, cmdArgs, cmdOpts)
  
  envs.GB_FN_CONTEXT &&
    await runCmd(`fn`, [
      `use`,
      `context`,
      envs.GB_FN_CONTEXT
    ], cmdOpts)

}

module.exports = {
  start: {
    name: 'start',
    alias: ['st'],
    action: startFn,
    example: 'keg goblet fn start',
    description: '',
    options: {
      port: {
        example: `keg goblet fn start --port 10000`,
      }
    },
  },
}
