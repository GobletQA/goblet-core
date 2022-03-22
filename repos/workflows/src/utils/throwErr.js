const { isStr } = require('@keg-hub/jsutils')

// Helper to throw an error when validation fails
const throwErr = error => {
  if (isStr(error)) throw new Error(error)

  throw error
}

module.exports = {
  throwErr,
}
