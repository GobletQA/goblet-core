const path = require('path')

module.exports = {
  paths: {
    repoRoot: path.join(__dirname),
    workDir: 'herkin',
    reportsDir: 'reports',
    featuresDir: 'bdd/features',
    supportDir: 'bdd/support',
    stepsDir: 'bdd/steps',
    unitDir: 'unit',
    waypointDir: 'waypoint',
  },
  world: {
    app: {
      url: 'http://www.google.com',
    },
  },
}
