import { TContainerInspect } from '../types'
import { DEF_HOST_IP } from '../constants/constants'


/**
 * Finds the IP Address for the route based on the containerObj, and config
 * @function
 * @public
 * @param {Object} containerInfo - JSON object instance of a container inspect returned from dockerode
 *
 * @returns {string|number} - Found port or null
 */
export const resolveIp = (containerInfo:TContainerInspect) => {
  // TODO: figure out if we can just use the containers ID
  // Docker does some internal setup with DNS, and each containers host file
  // We maybe able to use this, and make container look up easier
  const ip = containerInfo?.NetworkSettings?.IPAddress
  if(ip) return ip

  let networkName = containerInfo?.HostConfig?.NetworkMode
  if(!networkName || networkName === `default`) networkName = `bridge`

  return containerInfo?.NetworkSettings?.Networks?.[networkName]?.IPAddress || DEF_HOST_IP
}