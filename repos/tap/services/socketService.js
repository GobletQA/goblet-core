import { isDev } from 'HKUtils/isDev'
import * as sockrActions from 'HKActions/sockr'
import { localStorage } from'HKUtils/storage/localStorage'
import { recordEvent } from 'HKActions/browser/recordEvent'
import { updateStatus } from 'HKActions/browser/updateStatus'
import { camelCase, snakeCase, checkCall } from '@keg-hub/jsutils'
import { WSService as SockrService, EventTypes } from '@ltipton/sockr'

const serverConfig = JSON.parse(process.env.WS_SERVER_CONFIG)

// TODO: @lance-tipton - This should only exist in deployed envs
if(!isDev) serverConfig.port = ''

/**
 * Callback event functions bound to the SocketService
 * Each property function is called when a socket event happens through Sockr
 * @type Object
 * @private
 *
 * @property {function} all - Called for all socket events
 * @property {function} connect - Called when the socket connects
 * @property {function} init - Called when the socket it initialized (after connect)
 * @property {function} cmdRunning - Called when a command is running on the backend
 */
const events = {
  all: function (message, instance, event) {
    if (!event) return

    // Get the name of the action from sockr's Event Types
    // And convert into an action name for the taps sockr actions
    const actionName = camelCase((event.split(':')[1] || '').toLowerCase())
    checkCall(sockrActions[actionName], message)
  },
  browserStatus: function (message) {
    updateStatus(message)
  },
  browserRecorder: function(message){
    recordEvent(message)
  },
}

/**
 * Service class for managing client websocket events
 * @function
 * @private
 *
 * @param {Object} config - Websocket client config object matching the config spec
 * @param {function} dispatch - Method to be called to update the websocket state
 * @param {string} token - Auth token for connecting to the websocket
 *
 * @returns {Object} - Instance of SocketService
 */
class SocketService {
  constructor(config) {
    this.events = Object.entries(events).reduce((bound, [name, func]) => {
      bound[name] = func.bind(this)
      return bound
    }, {})

    Object.assign(this, config)
  }

  /**
   * Sends an event to the connected backend through websocket ( Like an REST API call )
   * @memberof SocketService
   * @type function
   * @public
   * @param {string} event - Name of the event to emit ( Sent to the backend )
   * @param {Object} data - Content sent to the backend
   *
   * @returns {void}
   */
  emit = async (event, data) => {
    // Get a matching event type from sockr
    // Or use the passed in event if one does not exist
    const eventType = EventTypes[snakeCase(event)] || event
    const jwt = await localStorage.getJwt()

    // Emit the event to the backend
    SockrService.emit(eventType, { ...data, token: jwt })
  }

  /**
   * Calls the SockrService runCommand method
   * Helper to make running command esier
   * @memberof SocketService
   * @type function
   * @public
   * @param {Object} data - Content sent to the backend
   *
   * @returns {*} Response from SockrService.runCommand
   */
  runCommand = async (data, params) => {
    const jwt = await localStorage.getJwt()
    SockrService.runCommand({ ...data, token: jwt }, params)
  }

  /**
   * Disconnects from the backend websocket
   * Cleans up any open object || handles
   * @memberof SocketService
   * @type function
   * @public
   *
   * @returns {void}
   */
  disconnect = () => SockrService.disconnect()
}

export const WSService = new SocketService(serverConfig)
