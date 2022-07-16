import { GitUser } from 'HKAdminServices/gitUser'

/**
 * Proxy action to the Admin gitUser.loadUser method
 */
export const loadUser = async () => {
  return await GitUser.loadUser()
}