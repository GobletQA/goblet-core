const { stopBrowser } = require('HerkinSCPlaywright')

const disconnect = app => {
  return async ({ data, socket, config, Manager, io }) => {
    const cache = Manager.cache[socket.id]
    // Pass true to it closes the browser and page
    cache && cache.recorder && await cache.recorder.stop(true)
  }
}

module.exports = {
  disconnect,
}
