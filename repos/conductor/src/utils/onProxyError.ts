import { Request, Response } from 'express' 

/**
 * Currently just returns the routes of the routes table
 * In the future we could add a dashboard, similar to traefik
 * @function
 * @private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Express next method
 * 
 * @returns {*} - Response in JSON of all routes in the RoutesTable 
 */
const dashboard = (req:Request, res:Response) => {
  // const routes = RouteTable.getRoutes()
  // res.status(200).json(Object.values(routes)) 
  res.status(200).json({ message: `Will display dashboard?` }) 
}

/**
 * Request Error response handler, called when the route to proxy to can not be found
 * @function
 * @private
 * @param {Object} res - Express response object
 * @param {string} message - Error message to respond with
 * 
 * @returns {void}
 */
const respond404 = (res:Response, message:string='Route not found in RouteTable') => {
  res && res.status && res.status(404).send(message)
}

/**
 * Called when the proxy request throws an error
 * If the hostname matches the proxyHost, then we re-route to it
 * Otherwise we response with 404
 * @function
 * @private
 * @param {Object} err - Error that was thrown while attempting to proxy
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} target - The hostname of the proxy request that failed
 * 
 * @returns {*} - Response in JSON of all routes in the RoutesTable 
 */
export const onProxyError = (err, req:Request, res:Response, proxyHost:string) => {
  return proxyHost === req.hostname
    ? dashboard(req, res)
    : respond404(res, err.message)
}
