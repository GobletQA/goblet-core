module.exports = {
  fn: {
    name: 'fn',
    alias: ['fa', 'fs'],
    example: 'keg goblet fn <sub-task> <options>',
    description: 'Run Goblet fn tasks',
    tasks: {
      ...require('./app'),
      ...require('./context'),
      ...require('./invoke'),
      ...require('./deploy'),
      ...require('./list'),
      ...require('./start'),
    },
    options: {},
  },
}
