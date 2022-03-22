import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getConfig } from './firebaseConfig'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth'

const firebaseConfig = getConfig()
const firebaseApp = firebaseConfig && initializeApp(firebaseConfig.credentials)
const firestore = firebaseApp && getFirestore(firebaseApp)
const firebaseAuth = firebaseApp && getAuth(firebaseApp)

// Setup auth persistence
firebaseApp &&
  firebaseAuth &&
  setPersistence(
    firebaseAuth,
    process.env.FIRE_BASE_PERSISTENCE === 'session'
      ? browserSessionPersistence
      : browserLocalPersistence
  )

/**
 * Helper to get the current users token ID
 * @param {boolean} forceRefresh - Force invalidate the token, and generate a new one
 *
 * @return {string} - Current users token
 */
export const getUserToken = async (forceRefresh = true) => {
  return (
    (await firebaseApp) && firebaseAuth.currentUser.getIdToken(forceRefresh)
  )
}

/**
 * Gets provider metadata for firebase modules
 *
 * @return {Object} - Contains all initialized firebase modules
 */
export const getProviderMetadata = () => ({
  app: firebaseApp,
  auth: firebaseAuth,
  database: firestore,
  config: firebaseConfig,
})
