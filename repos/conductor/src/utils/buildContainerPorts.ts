import { getPort, checkPort, getRandomPort, waitForPort } from 'get-port-please'
import { TImgConfig } from '../conductor.types'
import { DEF_HOST_IP } from '../constants/constants'


export const buildContainerPorts = async (image:TImgConfig) => {
  return image.container.ports.reduce(async (toResolve, port) => {
    const acc = await toResolve
    const avaliablePort = await getPort({ host: DEF_HOST_IP })

    acc[port] = [{ HostIP: DEF_HOST_IP, HostPort: avaliablePort.toString() }]

    return acc
  }, Promise.resolve({}))
}
