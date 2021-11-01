import { noOpObj, deepFreeze } from '@keg-hub/jsutils'

let parkingWorld
try {
  parkingWorld = deepFreeze(JSON.parse(process.env.PARKIN_WORLD || '{}'))
}
catch(err){
  console.log(err.message)
  parkingWorld = noOpObj
}

/**
 * Loads the parkin world object from an ENV
 * process.env.PARKIN_WORLD gets set a stringified version of the world object via webpack
 * TODO: investigate loading this through API instead
 * This will allow it to be updated overtime without restarting webpack
 */
export const getParkinWorld = () => {
  return parkingWorld
}