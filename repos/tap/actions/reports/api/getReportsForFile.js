import { addToast } from 'HKActions/toasts/addToast'
import { apiRepoRequest } from 'HKUtils/api/apiRepoRequest'

/**
 * Calls the API backend to load reports for a single file
 * Then calls setReportActive, to add them to the Store
 * @type function
 *
 * @returns {Array} - Found reports for the file
 */
export const getReportsForFile = async props => {
  // TODO: Update props to include the file to load the reports for
  const {
    data,
    error,
    success
  } = await apiRepoRequest(`/reports`, {})

  if(!success || error)
    addToast({
      type: 'error',
      message: `Error loading repos from provider, please try again later.`,
    })
    
  data.reports && setReportActive(reports)

  return data.reports
}
