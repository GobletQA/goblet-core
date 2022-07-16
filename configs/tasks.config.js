module.exports = {
  // Default environment argument to allow short cuts when setting an env
  environment: {
    options: ['environment', 'env', 'e'],
    map: {
      production: ['production', 'prod', 'p'],
      qa: ['qa', 'q'],
      develop: ['development', 'develop', 'dev', 'd'],
      local: ['local', 'loc', 'l'],
      test: ['test', 'tst', 't'],
    },
  },

  // Task parsing settings
  settings: {
    defaultEnv: 'local',
    task: {
      optionsAsk: false,
    },
  },
}
