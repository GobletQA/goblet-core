import { ActionTypes, Values } from 'HKConstants'
import { getStore, dispatch } from 'HKStore'
import { getActiveFile } from 'HKUtils/helpers/getActiveFile'
import { setActiveFileFromType } from 'HKActions/files/local/setActiveFileFromType'

const { CATEGORIES } = Values

/**
 * Checks if the page load event code has already been added with the same URL
 * If it has, then adding the code is skipped
 * @param {string[]} lines - Lines of code in the activeFile
 * @param {Object} data - Message data from the socket
 *
 * @returns {boolean} - True if the page.goto line has not been added
 */
const checkPageLoadEvent = (lines, data) => {
  const hasPageLoad = lines.reduce((eventExists, line) => {
    if(eventExists) return eventExists

    const [gotoCode, ...extra] = data.code.split(`\n`)

    const cleaned = line.trim()
    return cleaned.includes(gotoCode) ||
      (cleaned.includes(`page.goto`) && cleaned.includes(data.url))
  }, false)

  // Return the opposite of hasPageLoad
  // If it exists, we don't want to readd it
  return !hasPageLoad
}

/**
 * Checks if the data object has code that should be added to the activeFile
 * If it does, then its added to the file on the recorderActions.lineNumber or the end of the file
 * @param {Object} activeFile - file model of the currently active file
 * @param {Object} data - Message data from the socket
 * @param {Object} recorderActions - Current state of the recorded actions
 *
 * @returns {boolean} - True if the line was added to the activeFile content
 */
const addToActiveFile = (activeFile, data, recorderActions) => {
  const lines = activeFile.content.split('\n')
  
  const addLine = data.type === `pageload`
    ? checkPageLoadEvent(lines, data, recorderActions)
    : true

  if(!addLine) return false

  const insertAt = recorderActions.lineNumber || lines.length

  lines.splice(insertAt, 0, ...data.code.split(`\n`))

  setActiveFileFromType(
    {...activeFile, content: lines.join(`\n`)},
    undefined,
    true
  )

  return true
}


/**
 * Gets a message from the socket and check if the action should be saved
 * If saved, then adds it to the recorderActions state
 * And updates the activeFile with the code for the recorded action
 * @param {Object} message - Message data from the socket
 *
 * @returns {void}
 */
export const recordAction = (message) => {
  const { data, timestamp } = message

  // TODO: figure out if I want to keep these events
  if(data.type === `pointerover` || data.type === `pointerout`) return

  if(!data)
    return console.warn(`Browser record action received, but returned no data`, message)

  const { items } = getStore().getState()
  const activeFile = getActiveFile(items)
  const recorderActions = items[CATEGORIES.RECORDING_ACTIONS]

  const saveEvent = data.code
    ? addToActiveFile(activeFile, data, recorderActions)
    : true

  if(!saveEvent) return

  // Create a new object of the recorderActions to ensure the state updates
  const updatedActions = {
    ...recorderActions,
    actions: {
      ...recorderActions.actions,
      [timestamp]: {timestamp, ...data},
    }
  }

  // Check how many lines of code were added, but default to 1
  const addLineNumber = parseInt(data.codeLineLength) || 1

  if(data.code && recorderActions.lineNumber){
    updatedActions.lineNumber = recorderActions.lineNumber + addLineNumber,
    updatedActions.range = {
      ...recorderActions.range,
      endLineNumber: recorderActions.range.endLineNumber + addLineNumber,
      startLineNumber: recorderActions.range.startLineNumber + addLineNumber,
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

