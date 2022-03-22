const { envFilter } = require('../../constants')

/**
 * Removes an ENV from the currently running process
 * @param {string} key - Name of the key to removed
 * 
 * @returns {void}
 */
const removeEnv = key => {
  process.env[key] = undefined
  delete process.env[key]
}

/**
 * Loops through the current process.env Keys, and checks if they should be removed
 * Uses the envFilter constants defined in the tasks/constants folder
 * @returns {void}
 */
const filterTaskEnvs = () => {
  const {starts, contains, ends, exclude} = envFilter
  Object.keys(process.env).map(key => {
    if(exclude.includes(key)) return

    starts.map(start => key.startsWith(start) && removeEnv(key))
    contains.map(contain => key.includes(contain) && removeEnv(key))
    ends.map(ends => key.endsWith(ends) && removeEnv(key))
  })
}

module.exports = {
  filterTaskEnvs
}