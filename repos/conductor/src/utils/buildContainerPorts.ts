import { getPort, checkPort, getRandomPort, waitForPort, GetPortInput } from 'get-port-please'
import { TImgConfig } from '../conductor.types'
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

export const buildContainerPorts = async (image:TImgConfig) => {
  let cachePorts:number[] = []
  const conf = { host: DEF_HOST_IP, random: true } as Record<any, any>
  
  const built = image?.container?.ports.reduce(async (toResolve, port) => {
    const acc = await toResolve

    const found = await findPort({ ...conf }, cachePorts)

    acc[port] = [{ HostIP: DEF_HOST_IP, HostPort: found.toString() }]

    return acc
  }, Promise.resolve({}))

  cachePorts = []

  return built
}
