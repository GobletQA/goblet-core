import type { Conductor } from '../conductor'
import { buildImgUri } from '../utils/buildImgUri'
import { capitalize, deepMerge } from '@keg-hub/jsutils'
import { checkImgConfig } from '../utils/checkImgConfig'
import {
  TImgRef,
  TPullOpts,
  TImgConfig,
  TImgsConfig,
  TCreateOpts,
  TRunResponse,
  TContainerObj,
  TContainerRef,
  TContainerRoute,
  TControllerConfig,
} from '../types/conductor.types'


const throwOverrideErr = (message?:string) => {
  throw new Error(message || `Controller method must be overriden by an extending Class`)
}

export class Controller {

  images: TImgsConfig
  conductor: Conductor
  config: TControllerConfig
  containers:Record<string, TContainerObj> = {}

  constructor(conductor:Conductor, config:TControllerConfig){
    this.config = config
    this.conductor = conductor
  }

  getImg(imageRef:TImgRef): TImgConfig {
    return typeof imageRef === 'string' ? this.images[imageRef] : imageRef
  }

  /**
   * Ensures the passed in config is valid
   */
  validateImg(imageRef:TImgRef) {
    const img = this.getImg(imageRef)
   checkImgConfig(img, imageRef)
  }

  buildImgs(images:TImgsConfig){
    this.images = Object.entries(images)
      .reduce((acc, [key, img]) => {
        checkImgConfig(img, key)
        acc[key] = deepMerge(img)
        acc[key].uri = acc[key].uri || buildImgUri(acc[key])

        return acc
      }, {})
  }

  getContainer(containerRef:TContainerRef):TContainerObj {
    if(typeof containerRef === 'string')
      return this.containers[containerRef]

    return Object.values(this.containers)
      .find(cont => (
        cont === containerRef
        || cont.id === containerRef.id
      ))
  }

  pull = async (imageRef:TImgRef, pullOpts?:TPullOpts) => {
    throwOverrideErr()
    return undefined
  }

  run = async (imageRef:TImgRef, createOpts?:TCreateOpts):Promise<TRunResponse> => {
    throwOverrideErr()
    return undefined
  }

  route = async (containerRef:TContainerRef):Promise<TContainerRoute> => {
    throwOverrideErr()
    return undefined
  }

  remove = async (containerRef:TContainerRef) => {
    throwOverrideErr()
    return undefined
  }

  removeAll = async () => {
    throwOverrideErr()
    return undefined
  }

  cleanup = async () => {
    throwOverrideErr()
    return undefined
  }

  notFoundErr = (args:Record<string, string>) => {
    const {
      ref=``,
      message,
      type='container',
    } = args
    this.controllerErr({
      ...args,
      message: message || [
      `Failed removing ${type}.`,
      `${capitalize(type)} ${ref ? ref+' ' : ''} could not be found.\n`
    ].join(' ')
    })
  }

  controllerErr = (args:Record<string, string>) => {
    const {
      ref=``,
      message,
      type='container',
    } = args
    throw new Error(`[Controller Error] - ${capitalize(type)}: ${message}`)
  }

}