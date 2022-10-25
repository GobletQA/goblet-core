
import { findConfig } from '../utils/getGobletConfig'

export type TParentModuleFilter = {
  skip?: string[]
  startsWith?: string[]
  endsWith?: string[]
}

const defFilter:TParentModuleFilter = {
  skip: [],
  endsWith: [],
  startsWith: [],
}

let FoundConfig:Record<string, string>

const findParent = (mod:any, filter:TParentModuleFilter) => {
  const parentFilePath = mod.filename

  if(typeof parentFilePath !== 'string')
    return findParent(mod.parent, filter)

  if(filter?.startsWith.find(item => parentFilePath.startsWith(item)))
    return findParent(mod.parent, filter)

  if(filter?.endsWith.find(item => parentFilePath.endsWith(item)))
    return findParent(mod.parent, filter)

  if (filter?.skip.includes(parentFilePath) || parentFilePath === 'module.js' || parentFilePath.startsWith(`node:`))
    return findParent(mod.parent, filter)
  
  return parentFilePath
}

export const configFromParent = (mod:any, filter:TParentModuleFilter=defFilter) => {
  //@ts-ignore
  if(FoundConfig) return FoundConfig
  
  const found = findParent(mod, {
    ...defFilter,
    ...filter
  })

  const [ start, end ] = found.split(`/current/`)
  const baseDir = `${start}/current`

  const config = findConfig(baseDir)
  FoundConfig = config
    ? { ...config, __VALID_GOBLET_CONFIG: true }
    : undefined

  return FoundConfig
}