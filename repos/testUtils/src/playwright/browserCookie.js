const os = require('os')
const path = require('path')
const { promises } = require('fs')

const defaultCookieFile = 'browser-cookie-state'

/**
 * Gets the storage location from the temp-directory
 */
const browserCookieLoc = (saveLocation) => {
  const tempDir = os.tmpdir()
  const location = `${(saveLocation || defaultCookieFile).split(`.json`).shift()}.json`

  return path.join(tempDir, location)
}

/**
 * Save storage state into the file.
 */
const saveContextCookie = async (context, location) => {
  const cookies = await context.cookies()
  const saveLoc = browserCookieLoc(location)
  await promises.writeFile(saveLoc, JSON.stringify(cookies))

  return true
}

const setContextCookie = async (context, location) => {
  const loadLoc = browserCookieLoc(location)
  // TODO: Investigate if this should throw or not
  // If instead we want to return false because the cookie could not be set
  // Then uncomment this code
  // const [err] = await limbo(promises.access(loadLoc, constants.F_OK))
  // if(err) return false

  const cookie = await promises.readFile(loadLoc, 'utf8')
  await context.addCookies(JSON.parse(cookie))
  context.__goblet.cookie = loadLoc

  return true
}

module.exports = {
  browserCookieLoc,
  setContextCookie,
  defaultCookieFile,
  saveContextCookie,
  
}
