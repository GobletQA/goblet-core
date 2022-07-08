const { Logger } = require('@keg-hub/cli-utils')
const { runSeq, capitalize } = require('@keg-hub/jsutils')

/**
 * Run each command in sequence or all at the same time
 * @param {Array<function>} commands - Group of command functions to run
 * 
 * @returns {Array<number>} - Exit code of each command run
 */
const runCommands = async (commands, params) => {
  const { concurrent, log } = params
  return concurrent
    ? await runSeq(commands)
    : await Promise.all(commands.map(async cmd => {
        const exitCode = await cmd()
        if(!exitCode) return exitCode

        Logger.error(`[Goblet] Browser ${capitalize(cmd.browser)} Error`)
        // log && Logger.pair(`CMD Args: `, cmd.cmdArgs.join(' '))
        // log && Logger.log(`CMD Opts: `, cmd.cmdOpts)
        return exitCode
      })) 
}

module.exports = {
  runCommands
}