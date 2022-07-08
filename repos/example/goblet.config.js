const path = require('path')

module.exports = {
  recorder: {
    locator: `-- 🍷 GOBLET`,
  },
  paths: {
    repoRoot: path.join(__dirname),
    workDir: 'goblet',
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
