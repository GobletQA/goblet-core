const fs = require('fs')
const path = require('path')
const { noOp } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { getGobletConfig } = require('@GSH/Config')

/**
 * Clears out the temp folder that contains test artifacts
 */
const clearTestMetaDirs = () => {
  Logger.log(`Clearing temp folder...`)
  
  const { internalPaths, } = getGobletConfig()
  const tempDir = path.join(internalPaths.gobletRoot, `temp`)

  Object.entries(internalPaths)
    .map(([name, loc]) => {
      if(!loc) return

      try {
        if(name === `testMetaFile`) return fs.unlinkSync(loc, noOp)

        name.endsWith(`TempDir`) &&
          loc.startsWith(tempDir) &&
          fs.rm(loc, { recursive: true }, noOp)
      }
      catch(err){
        Logger.log(`Error cleaning temp dir, skipping!`)
      }

    })
}


module.exports = {
  clearTestMetaDirs
}