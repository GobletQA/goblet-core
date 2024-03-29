import { setScreenById } from 'HKActions/screens/setScreenById'

/**
 * Creates a new waypoint test file using the filesModel
 * @type function
 * @param {string} screenId - Id of the screen to set the created file as the activeFile
 * @param {string} name - Name of the new waypoint test file
 *
 * @returns {void}
 */
export const createWaypointFile = async (screenId, name) => {
  setScreenById(screenId)
}
