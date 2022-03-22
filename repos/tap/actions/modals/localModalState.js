import { toBool } from '@keg-hub/jsutils'
import { KeyStore } from 'KegNative/keyStore'

/**
 * Removes local modal state if it exists
 *
 * @param {string} modalName - Name of the modal to set the state for
 *
 * @returns {Void}
 */
export const removeLocalModalState = async (modalName) => {
  await KeyStore.removeItem(modalName)
}

/**
 * Stores the state of a locally viewed modal in local storage
 * Allow persisting if a modal was viewed already
 * In cases when a modal should only be viewed once
 *
 * @param {string} modalName - Name of the modal to set the state for
 * @param {boolean} state - Flag for if a modal has been viewed
 *
 * @returns {Void}
 */
export const setLocalModalState = async (modalName, state) => {
  KeyStore.setItem(modalName, JSON.stringify(toBool(state)))
}

/**
 * Gets the locally stored state of a modal from local storage
 * @param {string} modalName - Name of the modal to get the state for
 * 
 * @returns {boolean} - True if the modal has already been viewed
 */
export const getLocalModalState = async modalName => {
  const data = await KeyStore.getItem(modalName)
  try {
    return toBool(JSON.parse(data))
  } catch (err) {}

  return false
}