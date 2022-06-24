import { toBool } from '@keg-hub/jsutils'

const authActive = toBool(process.env.GOBLET_USE_AUTH)

/**
 * Helper to get the status of git authentication
 */
export const isAuthActive = () => {
  return authActive
}
