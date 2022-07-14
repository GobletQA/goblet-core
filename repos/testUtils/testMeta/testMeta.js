const { fileSys, Logger } = require('@keg-hub/cli-utils')
const { getDefaultGobletConfig } = require('GobletSharedConfig')
const { deepMerge, deepClone, set, isArr, noOpObj } = require('@keg-hub/jsutils')

const isCIEnv = Boolean(process.env.GOBLET_RUN_FROM_CI)
const { readFile, writeFile, pathExists, removeFile } = fileSys

let __TEST_META

/**
 * Gets the location to where the testMeta file exists
 *
 * @return {string} - Path to the testMeta file
 */
 const getTestMetaPath = () => {
  if(!isCIEnv) return ``

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
  if(!isCIEnv) return noOpObj

  const testMetaLoc = getTestMetaPath()
  const savedMeta = await readTestMeta()
  __TEST_META = deepMerge(savedMeta, testMeta)

  const [err, _] = await writeFile(
    testMetaLoc,
    JSON.stringify(__TEST_META, null, 2)
  )
  if(err) throw err

  return __TEST_META
}

/**
 * Reads testMeta from file
 *
 * @return {Object} - json of the testMeta data
 */
const readTestMeta = async () => {
  if(!isCIEnv) return noOpObj

  try {
    const testMetaLoc = getTestMetaPath()
    const [errExists, exists] = await pathExists(testMetaLoc)

    if((errExists && errExists.code === 'ENOENT') || !exists) return {}

    const [err, content] = await readFile(testMetaLoc, 'utf8')

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

/**
 * Appends content to the latest test meta
 * @param {string} loc - Location where the data should be added
 * @param {*} data - Data to be saved at location
 *
 * @return {Object} - json of the testMeta data
 */
const appendToLatest = async (loc, data, commit) => {
  if(!isCIEnv) return noOpObj

  if(!__TEST_META){
    const testMeta = await readTestMeta()
    __TEST_META = !testMeta.latest
      ? { latest: { id: new Date().getTime() }, perv: {} }
      : testMeta
  }

  await upsertTestMeta(loc, data)
  return commit && await commitTestMeta()
}

/**
 * Updates the __TEST_META object with data passed in
 * @param {string} loc - Location where the data should be added
 * @param {*} data - Data to be saved at location
 *
 * @return {Object} - json of the testMeta data
 */
const upsertTestMeta = async (loc, data) => {
  if(!isCIEnv) return noOpObj

  const saveLoc = isArr(loc) ? loc.join(`.`) : loc
  set(__TEST_META, `latest.${saveLoc}`, data)

  return __TEST_META
}

/**
 * Initializes the testMeta file
 *
 * @return {Void}
 */
const initTestMeta = async () => {
  if(!isCIEnv) return noOpObj

  const testMeta = await readTestMeta()
  const id = new Date().getTime()
  const latest = { id }
  if(!testMeta.latest){
    __TEST_META = { latest, perv: {} }

    return __TEST_META
  }

  __TEST_META = deepClone(testMeta)
  __TEST_META.perv = __TEST_META.perv || {}
  __TEST_META.perv[testMeta.latest.id || id] = __TEST_META.latest
  __TEST_META.latest = latest

  return __TEST_META
}

/**
 * Saves the cached __TEST_META object
 *
 * @return {Object} - json of the testMeta data
 */
const commitTestMeta = async () => {
  return isCIEnv
    ? __TEST_META && await saveTestMeta(__TEST_META)
    : noOpObj
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
  initTestMeta,
  readTestMeta,
  removeTestMeta,
  commitTestMeta,
  upsertTestMeta,
  appendToLatest,
  getTestMetaPath,
}