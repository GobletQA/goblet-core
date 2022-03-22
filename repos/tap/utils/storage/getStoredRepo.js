import { Values } from 'HKConstants'
import { KeyStore } from 'KegNative/keyStore'

const { STORAGE } = Values

/**
 * Loads repo object from local storage
 * Then immediately removes it from local storage
 */
export const getStoredRepo = async () => {
  try {
    const savedData = await KeyStore.getItem(STORAGE.REPO)
    return savedData && JSON.parse(savedData)
  } catch (err) {}
}
