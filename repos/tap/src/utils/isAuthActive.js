import { toBool } from '@keg-hub/jsutils'

const authActive = toBool(process.env.GB_AUTH_ACTIVE)

/**
 * Helper to get the status of git authentication
 */
export const isAuthActive = () => {
  return authActive
}
