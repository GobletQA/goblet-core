const { Repo } = require('HerkinSharedRepo/repo')

// Called when a user disconnects from the Sockr-Websocket
const disconnect = app => {
  return async ({ data, socket, config, Manager, io }, tokenData) => {
    const { iat, exp, ...user } = tokenData

    // TODO: investigate this is working properly
    // Disconnect the user mounted repo is it exists when they disconnect
    app.locals?.config?.server?.environment !== `local` &&
      await Repo.disconnect(user)

    const cache = Manager.cache[socket.id]
    // Pass true to it closes the browser and page
    cache && cache.recorder && await cache.recorder.stop(true)
  }
}

module.exports = {
  disconnect,
}
