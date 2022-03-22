import { signOutAuthUser } from './signOutAuthUser'
import { apiRequest } from 'HKUtils/api/apiRequest'

/**
 * Called when a user is authorized to access Herkin-Admin
 * @callback
 * @function
 * @public
 *
 * @param {Object} data - Response from the Auth provider on a successful sign in
 *
 * @return {Void}
 */
export const userValidate = async userData => {
  const {
    data,
    error,
    success
  } = await apiRequest({
    params: userData,
    method: 'POST',
    url: `/auth/validate`,
  })

  // If response if false, the session is invalid, and the user must sign in again
  if(!success || error) {
    await signOutAuthUser()
    throw new Error(error || `Failed to validate user, please sign in again`)
  }

  // TODO: do something with the user?
  return data.user
}
