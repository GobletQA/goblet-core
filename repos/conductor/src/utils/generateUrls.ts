import { resolveIp } from './resolveIp'
import { DEF_HOST_IP } from '../constants/constants'
import { TUrls, TPortsMap, TContainerInspect } from '../conductor.types'

/**
 * Loops over the possible ports and generates uris for them relative to the IP ||domain
 * @function
 * @public
 * @param {Object} containerInfo - JSON object instance of a container inspect returned from dockerode
 *
 * @returns {Object} - Generated Uris to access the container
 */
export const generateUrls = (containerInfo:TContainerInspect, ports:TPortsMap):TUrls => {
  // TODO: Update this to find the domain when deploy instead of the IP address
  // ipAddress should be a <app-subdomain>.<goblet-QA-domain>.run
  const ipAddress = resolveIp(containerInfo) || DEF_HOST_IP

  return Object.entries(ports).reduce((acc, [cPort, hPort]:[string, string]) => {
    acc[cPort] = `${ipAddress}:${hPort}`

    return acc
  }, {})

}

