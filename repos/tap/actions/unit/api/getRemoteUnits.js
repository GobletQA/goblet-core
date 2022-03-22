import { upsertUnits } from '../local/upsertUnits'
import { addToast } from 'HKActions/toasts/addToast'
import { apiRepoRequest } from 'HKUtils/api/apiRepoRequest'

/**
 * Calls the API backend to load the parsed unit tests files
 * Then calls upsertUnits, to add them to the Store
 * @type function
 *
 * @returns {Array} - Found unit files returned from the Backend API
 */
export const getRemoteUnits = async () => {
  const {
    data,
    error,
    success
  } = await apiRepoRequest(`/units`)

  if(!success || error)
    addToast({
      type: 'error',
      message: error || `Error loading Unit files, please try again later.`,
    })

  data.units && upsertUnits(data.units)

  return data.units
}
