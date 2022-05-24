const { loadFeatures } = require('HerkinSharedFeatures/features')
const { getDefinitions } = require('HerkinShared/repo/getDefinitions')

const getFeatures = async (repo, config) => {
  const {definitions, definitionTypes} = await getDefinitions(repo, config)
  const features = await loadFeatures(repo, definitionTypes)
  
  return {
    features,
    definitions,
    definitionTypes
  }
}

module.exports = {
  getFeatures
}