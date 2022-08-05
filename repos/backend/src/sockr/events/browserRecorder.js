const { noOpObj } = require('@keg-hub/jsutils')
const { joinBrowserConf } = require('@gobletqa/shared/utils/joinBrowserConf')

// TODO: @lance-tipton - Move all socket.io setup and files to screencast folder
const {
  setPage,
  stopBrowser,
  startRecording,
} = require('@gobletqa/screencast/libs/playwright')

/**
 * Stats a the browser recorder from a socket.io event
 * Stores the recorder in the sockr Manager cache
 * Adds hook to emit an event when a recorder event fires
 * Adds hook to stop the browser when the recorders onCleanup event is fired
 *
 * @param {Object} data - Data object passed to the socket event from the FE
 * @param {Object} socket - Socket.io Socket object
 * @param {Object} Manager - Sockr Manager instance
 * @param {Object} app - Express app instance
 *
 * @returns {void}
 */
const handleStart = async (data, socket, Manager, app) => {
  const { token, ref, action, repo, ...browser } = data
  const browserConf = joinBrowserConf(browser, app)

  const recorder = await startRecording({
    action,
    browserConf,
    id: socket.id,
    onRecordEvent:(event) => {
      console.log(`Emit ${event.name} event`, event)
      Manager.emit(socket, event.name, { ...event, group: socket.id })
    },
    onCleanup: async closeBrowser => {
      closeBrowser && await stopBrowser(browserConf)
    },
    onCreateNewPage: async page => {
      page && await setPage(page)
    },
  })

  Manager.cache[socket.id].recorder = recorder
}


/**
 * Stops the browser recorder from recording actions
 * Pulls the Recorder instance from Sockr Manager Cache
 * Then calls the recorders stop method
 *
 * @param {Object} data - Data object passed to the socket event from the FE
 * @param {Object} socket - Socket.io Socket object
 * @param {Object} Manager - Sockr Manager instance
 *
 * @returns {void}
 */
const handleStop = async (data, socket, Manager) => {
  const { action=noOpObj } = data
  const cache = Manager.cache[socket.id]

  // TODO: handle socket.io error - missing cache to stop recorder
  if(!cache || !cache.recorder)
    return console.log(`Missing socket cache or recorder`, cache)

  await cache.recorder.stop(...action.props)
  delete cache.recorder

}

/**
 * Handler for registering Browser Recorder start and stop events
 * @function
 * @param {Object} app - Express App object
 *
 * @returns {function} - Custom Event Method passed to Sockr to be called from the frontend
 */
const browserRecorder = app => {
  return async ({ data, socket, Manager }) => {
    // TODO: add token validation
    const { action } = data

    action.action === 'start'
      ? await handleStart(data, socket, Manager, app)
      : await handleStop(data, socket, Manager, app)
  }
}

module.exports = {
  browserRecorder,
}
