const { get } = require('@keg-hub/jsutils')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { stopScreencast, startScreencast } = require('HerkinSCScreencast')

/**
 * Called when proxy throws an error and can not be connected to
 * This will restart the Screencast and the Browser
 */
const onProxyError = app => {
  return async (err, req, res, target) => {
    // If the screencast proxy errors
    // Try to restart it
    await stopScreencast()
    await startScreencast({})

    // TODO: Add Logger
    res.end(`[SC-Error]: Screencast not running, restarting...`)
  }
}

/**
 * Setup the novnc proxy to forward all requests to that server
 */
const setupVNCProxy = app => {
  const config = app.locals.config || {}

  const {
    port = 26369,
    protocol = 'ws',
    path = '/novnc',
    host,
    ...options
  } = get(config, `screencast.proxy`, {})


  if(!host) throw new Error(`VNC Proxy host is required!`)

  // TODO: This works for now because the websocket server runs locally
  // But will need to update in future
  const url = port ? `${host}:${port}` : host

  const wsProxy = createProxyMiddleware(path, {
    ws: true,
    changeOrigin: true,
    ...options,
    // onError: onProxyError(app),
    target: `${protocol}://${url}`,
  })

  app.use(wsProxy)

  return wsProxy
}

module.exports = {
  setupVNCProxy,
}
