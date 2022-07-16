import { setScreenById } from 'HKActions/screens/setScreenById'

/**
 * Creates a new unit test file using the filesModel
 * @type function
 * @param {string} screenId - Id of the screen to set the created file as the activeFile
 * @param {string} name - Name of the new unit test file
 *
 * @returns {void}
 */
export const createUnitFile = async (screenId, name) => {
  setScreenById(screenId)
}
