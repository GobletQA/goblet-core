import { signOutAuthUser } from 'HKAdminActions/provider/signOutAuthUser'

/**
 * Proxy action to the Admin action signOutAuthUser to log out an authorized user
 */
export const gitAuthSignOut = async (...args) => {
  return await signOutAuthUser(...args)
}