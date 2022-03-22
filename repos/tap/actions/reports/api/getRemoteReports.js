import { addToast } from 'HKActions/toasts/addToast'
import { upsertReports } from '../local/upsertReports'
import { apiRepoRequest } from 'HKUtils/api/apiRepoRequest'

/**
 * Calls the API backend to load reports of past run tests
 * Then calls upsertReports, to add them to the Store
 * @type function
 *
 * @returns {Array} - Found reports returned from the Backend API
 */
export const getRemoteReports = async () => {
  const {
    data,
    error,
    success
  } = await apiRepoRequest(`/reports`, {})

  if(!success || error)
    addToast({
      type: 'error',
      message: `Error loading Reports, please try again later.`,
    })

  data.reports && upsertReports(data.reports)

  return data.reports
}
