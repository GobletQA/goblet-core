import { Logger } from '@keg-hub/cli-utils'
import { getApp } from '@gobletqa/shared/app'

/**
 * Logs error message
 * @function
 * @public
 * @param {Array<*>} args - Error data to be logged
 *
 * @returns {Void}
 */
const logError = (...args) => {
  Logger.error(`[Conductor Error]`, args.shift())
  args.length && Logger.error(...args)
}


/**
 * Adds listeners for error events on the express app, and logs them
 * @function
 *
 * @returns {Void}
 */
export const errorListener = () => {
  const app = getApp()

  app.on('error', exc => logError(exc))
  app.on('uncaughtException', exc => logError(exc))
}

