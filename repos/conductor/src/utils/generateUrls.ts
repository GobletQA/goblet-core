import { resolveIp } from './resolveIp'
import type { Conductor } from '../conductor'
import { inDocker } from '@keg-hub/cli-utils'
import { DEF_HOST_IP, API_VERSION } from '../constants/constants'
import { TUrlsMap, TPortsMap, TContainerInspect } from '../types'


/**
 * Builds a route used by the proxy to forward requests
 */
const buildRoute = (ipAddress:string, cPort:string, hPort:string|number) => {
  const isDocker = inDocker()
  return {
    port: isDocker ? cPort : hPort,
    host: isDocker ? ipAddress : DEF_HOST_IP,
    // TODO: figure out a way to check if port is secure for ports
    // 443 is default, but would be better to allow it to be any port
    protocol: cPort === `443` ? `https:` : `http:`
  }
}

/**
 * Loops over the possible ports and generates uris for them relative to the IP ||domain
 * @function
 * @public
 * @param {Object} containerInfo - JSON object instance of a container inspect returned from dockerode
 *
 * @returns {Object} - Generated Uris to access the container
 */
export const generateUrls = (
  containerInfo:TContainerInspect,
  ports:TPortsMap,
  subdomain: string,
  conductor:Conductor
):TUrlsMap => {
  const domain = conductor?.domain
  const port = conductor?.config?.server?.port

  // TODO: Update this to find the domain when deploy instead of the IP address
  // ipAddress should be a <app-subdomain>.<goblet-QA-domain>.run
  const ipAddress = resolveIp(containerInfo) || DEF_HOST_IP

  return Object.entries(ports).reduce((acc, [cPort, hPort]:[string, string]) => {
    const route = buildRoute(ipAddress, cPort, hPort)
    const external = `${route.protocol}//${cPort}.${subdomain}.${API_VERSION}.${domain}:${port}`
    acc.urls[cPort] = external
    acc.map[cPort] = {
      route,
      external,
      // Build the route, that the proxy should route to => i.e. forward incoming traffic to here
      // internal: `${route.protocol}//${route.host}:${route.port}`,
      internal: `${route.protocol}//localhost:${route.port}`,
    }

    return acc
  }, { map: {}, urls: {} } as TUrlsMap)

}

