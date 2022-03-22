import { Values } from 'HKConstants'
import { KeyStore } from 'KegNative/keyStore'
import { isAuthActive } from 'HKUtils/isAuthActive'
import { clearUser } from 'HKAdminActions/user/local/clearUser'
import { upsertUser } from 'HKAdminActions/user/local/upsertUser'

const { STORAGE } = Values
const authActive = isAuthActive()

/**
 *
 * TODO: Add code to create session cookie with the backend
 * So user data is stored on the backend via http cookie
 * Then load the user data on this end
 *
 */

/**
 * We only want / allow one user signed in at a time
 * So store the current user here as a singleton
 */
let __CURRENT_USER

export class GitUser {
  
  /**
   * Helper to get the currently signed in git user
   */
  static getUser = () => {
    return __CURRENT_USER
  }

  /**
   * Helper to load the git user from local storage, and create a git user class instance
   */
  static loadUser = async () => {
    if (!authActive) return await GitUser.signOut()

    if (__CURRENT_USER) return __CURRENT_USER

    const savedData = await KeyStore.getItem(STORAGE.USER)
    let parsedUser
    try {
      parsedUser = JSON.parse(savedData)
    } catch (err) {}

    __CURRENT_USER = parsedUser && new GitUser(parsedUser)

    return __CURRENT_USER
  }

  /**
   * Helper to sign out the globally signed in git user
   */
  static signOut = async () => {
    __CURRENT_USER = undefined
    clearUser()
    await KeyStore.removeItem(STORAGE.USER)
  }

  constructor(data) {
    if (__CURRENT_USER) return __CURRENT_USER

    // Ensure is a valid git user before storing the metadata
    if(!data.username || !data.id || !data.provider){
      console.error(`Invalid git user information. Please sign in again`)
      return GitUser.signOut()
    }

    Object.assign(this, data)

    __CURRENT_USER = this

    KeyStore.setItem(STORAGE.USER, JSON.stringify(data))

    upsertUser(__CURRENT_USER)

    return __CURRENT_USER
  }
}
