import { generateUrls } from './generateUrls'
import type { Conductor } from '../conductor'
import { TContainerInspect, TPortsMap } from '../types'
import { CONDUCTOR_SUBDOMAIN_LABEL } from '../constants'

type TPort = {
  HostIp:string
  HostPort:string
}
type TPorts = {
  [key:string]: TPort[]
}

const buildPorts = (ports:TPorts):TPortsMap => {
  return Object.entries(ports).reduce((acc, [cPortProto, hostData]) => {
    const cPort = cPortProto.split(`/`).shift()
    const hPort = (hostData.shift() || {})?.HostPort
    cPort && hPort && (acc[cPort] = hPort)

    return acc
  }, {})
}

export const routesFromContainer = (conductor:Conductor, container:TContainerInspect) => {
  const subdomain = container.Config.Labels[CONDUCTOR_SUBDOMAIN_LABEL]
  if(!subdomain) return

  const { map } = generateUrls(
    container,
    buildPorts(container.NetworkSettings.Ports),
    conductor
  )

  conductor.routes[subdomain] = map
}

export const hydrateRoutes = (
  conductor:Conductor,
  containers:Record<string, TContainerInspect>
) => {
  return Promise.all(
    Object.entries(containers)
      .map(([key, container]) => routesFromContainer(conductor, container))
  )
}
