import { ActionTypes, Values } from 'HKConstants'
import { getStore, dispatch } from 'HKStore'
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
  
  // TODO: figure out if I want to keep these events
  if(data.type === `pointerover`) return

  if(!data)
    return console.warn(`Browser record action received, but returned no data`, message)

  const { items } = getStore().getState()
  const recorderActions = items[CATEGORIES.RECORDING_ACTIONS]

  data.code && addToActiveFile(items, data, recorderActions.lineNumber)

  const updatedActions = {
    ...recorderActions,
    actions: {
      ...recorderActions.actions,
      [timestamp]: {timestamp, ...data},
    }
  }

  if(data.code && recorderActions.lineNumber){
    updatedActions.lineNumber = recorderActions.lineNumber + 1,
    updatedActions.range = {
      ...recorderActions.range,
      endLineNumber: recorderActions.range.endLineNumber + 1,
      startLineNumber: recorderActions.range.endLineNumber + 1,
    }
  }
  
  dispatch({
    type: ActionTypes.UPSERT_ITEMS,
    payload: {
      category: CATEGORIES.RECORDING_ACTIONS,
      items: updatedActions,
    }
  })

}

