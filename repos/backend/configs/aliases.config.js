const path = require('path')
const aliasList = require('./alias.json')
const moduleAlias = require('module-alias')
const { GBKRoot } = require('../resolveRoot')
const { deepFreeze } = require('@keg-hub/jsutils')

// aliases shared by jest and module-alias
const aliases = deepFreeze({
  // ---- General Alias ---- //
  [`@GBKRoot`]: GBKRoot,

  // Loop over each alias, and set the path relative to the root directory
  ...Object.entries(aliasList).reduce((acc, [key, location]) => {
    acc[key] = path.join(GBKRoot, location)

    return acc
  }, {}),
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
  jestAliases,
  registerAliases,
}
