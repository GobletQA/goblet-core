import { Values } from 'HKConstants'
import { KeyStore } from 'KegNative/keyStore'
const { STORAGE } = Values

/**
 * Removes the store repo from local storage
 */
export const removeStoredJwt = async () => {
  try {
    return await KeyStore.removeItem(STORAGE.JWT)
  }
  catch (err) {}
}
