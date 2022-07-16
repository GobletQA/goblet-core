import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { addToast } from '../toasts/addToast'
import { get, noOpObj } from '@keg-hub/jsutils'
import { setTestRun } from '../runner/setTestRun'
import { upsertSpec } from '../tracker/upsertSpec'
import { getReportsActiveFile } from 'HKUtils/helpers/getReportsActiveFile'

const {
  CATEGORIES,
  SOCKR_MSG_TYPES,
  PARKIN_SPEC_RESULT_LOG
} = Values

const parseCheckSpecResult = data => {
  if(!data || !data.message || !data.message.includes(PARKIN_SPEC_RESULT_LOG)) return

  try {
    const specItems = data.message.split(PARKIN_SPEC_RESULT_LOG)
      .filter(item => {
        const cleaned = item.trim()
        return cleaned.startsWith(`{`) && cleaned.endsWith(`}`)
      })

    return specItems.length && specItems
  }
  catch(err){
    console.warn(`Could not parse test spec`, err.message)
  }
}

/**
 * Updates the messages array of the active testRunModel with a stdout message
 * @param {Object} data - Message data from the socket
 * @param {Object} testRunModel - The test run model to update
 *
 * @returns {void}
 */
export const cmdOut = (data, testRunModel) => {
  // Check if it's a parsed spec output
  // If it is, then call the upsertSpec action instead
  const specItems = parseCheckSpecResult(data)
  if(specItems) return specItems.map((item, idx) => upsertSpec(JSON.parse(item), idx))

  const { items } = getStore().getState()
  const activeFile = getReportsActiveFile() || noOpObj
  testRunModel =
    testRunModel || get(items, [CATEGORIES.TEST_RUNS, activeFile.location])

  testRunModel
    ? setTestRun({
        ...testRunModel,
        messages: {
          ...testRunModel.messages,
          [data.timestamp]: {
            message: data.message,
            timestamp: data.timestamp,
            type: SOCKR_MSG_TYPES.STD_OUT,
          },
        },
      })
    : addToast({
        type: `error`,
        timeout: 6000,
        message: `Can not add testRun messages. A testRun model is required!`,
      })
}
