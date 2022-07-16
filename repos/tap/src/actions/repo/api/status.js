import { Values } from 'HKConstants'
import { setRepo } from '../local/setRepo'
import { addToast } from 'HKActions/toasts'
import { gitAuthSignOut } from 'HKActions/admin'
import { removeRepo } from '../local/removeRepo'
import { setActiveModal } from 'HKActions/modals'
import { apiRequest } from 'HKUtils/api/apiRequest'
import { checkCall, noOpObj } from '@keg-hub/jsutils'
import { localStorage } from'HKUtils/storage/localStorage'

const { MODAL_TYPES, STATUS_TYPES } = Values

/**
 * When no mounted repo
 *   * Open git modal when in vnc mode
 *   * Else open the mount warning when in local mode
 * If no locally mounted repo
 * Clear and cache repo data in the store or local storage
 * 
 * @param {Object} status - Status object returned from the API
 * 
 * @returns {Object} - Passed in status object
 */
const setNoLocalMountState = async status => {
  if(status.mode === STATUS_TYPES.VNC)
    return setActiveModal(MODAL_TYPES.CONNECT_REPO)

  addToast({
    type: 'warn',
    message: status.message,
  })
  await removeRepo()
  setActiveModal(MODAL_TYPES.NO_LOCAL_MOUNT)

  return status
}


/**
 * Clear and cache repo data in the store or local storage
 * Then opens the sign in modal and opens a toast warning about the error
 *
 * @param {string} error - Error message returned from the API
 * @param {Object} data - Metadata about the API call
 * 
 * @returns {Object} - Passed in status object
 */
const setErrorState = async error => {
  await removeRepo()
  await gitAuthSignOut()
  setActiveModal(MODAL_TYPES.SIGN_IN)
}

/**
 * Called when the repo status is not returned from the API
 * Shows a toast warning about status
 *
 * @param {Object} status - Status object returned from the API
 *
 * @returns {Object} - Passed in status object
 */
const setNoRepoStatus = status => {
  addToast({
    type: 'error',
    message: `Repo status could not be determined`,
  })

  return status
}

/**
 * Calls the Backend API to get the current status of a connected repo ( mounted || via gitfs )
 * @param {Object} params - Arguments for making the Backend API call
 * 
 * @returns {Object} - status object returned from the Backend API
 */
export const statusRepo = async params => {
  addToast({
    type: 'info',
    message: `Getting Repo status...`,
  })

  const savedRepo = await localStorage.getRepo()

  const {
    data,
    error,
    success
  } = await apiRequest({
    method: 'GET',
    url: `/repo/status`,
    params: {...params, ...savedRepo?.git},
  })

  if(!success || error) return setErrorState(error)

  const { status=noOpObj, repo } = data

  return !status.mounted
      ? setNoLocalMountState(status)
      : !repo
        ? setNoRepoStatus(status)
        : checkCall(() => {
            setRepo(data)
            return status
          })
}
