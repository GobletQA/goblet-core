import { dispatch } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'
const { CATEGORIES } = Values

/**
 * Updates the store with any repos returned from Backend API
 * These are repos returned from the provider
 * @param {Object} - params
 * @param {Array} - params.repos - List of repos from the Authorized provider
 * 
 * @returns {Void}
 */
export const setRepos = params => {
  const { repos } = params

  repos &&
    repos.length &&
    dispatch({
      type: ActionTypes.SET_ITEMS,
      payload: {
        items: repos,
        category: CATEGORIES.PROVIDER_REPOS,
      },
    })

}
