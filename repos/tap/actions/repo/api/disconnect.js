import { get } from '@keg-hub/jsutils'
import { addToast } from 'HKActions/toasts'
import { removeRepo } from '../local/removeRepo'
import { apiRequest } from 'HKUtils/api/apiRequest'

export const disconnectRepo = async username => {
  addToast({
    type: 'info',
    message: `Disconnecting repo...`,
  })

  // Remove the repo locally first
  await removeRepo()

  // Then call the backend api to unmount the repo
  const {data, error} = await apiRequest({
    method: 'POST',
    url: `/repo/disconnect`,
    params: {
      username,
    },
  })

  error &&
    addToast({
      type: 'error',
      message:
        error.message || `An error occurred while disconnecting the repo :(`,
    })

  get(data, `repo.unmounted`) &&
    addToast({
      type: 'success',
      message: `Repo has been disconnected`,
    })
}
