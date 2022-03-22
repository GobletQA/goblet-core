import { Values } from 'HKConstants'
import { KeyStore } from 'KegNative/keyStore'
const { STORAGE } = Values

/**
 * Removes the store repo from local storage
 */
export const removeStoredRepo = async () => {
  try {
    return await KeyStore.removeItem(STORAGE.REPO)
  }
  catch (err) {}
}
