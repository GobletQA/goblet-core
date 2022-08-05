const authApi = require('./auth')
const rootApi = require('./root')
const repoApi = require('./repo')

// TODO: Add way to load this dynamically
// Only want to add this when running screencast on same server instance
const screencastApi = require('@gobletqa/screencast/endpoints')

module.exports = (...args) => {
  authApi(...args)
  repoApi(...args)
  rootApi(...args)
  screencastApi(...args)
}
