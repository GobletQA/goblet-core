const path = require('path')

module.exports = {
  recorder: {
    locator: `-- 🍷 GOBLET`,
  },
  paths: {
    repoRoot: path.join(__dirname),
    workDir: 'goblet',
    artifactsDir: 'artifacts',
    reportsDir: 'artifacts/reports',
    featuresDir: 'bdd/features',
    supportDir: 'bdd/support',
    world: 'bdd/support/world.js',
    stepsDir: 'bdd/steps',
    unitDir: 'unit',
    waypointDir: 'waypoint',
  },
}
