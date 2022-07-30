import { resolveIp } from './resolveIp'
import { inDocker } from '@keg-hub/cli-utils'
import type { Conductor } from '@gobletqa/conductor/conductor'
import { TUrls, TUrlsMap, TPortsMap, TContainerInspect } from '../types'
import { DEF_HOST_IP, API_VERSION } from '@gobletqa/conductor/constants'
const isDocker = inDocker()

const getProtocol = (port:string) => {
  return port === `443` ? `https:` : `http:`
}

/**
 * Builds a route used by the proxy to forward requests
 */
const buildRoute = (ipAddress:string, cPort:string, hPort:string|number) => {
  return {
    port: isDocker ? cPort : hPort,
    host: isDocker ? ipAddress : DEF_HOST_IP,
    // TODO: figure out a way to check if port is secure for ports
    // 443 is default, but would be better to allow it to be any port
    protocol: getProtocol(cPort)
  }
}

/**
 * Builds the external urls for accessing the container
 */
export const generateExternalUrls = (
  ports:TPortsMap,
  subdomain:string,
  conductor:Conductor
) => {
  const domain = conductor?.domain
  const sPort = conductor?.config?.server?.port

  return Object.entries(ports).reduce((acc, [cPort, hPort]:[string, string]) => {
    const protocol = getProtocol(cPort)
    acc[cPort] = `${protocol}//${cPort}.${subdomain}.${API_VERSION}.${domain}:${sPort}`

    return acc
  }, {} as TUrls)

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
  conductor:Conductor
):TUrlsMap => {
  const domain = conductor?.domain
  const port = conductor?.config?.server?.port

  // TODO: Update this to find the domain when deploy instead of the IP address
  // ipAddress should be a <app-subdomain>.<goblet-QA-domain>.run
  const ipAddress = resolveIp(containerInfo) || DEF_HOST_IP

  return Object.entries(ports).reduce((acc, [cPort, hPort]:[string, string]) => {
    const route = buildRoute(ipAddress, cPort, hPort)
    acc.map[cPort] = {
      route,
      // Build the route, that the proxy should route to => i.e. forward incoming traffic to here
      // internal: `${route.protocol}//${route.host}:${route.port}`,
      internal: isDocker
        ? `${route.protocol}//${route.host}:${route.port}`
        : `${route.protocol}//localhost:${route.port}`,
    }

    return acc
  }, {
    map: {},
    meta: {
      id: containerInfo.Id,
      name: containerInfo.Name,
    }
  } as TUrlsMap)

}

