import { Request } from 'express'
import { getOrigin } from '@GSH/Utils/getOrigin'

/**
 * Resolves the hostname from the req
 * Uses the hostname || headers.host || headers.origin
 * @function
 * @private
 * @param {Object} req - Express request object
 * 
 * @returns {string} - Found hostname
 */
export const resolveHostName = (req:Request, origin?:string) => {
  const host = req?.hostname || req?.headers?.host
  if(host) return host.split('.')[0]

  origin = origin || getOrigin(req)
  if(!origin) return

  const subOrigin = origin.split('.')[0]
  return subOrigin && subOrigin.split('://')[1]
}
