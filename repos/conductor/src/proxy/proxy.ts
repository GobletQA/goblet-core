import { TProxyConfig } from '../types'
import { DEF_HOST_IP } from '../constants/constants'
import { onProxyError } from '@gobletqa/conductor/utils'
import { getOrigin } from '@gobletqa/shared/utils/getOrigin'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { ProxyRouter } from '@gobletqa/conductor/server/routers'

const addAllowOriginHeader = (proxyRes, origin) => {
  proxyRes.headers['Access-Control-Allow-Origin'] = origin
}

const mapRequestHeaders = (proxyReq, req) => {
  Object.keys(req.headers)
    .forEach(key => proxyReq.setHeader(key, req.headers[key]))
}

/**
 * Maps the response headers from the response to the proxied response
 * @param {Object} proxyRes - Respose object used by the proxy
 * @param {Object} res - Original response object
 *
 * @returns {void}
 */
const mapResponseHeaders = (proxyRes, res) => {
  Object.keys(proxyRes.headers)
    .forEach(key => res.append(key, proxyRes.headers[key]))
}

/**
 * Global proxy handler. Any request that reach here, get passed on to a container via the proxy
 * It's not documented anywhere, but if null is returned, the express app router handles the request
 * This allows the `<domain>/tap-proxy/**` routes to work
 * @function
 * 
 * @returns {Object} - Contains the port and host ip address to proxy the request to
 */
export const createProxy = (config:TProxyConfig) => {
  const { host, proxyRouter, proxy } = config
  const proxyHandler = createProxyMiddleware({
    ws: true,
    xfwd: true,
    toProxy: true,
    logLevel: 'error',
    router: proxyRouter,
    onError: onProxyError,
    target: host || DEF_HOST_IP,
    onProxyReq: (proxyReq, req, res) => {
      mapRequestHeaders(proxyReq, req)
    },
    onProxyRes: (proxyRes, req, res) => {
      const origin = getOrigin(req)
      mapResponseHeaders(proxyRes, res)
      addAllowOriginHeader(proxyRes, origin)
    },
    ...proxy,
  })

  ProxyRouter.use(`*`, proxyHandler)

  return proxyHandler
}
