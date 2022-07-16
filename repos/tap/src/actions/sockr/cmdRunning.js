import { addToast } from '../toasts/addToast'
import { dispatch, getStore } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'
import { get, noOpObj } from '@keg-hub/jsutils'
import { testRunModel } from 'HKModels'
import { setTestRun } from '../runner/setTestRun'
import { toggleTestRunning } from '../runner/toggleTestRunning'
import { setScreenById } from 'HKActions/screens/setScreenById'
import { getReportsActiveFile } from 'HKUtils/helpers/getReportsActiveFile'

const { CATEGORIES, SCREENS, SOCKR_MSG_TYPES } = Values

/**
 * Dispatches that a command is running
 * @param {Object} data - Message data from the socket
 *
 * @returns {void}
 */
export const cmdRunning = data => {
  const { items } = getStore().getState()
  const activeFile = getReportsActiveFile() || noOpObj

  if (!activeFile || !activeFile.fileType)
    return addToast({
      type: `error`,
      timeout: 6000,
      message: `Can not set command running. No active test file exists!`,
    })

  // Build the testFile model
  const builtModel = testRunModel({
    active: true,
    running: true,
    lastRun: data.timestamp,
    file: activeFile.location,
    fileType: activeFile.fileType,
    command: get(data, 'data.cmd'),
    params: get(data, 'data.params'),
    messages: {
      [data.timestamp]: {
        type: SOCKR_MSG_TYPES.CMD_RUN,
        timestamp: data.timestamp,
        message: `Running ${activeFile.fileType} tests for ${activeFile.name}`,
      },
    },
  })

  setTestRun(builtModel)

  toggleTestRunning(true)

  // TODO: get setting from store
  // Check if option is set to switch to a screen on test run
  // If options is set, then switch to that screen
  // Switch to the reports screen automatically
  // setScreenById(SCREENS.REPORTS)
}
