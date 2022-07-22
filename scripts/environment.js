const {
  NODE_ENV,
  GOBLET_CLIENT_ID,
  GOBLET_CLIENT_ENV_PATH,
  GOBLET_CLIENT_ACCESS_ID,
} = process.env

const allowedEnvs = [
  // TODO: figure out how to pass this per client
]

const filterEnv = () => {
  return Object.entries(process.env)
    .reduce((acc, [name, value]) => {
      allowedEnvs.includes(name) && acc.push(value)
      return acc
    }, {})
}

const environment = {
  values: { ...filterEnv },
  secrets: {},
}


/**
 * Decrypts the injected client file to get give access values and secrets
 * @param {string} encrypted - Encrypted client file
 * @returns {string} - decrypted client file
 */
const decryptInjected = (encrypted) => {
  // TODO add code to decrypt 
  decrypt(encrypted, GOBLET_CLIENT_ID, GOBLET_CLIENT_ACCESS_ID)
  return encrypted
}

/**
 * Wraps importing the client environment data in a try catch
 * Will only thrown when not in a production environment
 */
try {
  const clientFileLoc = `${GOBLET_CLIENT_ENV_PATH}/${GOBLET_CLIENT_ID}`
  delete require.cache[clientFileLoc]
  const clientFile = require(clientFileLoc)

  const injected = decryptInjected(clientFile)
  environment.values = { ...filterEnv, ...injected?.values }
  environment.secrets = { ...injected?.secrets }
}
catch(err){
  if(NODE_ENV !== 'production')
    throw new Error(`Inject goblet client environment does not exist`)
}

module.exports = {
  ...environment
}