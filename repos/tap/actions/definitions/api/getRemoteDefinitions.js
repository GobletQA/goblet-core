import { addToast } from 'HKActions/toasts/addToast'
import { setDefinitions } from '../local/setDefinitions'
import { apiRepoRequest } from 'HKUtils/api/apiRepoRequest'

/**
 * Calls the API backend to load the parsed step definitions
 * Then calls setDefinitions, to add them to the Store
 * @type function
 *
 * @returns {void}
 */
export const getRemoteDefinitions = async () => {
  addToast({
    type: `info`,
    message: `Syncing step definitions with server!`,
  })

  const {
    data,
    error,
    success
  } = await apiRepoRequest(`/definitions`)

  if (!success || error)
    return addToast({
      type: 'error',
      message: error || `Error loading Step Definitions, please try again later.`,
    })
  
  const {definitions, definitionTypes} = data
  if(definitions || definitionTypes) setDefinitions(definitions, definitionTypes)

  return {definitions, definitionTypes}
}
