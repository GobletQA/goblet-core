const jwt = require('express-jwt')

const setupJWT = (app, bypassRoutes) => {
  const config = app.locals.config.server
  const { secret, algorithms, credentialsRequired } = config.jwt

  // Does not seem to be parsing the JWT token properly
  app.locals.config.server.auth &&
    app.use(
      jwt({
        secret,
        algorithms,
        credentialsRequired
      })
      .unless({path: bypassRoutes})
    )
}

module.exports = {
  setupJWT
}