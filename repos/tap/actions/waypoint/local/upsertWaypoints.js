import { dispatch } from 'HKStore'
import { noPropArr } from '@keg-hub/jsutils'
import { Values, ActionTypes } from 'HKConstants'

const { CATEGORIES } = Values

/**
 * Dispatches the passed in waypoint tests fileModesl to the Store
 * @type function
 * @param {Array} waypoints - Parsed waypoint tests matching the filesModel
 *
 * @returns {void}
 */
export const upsertWaypoints = (waypoints = noPropArr) => {
  // TODO
}
