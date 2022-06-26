const connection = app => {
  return ({ socket, Manager }) => {

    // Todo Update to be the group / room name for the connected user
    const cache = Manager.cache[socket.id]
    cache.groupId = 'keg-herkin'

  }
}

module.exports = {
  connection,
}
