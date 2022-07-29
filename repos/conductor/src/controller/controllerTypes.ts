import { Docker } from './docker'
import { TControllerConfig } from '../types'
import { capitalize } from '@keg-hub/jsutils'
import type { Conductor } from '../conductor/conductor'

export const controllerTypes = {
  Docker
}

export const getController = (conductor:Conductor, config:TControllerConfig) => {
  const Controller = controllerTypes[capitalize(config?.type)]

  return new Controller(conductor, config)
}