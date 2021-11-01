const featuresApi = require('./features')
const rootApi = require('./root')
const definitionsApi = require('./definitions')
const bddApi = require('./bdd')
const filesApi = require('./files')
const reportsApi = require('./reports')

// TODO: Add way to load this dynamically
// Only want to add this when running screencast on same server instance
const screencastApi = require('HerkinSCEndpoints')

module.exports = (...args) => {
  bddApi(...args)
  featuresApi(...args)
  definitionsApi(...args)
  filesApi(...args)
  rootApi(...args)
  reportsApi(...args)
  screencastApi(...args)
}