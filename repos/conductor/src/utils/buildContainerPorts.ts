import { getPort } from 'get-port-please'
import { TImgConfig, TCreatePortsObj } from '../conductor.types'
import { DEF_HOST_IP } from '../constants/constants'

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
