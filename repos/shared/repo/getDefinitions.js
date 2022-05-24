// TODO: @lance-tipton - Move features and definitions libs in backend to shared
const { definitionsByType } = require('HerkinShared/utils')
const { loadDefinitions } = require('HerkinSharedDefinitions/definitions')

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