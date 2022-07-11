const { runSeq } = require('@keg-hub/jsutils')

/**
 * Run each command in sequence or all at the same time
 * @param {Array<function>} commands - Group of command functions to run
 * 
 * @returns {Array<number>} - Exit code of each command run
 */
const runCommands = async (commands, params) => {
  const { concurrent } = params
  return concurrent
    ? await runSeq(commands)
    : await Promise.all(commands.map(async cmd => cmd())) 
}

module.exports = {
  runCommands
}