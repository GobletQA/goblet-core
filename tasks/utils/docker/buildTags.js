const { isStr, isArr, noPropArr } = require('@keg-hub/jsutils')

/**
 * Converts an Array or string of tags in to an array of docker tag arguments
 * @param {Array|string} tags - Tags to be converted
 * 
 * @param {Array} - Tags converted into docker format
 */
const buildTags = tags => {
  const tagsArr = isStr(tags) ? tags.split(',') : isArr(tags) ? tags : noPropArr

  return tagsArr.reduce((acc, tag) => {
    tag
      .replace(/-t /g, ' ')
      .split(' ')
      .filter(t => t.trim())
      .map(t => acc.push(`-t`, tag.trim()))

    return acc
  }, [])
}

module.exports = {
  buildTags,
}
