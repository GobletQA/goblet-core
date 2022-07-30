import { TImgConfig } from '../types'
import { exists, get, flatUnion } from '@keg-hub/jsutils'

/**
 * Builds runtime envs, setting envs values from the passed in data
 */
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

/**
 * Builds envs for a container in the format needed for the docker-api
 */
export const buildContainerEnvs = (image:TImgConfig, data?:Record<any,any>):string[] => {
  const imgEnvs = buildRuntimeEnvs(image, data)
  
  const envs = image?.container?.envs
    ? Object.entries(image?.container?.envs)
      .reduce((acc, [name, value]) => {
        exists(value) && acc.push(`${name}=${value}`)

        return acc
      }, [])
    : []

  return flatUnion(envs, imgEnvs)
}