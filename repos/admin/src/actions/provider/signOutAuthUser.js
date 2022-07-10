import { Values } from 'HKConstants'
import { GitUser } from 'HKAdminServices/gitUser'
import { isAuthActive } from 'HKUtils/isAuthActive'
import { localStorage } from'HKUtils/storage/localStorage'
import { getProviderMetadata } from 'HKAdminServices/providers'
import { setActiveModal } from 'HKActions/modals/setActiveModal'

const { MODAL_TYPES } = Values
const authActive = isAuthActive()
const { auth } = getProviderMetadata()

/**
 * Calls the authProviders sign out method to sign out the currently signed in user
 * @public
 * @function
 *
 * @return {Void}
 */
export const signOutAuthUser = async () => {

  await localStorage.removeJwt()
  const currentUser = GitUser.getUser()

  // Remove local user data here
  GitUser.signOut()

  // If no active auth, just return
  if (!authActive) return

  currentUser &&
    console.info(`[Auth State Info] Logging out of of Goblet-Admin`)

  auth.signOut()

  // Open the sign in modal to force the user to re-sign in
  setActiveModal(MODAL_TYPES.SIGN_IN)
}
