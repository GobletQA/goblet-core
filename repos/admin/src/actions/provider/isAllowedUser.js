import { signOutAuthUser } from './signOutAuthUser'

// Get all allowed emails from the env
const allowedUser = (process.env.GB_GITHUB_AUTH_USERS || '').split(',')

// If in a non-dev env, then we should check for user emails
// Only check if allowed user emails actually exist
const shouldCheckUser =
  allowedUser.length &&
  ['staging', 'qa', 'production'].includes(process.env.NODE_ENV)

/**
 * Ensure the user is authorized to sign in
 * For demo purposes when deployed disabled for now
 * Only allows specific emails to sign in via github
 *
 * @param {string} email - The email to validate
 * @throws
 *
 */
export const isAllowedUser = async email => {
  // TODO: Make this an API call to get the allowed users from the backend
  // That will make it easier to update when deployed
  if (!shouldCheckUser || !allowedUser.length || allowedUser.includes(email))
    return

  await signOutAuthUser()
  throw new Error(`[Auth State Error] User is not authorized!`)
}
