const fs = require('fs')
const { parkin } = require('HerkinParkin/instance')
const { noOpObj } = require('@keg-hub/jsutils')

/**
 * Parses the a feature file located at the passed in featureMeta.location
 * @function
 * @private
 * @param {Object} featureMeta - Meta data about the feature file
 * @param {string} featureMeta.location - Location where feature file is located on the fileSystem
 *
 * @returns {Promise<Array<Object>>} - Parsed feature file ast joined with the featureMeta Object
 */
const featuresParser = (featureMeta = noOpObj) => {
  const { location } = featureMeta

  return new Promise((res, rej) => {
    fs.readFile(location, (err, data) => {
      if (err) return rej(err)
      const content = data.toString()
      const ast = parkin.parse.feature(content)
      return res({
        ...featureMeta,
        content,
        ast
      })
    })
  })
}

module.exports = {
  featuresParser,
}
