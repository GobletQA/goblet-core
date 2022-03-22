import { apiRepoRequest } from './apiRepoRequest'
import { addToast } from 'HKActions/toasts/addToast'

/**
 * Helper to make file delete requests to the Backend API
 * @function
 * @export
 * @public
 * @param {string} file - Path to the file to be deleted on the backend
 *
 * @returns {Object} - Response from the Backend API or callback function when it exists
 */
export const deleteApiFile = async ({ location }) => {
  if(!location)
    return addToast({
      type: 'error',
      message: [
        `Failed to delete file. A file path is required`,
        `FilePath: ${location}`
      ].join(`\n`)
    })
  
  const resp = await apiRepoRequest({
    method: 'delete',
    url: `/files/delete`,
    params: { file: location },
  })

  if(!resp?.success || resp?.error)
    addToast({
      type: 'error',
      message: resp?.error || `Error deleting file, please try again later.`,
    })

  return resp
}
