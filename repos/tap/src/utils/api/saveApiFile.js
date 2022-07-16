import { Values } from 'HKConstants'
import { apiRepoRequest } from './apiRepoRequest'
import { addToast } from 'HKActions/toasts/addToast'

const { HttpMethods } = Values
/**
 * Helper to make file save requests to the Backend API
 * @function
 * @export
 * @public
 * @param {string} filePath - Path to the file to be saved on the backend
 * @param {string} content - Text content to save to the file
 *
 * @returns {Object} - Response from the Backend API or callback function when it exists
 */
export const saveApiFile = async (filePath, content, fileType) => {
  if(!filePath)
    return addToast({
      type: 'error',
      message: [
        `Failed to save file. A file path is required`,
        `FilePath: ${filePath}`
      ].join(`\n`)
    })
    
  const resp = await apiRepoRequest({
    url: `/files/save`,
    method: HttpMethods.POST,
    params: {
      content,
      type: fileType,
      path: filePath,
    },
  })

  if(!resp?.success || resp?.error)
    addToast({
        type: 'error',
        message: resp?.error || `Error saving file, please try again later.`,
      })

  return resp
}
