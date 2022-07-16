const path = require('path')
const aliasList = require('./alias.json')
const moduleAlias = require('module-alias')
const { SUB_REPOS } = require('./paths.config')
const { GobletRoot } = require('../gobletRoot')
const { fileSys } = require('@keg-hub/cli-utils')
const { deepFreeze } = require('@keg-hub/jsutils')
const { requireFile } = fileSys

/**
 * Helper to loop over some aliases and append the root path to them 
 */
const addAliasRoot = (rootPath, aliases={}) => {
  return Object.entries(aliases)
    .reduce((acc, [key, location]) => {
      acc[key] = path.join(rootPath, location)

      return acc
    }, {})
}

/**
  * Loop over the sub repos locations, and set the path relative to the root directory
  * Find the alias.json or tsconfig.json file
 */
const repoAliases = () => {
  return Object.entries(SUB_REPOS)
    .reduce((acc, [_, location]) => {
      // Try to load from the alias.json first
      let { data } = requireFile(location, `configs/alias.json`)

      // If no data is returned, then try to load paths from tsconfig.json
      if(!data){
        const { paths } = requireFile(location, `tsconfig.json`)
        data = Object.entries(paths)
          .reduce((locs, [alias, arr]) => {
            locs[alias] = arr[0]
            return locs
          }, {})
      }

      return data ? { ...acc, ...addAliasRoot(location, data), } : acc
    }, {})
}

// aliases shared by jest and module-alias
const aliases = deepFreeze({
  // ---- General Alias ---- //
  GobletRoot,
  // Loop over the root alias list, and set the path relative to the root directory
  ...addAliasRoot(GobletRoot, aliasList),
  // Loop over the sub repos locations, and set the path relative to the root directory
  // Find the alias.json or tsconfig.json file
  ...repoAliases()
})

// Registers module-alias aliases (done programatically so we can reuse the aliases object for jest)
const registerAliases = () => moduleAlias.addAliases(aliases)

/**
 * Jest is not compatible with module-alias b/c it uses its own require function,
 * and it requires some slight changes to the format of each key and value.
 * `jestAliases` can be set as value of any jest config's `moduleNameMapper` property
 */
const jestAliases = deepFreeze(
  Object.keys(aliases).reduce((aliasMap, key) => {
    const formattedKey = key + '(.*)'
    aliasMap[formattedKey] = aliases[key] + '$1'
    return aliasMap
  }, {})
)

module.exports = {
  aliases,
  registerAliases,
  jestAliases,
}
