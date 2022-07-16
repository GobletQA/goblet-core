const unitJestConfig = require('./jest.unit.config')
const parkinJestConfig = require('./jest.parkin.config')
const waypointJestConfig = require('./jest.waypoint.config')
const { jestConfig } = require('./jest.default.config')

module.exports = {
  jestConfig,
  unitJestConfig,
  parkinJestConfig,
  waypointJestConfig
}