const { stopBrowser } = require('HerkinSCPlaywright')

const disconnect = app => {
  return async ({ data, socket, config, Manager, io }) => {
    const cache = Manager.cache[socket.id]
    // Pass true to it closes the browser and page
    cache && cache.recorder && await cache.recorder.stop(true)

    // TODO: eventually store browser in Manager cache
    // Then pull browser for user and kill it
    await stopBrowser({}, app)
  }
}

module.exports = {
  disconnect,
}
