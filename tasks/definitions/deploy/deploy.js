module.exports = {
  deploy: {
    name: 'deploy',
    alias: ['dpl'],
    example: 'keg herkin deploy <sub-task> <options>',
    description: 'Run Keg-Herkin deploy tasks',
    tasks: {
      ...require('./backend'),
      ...require('./build'),
      ...require('./frontend'),
      ...require('./version'),
    },
    options: {},
  },
}