const { checkCall } = require('@keg-hub/jsutils')

/**
 * Check if an arg exists, and calls the passed in method if it does
 * @exists
 * @param {Array} args - Arguments passed on runtime
 * @param {string} arg - Argument to check if it exists
 * @param {function} method - Method to call if arg exists
 *
 * @return {Void}
 */
const checkAndCall = async (args, arg, method) => {
  Boolean(args.find(_arg => _arg === arg)) && (await checkCall(method, args))
}

/**
 * Checks the passed in args || process args
 * Looks for status, kill-all, and daemon args
 * If found, calls the matching method
 * @exists
 * @param {Array} args - Arguments passed on runtime
 * @param {Object} methods - Methods to call if an arg exists
 *
 * @return {Void}
 */
const checkArgs = async (args, methods) => {
  args = args || process.argv.slice(2)
  await checkAndCall(args, '--pid', methods.pid)
  await checkAndCall(args, '--status', methods.status)
  await checkAndCall(args, '--daemon', methods.daemon)
  await checkAndCall(args, '--restart', methods.restart)
  await checkAndCall(args, '--kill-all-screencast', methods.kill)
}

module.exports = {
  checkArgs,
}
