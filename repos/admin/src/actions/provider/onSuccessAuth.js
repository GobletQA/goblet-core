import { isAllowedUser } from './isAllowedUser'
import { signOutAuthUser } from './signOutAuthUser'
import { GitUser } from 'HKAdminServices/gitUser'
import { apiRequest } from 'HKUtils/api/apiRequest'
import { isArr, pickKeys, noPropArr } from '@keg-hub/jsutils'
import { setRepos } from 'HKActions/repo/local/setRepos'

/**
 * Formats the response from the git provider sign in
 * Builds a user object from the provided data
 * @function
 * @private
 *
 * @param {Object} data - Response from Git Provider Sign In
 *
 * @return {Object} - Built user item
 */
const formatUser = (data) => {
  const { uid, email, displayName } = pickKeys(data.user, [
    'uid',
    'email',
    'displayName',
  ])

  const { screenName:username, profile } = pickKeys(data.additionalUserInfo, [
    'profile',
    'screenName',
  ])


  const { providerId, accessToken } = pickKeys(data.credential, [
    'accessToken',
    'providerId',
  ])

  return {
    id: uid,
    displayName,
    email: email,
    username: username,
    token: accessToken,
    provider: providerId,
    reposUrl: profile.repos_url,
  }
}

/**
 * Validate the response from the Backend API
 * Ensure we have all the correct Provider user metadata
 * @param {Object} resp - Response from the Backend API call
 * @throws
 * 
 * @return {Object} - Contains the user object and repos array returned from the Backend API
 */
const validateResp = resp => {
  if (!resp || resp.error || !resp.username || !resp.id || !resp.provider)
    throw new Error(resp?.error || `Invalid user authentication`)

  const { repos, ...user } = resp

  return {
    user,
    repos: isArr(repos) ? repos : noPropArr,
  }
}

/**
 * Called when a user is authorized to access Herkin-Admin
 * If they are a new user, it creates a new user and account
 * On each sign in, it also saves the users auth token, which can be used for accessing the git provider
 * Then loads the Dashboard root
 * @callback
 * @function
 * @public
 *
 * @param {Object} data - Response from the Auth provider on a successful sign in
 *
 * @return {Void}
 */
export const onSuccessAuth = async (authData, callback) => {
  try {
    const userData = formatUser(authData)
    await isAllowedUser(userData.email)

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
    if(error || !success) throw new Error(error)

    const {repos, user} = validateResp(data)

    repos && repos.length && setRepos({repos})
    new GitUser(user)

  }
  catch (err) {
    console.warn(
      `[Auth State Error] Could not validate user. Please try agin later.`
    )
    console.error(err.message)
    await signOutAuthUser()
  }
}
