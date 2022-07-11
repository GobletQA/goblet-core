const { fileSys, Logger } = require('@keg-hub/cli-utils')
const { getDefaultGobletConfig } = require('GobletSharedConfig')
const { deepClone, set, isArr } = require('@keg-hub/jsutils')
const { readFile, writeFile, pathExists, removeFile } = fileSys

/**
 * Gets the location to where the testMeta file exists
 *
 * @return {string} - Path to the testMeta file
 */
 const getTestMetaPath = () => {
  const config = getDefaultGobletConfig()
  return config.internalPaths.testMetaFile
}

/**
 * Saves testMeta to file
 * @param {Object} testMeta - TestMeta data object to be saved
 *
 * @return {Object} - Passed in testMeta data object
 */
const saveTestMeta = async (testMeta) => {
  const testMetaLoc = getTestMetaPath()
  const [err, _] = await writeFile(
    testMetaLoc,
    JSON.stringify(testMeta, null, 2)
  )
  if(err) throw err

  return testMeta
}

/**
 * Reads testMeta from file
 *
 * @return {Object} - json of the testMeta data
 */
const readTestMeta = async () => {
  const testMetaLoc = getTestMetaPath()
  const [errExists, exists] = await pathExists(testMetaLoc)  

  if((errExists && errExists.code === 'ENOENT') || !exists) return {}
  
  const [err, content] = await readFile(testMetaLoc, 'utf8')
  try {
    if(err) throw err
    return JSON.parse(content)
  }
  catch(readErr){
    if(readErr.code === 'ENOENT') return {}

    Logger.error(`Error reading Test Meta data. Reverting to empty object`)
    console.error(readErr)
    console.log(`Test Meta Content`, content)

    return {}
  }
}

const upsertTestMeta = async (loc, data) => {
  const testMeta = await readTestMeta()  
  const nextMeta = deepClone(testMeta)
  
  const saveLoc = isArr(loc) ? loc.join(`.`) : loc
  set(nextMeta, `latest.${saveLoc}`, data)

  return await saveTestMeta(nextMeta)
}

/**
 * Initializes the testMeta file
 *
 * @return {Void}
 */
const initTestMeta = async (testMeta) => {
  testMeta = testMeta || await readTestMeta()
  const latest = { id: new Date().getTime() }
  if(!testMeta.latest) return saveTestMeta({ latest, perv: {} })

  const nextMeta = deepClone(testMeta)
  nextMeta.perv = nextMeta.perv || {}
  nextMeta.perv[nextMeta.latest.id] = nextMeta.latest
  nextMeta.latest = latest
  
  return await saveTestMeta(nextMeta)
}

/**
 * Removes the testMeta to file
 *
 * @return {Void}
 */
const removeTestMeta = async () => {
  const testMetaLoc = getTestMetaPath()
  return await removeFile(testMetaLoc)
}


module.exports = {
  saveTestMeta,
  initTestMeta,
  readTestMeta,
  removeTestMeta,
  upsertTestMeta,
  getTestMetaPath,
}