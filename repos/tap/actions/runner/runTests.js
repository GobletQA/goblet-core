import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { WSService } from 'HKServices'
import { addToast } from 'HKActions/toasts'
import { clearSpecs } from 'HKActions/tracker/clearSpecs'
import { buildCmdParams } from 'HKUtils/helpers/buildCmdParams'

/**
 * Uses a web-socket to run tests on a file from the backend
 * Also updates the current active test file, which is different from the activeFile per-screen
 * @function
 * @param {Object} activeFile - file to set as the activeFile
 * @param {string} testCmd - Test type to run for this file
 * @param {string} screenID - Id of the screen that called runTests
 *
 */
export const runTests = async (
  activeFile,
  testCmd,
  screenID,
  autoChangeScreen = true
) => {
  addToast({
    type: 'info',
    message: `Running ${testCmd.name} tests for file ${activeFile.name}!`,
  })
  
  // Clear any existing tracker specs
  clearSpecs()

  const state = getStore()?.getState()

  const params = buildCmdParams({
    state,
    cmd: testCmd,
    fileModel: activeFile,
  })

  WSService.runCommand(testCmd, params)
}
