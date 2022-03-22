import { apiRepoRequest } from './apiRepoRequest'
import { addToast } from 'HKActions/toasts/addToast'

/**
 * Helper to make file load requests to the Backend API
 * @function
 * @export
 * @public
 * @param {string} path - Path to the file to be loaded on the backend
 *
 * @returns {Object} - Response from the Backend API or callback function when it exists
 */
export const loadApiFile = async filePath => {
  if(!filePath)
    return addToast({
      type: 'error',
      message: [
        `Failed to load file. A file path is required`,
        `FilePath: ${filePath}`
      ].join(`\n`)
    })
  
  const resp = await apiRepoRequest(`/files/load?path=${filePath}`)

  if(!resp?.success || resp?.error)
    addToast({
      type: 'error',
      message: resp?.error || `Error loading file, please try again later.`,
    })

  return resp
}
