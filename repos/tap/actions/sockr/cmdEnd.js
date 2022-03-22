import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { addToast } from '../toasts/addToast'
import { get, noOpObj } from '@keg-hub/jsutils'
import { setTestRun } from '../runner/setTestRun'
import { getFileTree } from 'HKActions/files/api/getFileTree'
import { toggleTestRunning } from '../runner/toggleTestRunning'
import { getReportsActiveFile } from 'HKUtils/helpers/getReportsActiveFile'

const { CATEGORIES, SOCKR_MSG_TYPES } = Values

/**
 * Updates a testRunModel to no longer be running
 * @param {Object} data - Message data from the socket
 * @param {Object} testRunModel - The test run model to set running to false
 *
 * @returns {void}
 */
export const cmdEnd = (data, testRunModel) => {
  const { items } = getStore().getState()
  const activeFile = getReportsActiveFile() || noOpObj
  testRunModel =
    testRunModel || get(items, [CATEGORIES.TEST_RUNS, activeFile.location])

  const exitCode = get(data, 'data.exitCode', 0)

  testRunModel
    ? setTestRun({
        ...testRunModel,
        messages: {
          ...testRunModel.messages,
          [data.timestamp]: {
            message: `Finished running command!\n`,
            timestamp: data.timestamp,
            type: SOCKR_MSG_TYPES.CMD_END,
          },
        },
        exitCode,
        running: false,
        failed: Boolean(exitCode),
      })
    : addToast({
        type: `error`,
        timeout: 6000,
        message: `Can not set testRun model running. A testRun model is required!`,
      })

  // Turn of running tests
  toggleTestRunning(false)
  // Make call to reload the file tree
  // This lets us load in a new test report file if it was generated
  // TODO: Figure out a way to automatically load the new test report if it exists
  getFileTree()
}
