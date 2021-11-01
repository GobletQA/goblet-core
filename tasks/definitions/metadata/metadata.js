
module.exports = {
  metadata: {
    name: 'metadata',
    alias: [ 'meta', `md` ],
    example: 'keg herkin metadata <options>',
    description : 'Interact with the browser metadata cache',
    tasks: {
      ...require('./print'),
      ...require('./path'),
    }
  }
}
