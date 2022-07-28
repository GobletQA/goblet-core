const express = require('express')
const { getApp } = require('@GSH/App')
const { AppRouter } = require('@GSH/Router')


/**
 * Adds json parsing middleware
 * Can cause issues when using a Proxy, so it's configured via a flag
 */
const jsonParsing = (app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
}

/**
 * Configures the express bodyParser and add the AppRouter to the express app
 * @param {Object} app - Express app object
 *
 * @returns {void}
 */
const setupServer = (app, addAppRouter=true, parseJson=true) => {
  app = app || getApp()

  app.set('trust proxy', 1)
  app.disable('x-powered-by')

  parseJson && jsonParsing(app)

  // Add the express router to the app
  addAppRouter && app.use(AppRouter)
}

module.exports = {
  setupServer,
}
