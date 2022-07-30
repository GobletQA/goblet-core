import { buildImgUri } from './buildImgUri'
import type { Docker } from '../controller/docker'
import { ContainerCreateOptions } from 'dockerode'
import { buildContainerEnvs } from './buildContainerEnvs'
import { buildContainerLabels } from './buildContainerLabels'
import { TCreatePortsObj, TImgConfig, TRunOpts, TPortsMap } from '../types'

export type TCreateContResp = {
  ports: TPortsMap
  config: ContainerCreateOptions
}

export const buildContainerConfig = async (
  docker:Docker,
  image:TImgConfig,
  subdomain:string,
  runOpts:TRunOpts,
  portData:TCreatePortsObj
):Promise<ContainerCreateOptions> => {

  const { ports, exposed, bindings } = portData

  return {
    // TODO: figure out the best way to name the containers to avoid collisions
    // Doing it this way will fail if the user tries to create more then one image of the same type
    // name: subdomain,

    // TODO: investigate createContainer options that should be allowed form a request
    ...runOpts,
    ExposedPorts: exposed,
    Image: buildImgUri(image),
    Labels: buildContainerLabels(image, subdomain),
    Env: buildContainerEnvs(image, {
        ports,
        subdomain,
        options:runOpts,
        config: docker.config,
        conductor: docker.conductor,
    }),
    HostConfig: {
      RestartPolicy: { Name: `on-failure`, MaximumRetryCount: 2 },
      ...runOpts.hostConfig,
      PortBindings: bindings,
      PidsLimit: image?.pidsLimit || docker?.config?.pidsLimit,
      // TODO: investigate this
      // IpcMode: 'none',
      // AutoRemove: true,
      // StorageOpt: { size: `10G`},
    }
  }

}