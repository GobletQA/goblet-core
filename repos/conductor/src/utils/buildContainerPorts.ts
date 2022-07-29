import { getPort } from 'get-port-please'
import { DEF_HOST_IP } from '../constants/constants'
import { TImgConfig, TCreatePortsObj } from '../types'

const findPort = async (conf:Record<any, any>, cachePorts:number[]):Promise<number> => {
  const last = cachePorts[cachePorts.length - 1]
  last && (conf.portRange = [last+1, last+3])

  const found = await getPort(conf) 
  if(!found || cachePorts.includes(found))
    return await findPort(conf, cachePorts)

  cachePorts.push(found)
  return found
}

const setPortConfig = (acc:TCreatePortsObj, port:string|number, found:string):TCreatePortsObj => {
  const portKey = `${port}/tcp`
  acc.ports[port] = found
  acc.exposed[portKey] = {}
  acc.bindings[portKey] = [{ HostPort: found }]

  return acc
}


/**
 * TODO: If running Conductor in a container, then we don't need to bind the ports to the host
 * It should have access to the spawned container because they are the same network
 * Just need to expose conductor to the host and use the IP of the spawned container for access
 * Need to investigate adding the spawned containers port as a subdomain
 * This way it can be defined and accessed externally while still using the conductor proxy
 */
export const buildContainerPorts = async (image:TImgConfig):Promise<TCreatePortsObj> => {
  let cachePorts:number[] = []
  const conf = { host: DEF_HOST_IP, random: true } as Record<any, any>
  
  const built = image?.container?.ports.reduce(async (toResolve, port) => {
    const acc = await toResolve
    const found = await findPort({ ...conf }, cachePorts)

    return setPortConfig(acc, port, found.toString())
  }, Promise.resolve({ ports: {}, exposed: {}, bindings: {} } as TCreatePortsObj))

  cachePorts = []

  return built
}
