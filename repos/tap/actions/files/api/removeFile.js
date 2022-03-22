import { noOpObj } from '@keg-hub/jsutils'
import { getFileTree } from './getFileTree'
import { addToast } from 'HKActions/toasts'
import { deleteApiFile } from 'HKUtils/api/deleteApiFile'
import { clearActiveFile } from '../local/clearActiveFile'

/**
 * Deletes a file via the path from the passed in fileModel
 * @param {Object} fileModel - The fileModel of the file to be removed
 * @param {string} screenId - Id of the screen that has the file active
 *
 * @returns {Object} - {success}
 */
export const removeFile = async (fileModel, screenId) => {
  addToast({
    type: 'warn',
    message: `Removing file ${fileModel.name}!`,
  })

  const resp = await deleteApiFile(fileModel)
  if(!resp?.success) return noOpObj

  if(!resp.data || !resp.data.location)
    return addToast({
      type: 'error',
      message: `File was removed, but server returned an invalid response`,
    })
  
  addToast({
    type: 'success',
    message: `The file ${fileModel.name} was removed!`,
  })

  // Only clear the activeFile from the screen if the id is passed, or it's undefined
  // If false, then skip clearing the active file
  // Used for the features / step-definitions split
  // Otherwise it would clear the feature file when a step definition is removed
  screenId !== false && clearActiveFile(screenId)

  // reload the file tree after the file was removed
  getFileTree()

  return resp?.data
}
