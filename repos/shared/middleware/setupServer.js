const { getApp } = require('HerkinSharedApp')
const bodyParser = require('body-parser')
const { AppRouter } = require('HerkinSharedRouter')

/**
 * Configures the express bodyParser and add the AppRouter to the express app 
 * @param {Object} app - Express app object
 *
 * @returns {void}
 */
const setupServer = app => {
  app = app || getApp()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Add the express router to the app
  app.use(AppRouter)
}

module.exports = {
  setupServer
}