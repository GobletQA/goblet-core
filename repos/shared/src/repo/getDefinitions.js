const { loadDefinitions } = require('@GSH/Definitions/definitions')
const { definitionsByType } = require('@GSH/Utils/definitionsByType')

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