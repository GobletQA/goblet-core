
import { Values } from 'HKConstants'
import { KeyStore } from 'KegNative/keyStore'

const { STORAGE } = Values

/**
 * Loads repo object from local storage
 * Then immediately removes it from local storage
 */
export const getStoredJwt = async () => {
  try {
    return await KeyStore.getItem(STORAGE.JWT)
  } catch (err) {}
}
