const express = require('express')
const { getApp } = require('GobletSharedApp')
const { AppRouter } = require('GobletSharedRouter')

/**
 * Configures the express bodyParser and add the AppRouter to the express app
 * @param {Object} app - Express app object
 *
 * @returns {void}
 */
const setupServer = app => {
  app = app || getApp()

  app.set('trust proxy', 1)
  app.disable('x-powered-by')

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Add the express router to the app
  app.use(AppRouter)
}

module.exports = {
  setupServer,
}
