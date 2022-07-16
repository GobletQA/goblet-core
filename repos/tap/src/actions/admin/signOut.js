import { GitUser } from 'HKAdminServices/gitUser'

/**
 * Proxy action to the Admin gitUser.signOut method
 */
export const signOut = async () => {
  return await GitUser.signOut()
}