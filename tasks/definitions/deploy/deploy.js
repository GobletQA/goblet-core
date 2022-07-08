module.exports = {
  deploy: {
    name: 'deploy',
    alias: ['dpl'],
    example: 'keg goblet deploy <sub-task> <options>',
    description: 'Run Goblet deploy tasks',
    tasks: {
      ...require('./backend'),
      ...require('./build'),
      ...require('./frontend'),
      ...require('./version'),
    },
    options: {},
  },
}
