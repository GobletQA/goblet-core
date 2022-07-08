const { Logger } = require('@keg-hub/cli-utils')
require('../../../../configs/aliases.config').registerAliases()

/**
 * Monkey patch the process.exit method
 * This allows running multiple workflow tests, and not exiting if it's called
 * We can also track if a workflow test failed, due process.exit being called
 */
let procExitCalled
const oldProcExit = process.exit
function procExit(exitCode) {
  procExitCalled = exitCode
  // Throw an error so we exit the currently running workflow
  throw new Error(
    `The process.exit method was called with exit code: ${exitCode}`
  )
}

process.exit = procExit.bind(process)

const runWorkflow = async name => {
  try {
    return await require(`./${name}`)
  } catch (err) {
    if (procExitCalled) Logger.error(`[ERROR] ${err.message}`)
    else {
      Logger.error(`[ERROR] ${name} workflow failed with error`)
      Logger.log(err.stack)
    }
    procExitCalled = undefined
  }
}

;(async () => {
  await runWorkflow('initializeGoblet')
  await runWorkflow('statusGoblet')

  // Always reset the process.exit at the end
  process.exit = oldProcExit
})()
