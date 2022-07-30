import { TImgConfig } from '../types'
import { exists, get } from '@keg-hub/jsutils'

export const envsFromImg = (image:TImgConfig, data?:Record<any,any>) => {
  
}

export const buildContainerEnvs = (image:TImgConfig, data?:Record<any,any>) => {
  const imgEnvs = envsFromImg(image, data)
  
  return image?.container?.envs &&
    Object.entries(image?.container?.envs)
      .reduce((acc, [name, value]) => {
        exists(value) && acc.push(`${name}=${value}`)

        return acc
      }, []) || []
}