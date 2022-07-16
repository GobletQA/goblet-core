import { setRepos } from '../local/setRepos'
import { addToast } from 'HKActions/toasts/addToast'
import { apiRepoRequest } from 'HKUtils/api/apiRepoRequest'

/**
 * Gets all repos for the logged in user from the authorized provider
 * Then adds them to store, overwriting any existing provider repos
 *
 * @returns {Array} - List of loaded repos
 */
export const getRepos = async () => {
  addToast({
    type: 'info',
    message: `Getting repos list from provider`,
  })

  const {
    data,
    error,
    success
  } = await apiRepoRequest(`/repo/all`)

  if(!success || error)
    addToast({
      type: 'error',
      message: `Error loading repos from provider, please try again later.`,
    })

  data.repos && setRepos(data)

  return data.repos
}