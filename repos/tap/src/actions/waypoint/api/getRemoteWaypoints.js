import { addToast } from 'HKActions/toasts/addToast'
import { apiRepoRequest } from 'HKUtils/api/apiRepoRequest'
import { upsertWaypoints } from '../local/upsertWaypoints'

/**
 * Calls the API backend to load the parsed unit tests files
 * Then calls upsertWaypoint, to add them to the Store
 * @type function
 *
 * @returns {Array} - Found waypoint files loaded from the Backend API
 */
export const getRemoteWaypoints = async () => {
  const {
    data,
    error,
    success
  } = await apiRepoRequest(`/waypoints`)

  if(!success || error)
    addToast({
      type: 'error',
      message: error || `Error loading Waypoint files, please try again later.`,
    })

  data.waypoints && upsertWaypoints(data.waypoints)

  return data.waypoints
}
