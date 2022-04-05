import { setItems } from 'HKActions'
import { Values } from 'HKConstants'
import { localStorage } from'HKUtils/storage/localStorage'
import { clearFileTree } from 'HKActions/files/local/clearFileTree'
import { clearFeatures } from 'HKActions/features/local/clearFeatures'
import { clearActiveFile } from 'HKActions/files/local/clearActiveFile'
import { clearPendingFiles } from 'HKActions/files/local/clearPendingFiles'
import { clearDefinitions } from 'HKActions/definitions/local/clearDefinitions'

const { STORAGE } = Values

const tryAction = (action, name, ...args) => {
  try {
    action(...args)
  }
  catch (err) {
    console.warn(`Error calling ${name} in "removeRepo" action`)
    console.warn(err.message)
  }
}

/**
 * Removes the currently loaded repo from the store and local storage
 * Also cleans out the store's features, definitions and file tree
 */
export const removeRepo = async () => {
  
  tryAction(setItems, 'setItems', STORAGE.REPO, {})
  tryAction(clearFeatures, `clearFeatures`)
  tryAction(clearDefinitions, 'clearDefinitions')
  tryAction(clearFileTree, 'clearFileTree')
  tryAction(clearActiveFile, 'clearActiveFile')
  tryAction(clearPendingFiles, 'clearPendingFiles')

  await localStorage.removeRepo()
}
