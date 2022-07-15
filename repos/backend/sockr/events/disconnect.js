const { Repo } = require('@GSH/Repo/repo')

// Called when a user disconnects from the Sockr-Websocket
const disconnect = app => {
  return async ({ socket, Manager }, tokenData) => {

    // TODO: Figure out how to get access to the user
    // Disconnect the user mounted repo is it exists when they disconnect
    // app.locals?.config?.server?.environment !== `local` &&
    //   await Repo.disconnect(user)

    const cache = Manager.cache[socket.id]
    // Pass true to it closes the browser and page
    cache && cache.recorder && await cache.recorder.stop(true)
  }
}

module.exports = {
  disconnect,
}
