const bddApi = require('./bdd')
const repoApi = require('./repo')
const reportsApi = require('./reports')
const filesApi = require('./files')

module.exports = (...args) => {
  bddApi(...args)
  filesApi(...args)
  reportsApi(...args)
  repoApi(...args)
}
