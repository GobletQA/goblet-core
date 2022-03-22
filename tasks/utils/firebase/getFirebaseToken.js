const { fileSys } = require('@keg-hub/cli-utils')

/**
 * Finds the firebase token from the passed in params or as an ENV
 * @function
 * @public
 * @throws
 * @param {Object} params - Options passed to the task parsed as an object
 * @param {Object} envs - Envs loaded for the current environment
 * 
 * @returns {string} - Found firebase token
 */
const getFirebaseToken = async ({ params }, envs) => {
  const token = params.token || process.env.FIREBASE_TOKEN || envs.FIREBASE_TOKEN
  if(token) return token.trim()

  const tokenFile = params.tokenFile || process.env.FIREBASE_TOKEN_FILE || envs.FIREBASE_TOKEN_FILE
  if(!tokenFile) throw new Error(`Missing firebase token env or file path, can not deploy`)

  return fileSys.readFileSync(tokenFile).trim()
}


module.exports = {
  getFirebaseToken
}