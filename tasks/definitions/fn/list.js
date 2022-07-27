const { runCmd, error } = require('@keg-hub/cli-utils')
const { appRoot, containerDir } = require('../../paths')
const { loadEnvs } = require('../../utils/envs/loadEnvs')

const contextListFn = async args => {
  const { params } = args
  const { env } = params

  const envs = loadEnvs({
    env,
    noEnv: true,
    locations: [
      containerDir,
    ],
  }, false)

  const cmdOpts = {cwd: appRoot, envs}
  await runCmd(`fn`, [
    `context`,
    `list`,
  ], cmdOpts)

}

module.exports = {
  list: {
    name: 'list',
    alias: ['ls'],
    action: contextListFn,
    example: 'keg goblet fn list',
    description: '',
    options: {},
  },
}
