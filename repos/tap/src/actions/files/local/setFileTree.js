import { dispatch } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'

const { CATEGORIES } = Values

/**
 * setFileTree
 * @param {Array} rootPaths
 * @param {Array} nodes
 */
export const setFileTree = ({ rootPaths, nodes }) => {
  // Currently this resets the entire file tree
  // Need to come up with a way to save the state sidenav opened tree
  // That way if this is called, the sidenav items that are open remain open if they still exist
  return dispatch({
    type: ActionTypes.SET_ITEMS,
    payload: {
      category: CATEGORIES.FILE_TREE,
      items: {
        rootPaths,
        nodes,
      },
    },
  })
}
