import { TImgConfig } from '../types'
import type { Docker } from '../controller/docker'
import { Logger } from '@gobletqa/conductor/utils/logger'
import { wait, isFunc, checkCall } from '@keg-hub/jsutils'
import { ContainerCreateOptions, Container, ContainerInspectInfo } from 'dockerode'

/**
 * Helpers to call a passed in container hook
 */
const checkCallHook = async (
  hook:(...args:any[])=>any,
  container:Container,
  inspect?:boolean
):Promise<ContainerInspectInfo> => {
  const hasHook = isFunc(hook)
  const contInspect = (hasHook || inspect) && await container.inspect()

  // Call hook with container inspect object when it exists
  hasHook && await hook(container, contInspect)

  return contInspect
}

/**
 * Helper to call beforeCreate hook, and create a container
 * Throws an error if container can not be created
 * @throws
 */
export const createContainer = async (
  controller:Docker,
  image:TImgConfig,
  containerConfig:ContainerCreateOptions
) => {
  const createConfig = await checkCall(image?.container?.beforeCreate, containerConfig) || containerConfig

  Logger.info(`Creating container from image ${image.name}`)
  const container = await controller.docker.createContainer(createConfig)

  return container
    || controller.controllerErr({ message: `Docker could not create container from image ${image.name}` })
}


/**
 * Helper to start a container after it's been created
 * Calls before and after start hooks with the container inspect object
 */
export const startContainer = async (
  image:TImgConfig,
  container:Container
):Promise<ContainerInspectInfo> => {
  // Call beforeStart hook with container inspect object
  await checkCallHook(image?.container?.beforeStart, container)
  
  // Start the created container
  Logger.info(`Starting container...`)
  await container.start()

  // Wait slightly longer for container to start.
  // Hack because sometimes the connection gets randomly reset
  await wait(200)

  Logger.success(`Container started successfully`)
  return await checkCallHook(image?.container?.afterStart, container, true)
}