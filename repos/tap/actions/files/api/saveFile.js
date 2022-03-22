import { saveApiFile } from 'HKUtils/api'
import { addToast } from 'HKActions/toasts'
import { noOpObj } from '@keg-hub/jsutils'
import { removePendingFile } from '../local/removePendingFile'

/**
 * Save the content to the given file. if no filePath passed in. it will save it on the currently active file
 * @param {Object} fileToSave - fileModel to be saved on the backend
 *
 * @returns {Object} - {success, fileModel}
 */
export const saveFile = async (fileToSave = noOpObj) => {
  const { location, content, fileType } = fileToSave

  if (!content || !location)
    return console.warn('File content and location are required')

  addToast({
    type: 'info',
    message: `Saving file ${fileToSave.name}!`,
  })

  const resp = await saveApiFile(location, content, fileType)
  if(!resp?.success) return noOpObj

  removePendingFile(fileToSave)
  addToast({
    type: 'success',
    message: `File ${fileToSave.name} was saved!`,
  })

  return resp?.data
}
