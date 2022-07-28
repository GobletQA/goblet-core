const path = require('path')
const aliasList = require('./alias.json')
const moduleAlias = require('module-alias')
const { SUB_REPOS } = require('./paths.config')
const { GobletRoot } = require('../gobletRoot')
const { fileSys } = require('@keg-hub/cli-utils')
const { deepFreeze, get } = require('@keg-hub/jsutils')
const { requireFile } = fileSys

const ignoreRepos = [
  `ADMIN_PATH`,
  `EXAMPLE_PATH`,
  `REPOS_PATH`,
  `DEVSPACE_PATH`,
  `SERVERLESS_PATH`,
  `TRACE_VIEWER_PATH`
]

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
const addRepoAliases = () => {
  return Object.entries(SUB_REPOS)
    .reduce((acc, [repoKey, location]) => {
      if(ignoreRepos.includes(repoKey)) return acc
      
      // Try to load from the alias.json first
      let { data } = requireFile(location, `configs/alias.json`)

      // If no data is returned, then try to load paths from tsconfig.json
      if(!data){
        const tsConfResp = requireFile(location, `tsconfig.json`, true)
        const paths = get(tsConfResp, `data.compilerOptions.paths`)

        paths && (
          data = Object.entries(paths)
            .reduce((locs, [alias, arr]) => {

              const first = arr[0]
              locs[alias] = first
              // If no extension, then add the start pattern
              !path.extname(first) && (locs[`${alias}/*`] = `${first}/*`)

              return locs
            }, {})
        )

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
  ...addRepoAliases()
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
