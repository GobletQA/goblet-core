const { loadDefinitions } = require('GobletSharedDefinitions/definitions')
const { definitionsByType } = require('GobletSharedUtils/definitionsByType')

const getDefinitions = async (repo, config) => {
  const definitions = await loadDefinitions(repo, config)
  const definitionTypes = definitionsByType(definitions)

  return {
    definitions,
    definitionTypes
  }
}

module.exports = {
  getDefinitions
}