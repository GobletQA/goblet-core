import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { setItem } from 'HKActions'
import { addToast } from 'HKActions/toasts/addToast'
import { getActiveFile } from 'HKUtils/helpers/getActiveFile'
import { setActiveFileFromType } from 'HKActions/files/local/setActiveFileFromType'

const { CATEGORIES } = Values


const addToActiveFile = (items, data, lineNumber) => {

  const activeFile = getActiveFile(items)
  const lines = activeFile.content.split('\n')
  const insertAt = lineNumber || lines.length

  lines.splice(insertAt, 0, data.code)

  setActiveFileFromType(
    {...activeFile, content: lines.join('\n')},
    undefined,
    true
  )

}

/**
 * Gets the browser status from the server
 * @param {Object} data - Message data from the socket
 * @param {Object} testRunModel - The test run model to set running to false
 *
 * @returns {void}
 */
export const recordAction = (message) => {
  const { data, timestamp } = message
  if(!data)
    return console.warn(`Browser record action received, but returned no data`, message)

  const { items } = getStore().getState()
  const recorderActions = items[CATEGORIES.RECORDING_ACTIONS]

  data.code && addToActiveFile(items, data, recorderActions.lineNumber)

  setItem(CATEGORIES.RECORDING_ACTIONS, {
    ...recorderActions,
    actions: {
      ...recorderActions.actions,
      [timestamp]: {timestamp, ...data},
    }
  })
  
  addToast({
    type: 'info',
    message: `Received record event ${data.target}:${data.type}`
  })

}

