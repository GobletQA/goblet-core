import { Docker } from './docker'
import { capitalize } from '@keg-hub/jsutils'
import { TControllerConfig } from '../conductor.types'

export const controllerTypes = {
  Docker
}

export const getController = (config:TControllerConfig) => {
  const Controller = controllerTypes[capitalize(config?.type)]

  return new Controller(config)
}