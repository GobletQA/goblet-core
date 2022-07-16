import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { setScreen } from './setScreen'

const { CATEGORIES } = Values

/**
 * Sets the currently active screen based on the passed in ID
 * @param {string} screenId - Id of the active screen
 * @param {Object} [screenModel] - Model of the screen to set active overrides screenId
 *
 * @returns {void}
 */
export const setScreenById = (screenId, screenModel) => {
  const { items } = getStore().getState()
  screenModel = screenModel || items[CATEGORIES.SCREENS][screenId]

  return setScreen(screenId, screenModel)
}
