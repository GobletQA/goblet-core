import { onAuthStateChanged } from "firebase/auth"
import { signOutAuthUser } from './signOutAuthUser'
import { isAuthActive } from 'HKUtils/isAuthActive'
import { getProviderMetadata } from 'HKAdminServices/providers'

const authActive = isAuthActive()
const { auth } = getProviderMetadata()

/**
 * Called when the user auth changes state for some reason
 * Validates the auth user still exists, and if not ensures the applications logs out
 * @callback
 * @function
 * @public
 * @param {Object} rawUser - User object returned from the provider
 *
 * @return {Void}
 */
const authStateChange = async rawUser => {
  if (rawUser) return

  authActive && console.warn(`[Auth State Change] Auth User no longer exists.`)

  await signOutAuthUser()
}

onAuthStateChanged(auth, authStateChange)
