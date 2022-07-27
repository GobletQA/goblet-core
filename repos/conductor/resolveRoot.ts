import { registerAliases } from '../../configs/aliases.config'
registerAliases()

/**
 * Will be needed when the package is bundled
 * Still needs to be figured out
 * So for now just return __dirname
 */
const resolveRoot = ():string => {
  return __dirname
}

export const GCDRoot:string = resolveRoot()