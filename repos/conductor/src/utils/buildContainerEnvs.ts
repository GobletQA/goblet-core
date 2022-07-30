import { TImgConfig } from '../types'
import { exists, get } from '@keg-hub/jsutils'

export const buildRuntimeEnvs = (image:TImgConfig, data?:Record<any,any>):string[] => {
  return image?.container?.runtimeEnvs
    ? Object.entries(image?.container?.runtimeEnvs)
      .reduce((acc, [name, value]) => {
        const found = get(data, value)

        exists(found) && acc.push(`${name}=${found}`)

        return acc
      }, [])
    : []
}

export const buildContainerEnvs = (image:TImgConfig, data?:Record<any,any>):string[] => {
  const imgEnvs = buildRuntimeEnvs(image, data)
  
  return image?.container?.envs
    ? Object.entries(image?.container?.envs)
      .reduce((acc, [name, value]) => {
        exists(value) && acc.push(`${name}=${value}`)

        return acc
      }, imgEnvs)
    : imgEnvs
}