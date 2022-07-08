const { loadFeatures } = require('GobletSharedFeatures/features')
const { getDefinitions } = require('GobletSharedRepo/getDefinitions')

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