module.exports = {
  unit: {
    name: 'unit',
    alias: ['jest'],
    description: 'Runs unit test tasks',
    example: 'unit <sub-task> <options>',
    tasks: {
      ...require('./run'),
    },
  },
}
