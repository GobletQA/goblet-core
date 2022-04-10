import { Values } from 'HKConstants'
import { setItems } from 'HKActions'
import { addToast } from '../../toasts/addToast'
import { isObj, pickKeys, exists } from '@keg-hub/jsutils'

const { CATEGORIES } = Values

/**
 * Updates the store with the passed in browser status
 *
 * @returns {Void}
 */
export const setBrowserRecording = (event) => {
  if(!isObj(event))
    return console.error(`Received setBrowserRecording call, but no event object was passed`) 

  setItems(CATEGORIES.RECORDING_BROWSER, pickKeys(event, [
    'isRecording',
    'timestamp',
    'socketId',
    'groupId'
  ]))

  exists(event.isRecording) &&
    addToast({
      type: 'info',
      message: `Browser Recording ${event.isRecording ? 'started' : 'stopped'}`,
    })
}
