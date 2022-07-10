
const path = require('path')
const { fileSys } = require('@keg-hub/cli-utils')
const { getDefaultGobletConfig } = require('GobletSharedConfig')
const { deepClone, set, isArr } = require('@keg-hub/jsutils')

const { readFile, writeFile, pathExists, removeFile } = fileSys
  
const getTestMetaPath = () => {
  const config = getDefaultGobletConfig()
  return config.internalPaths.testMetaFile
}

const saveTestMeta = async (testMeta) => {
  const testMetaLoc = getTestMetaPath()
  const [err, _] = await writeFile(
    testMetaLoc,
    JSON.stringify(testMeta, null, 2)
  )
  if(err) throw err

  return testMeta
}
  
const readTestMeta = async () => {
  const testMetaLoc = getTestMetaPath()
  const [exists] = await pathExists(testMetaLoc)
  if(!exists) return {}
  
  const [err, content] = await readFile(testMetaLoc, 'utf8')
  return err ? {} : JSON.parse(content)
}

const upsertTestMeta = async (loc, data, autoInit=true) => {
  const testMeta = await readTestMeta()
  !testMeta.latest && autoInit && await initTestMeta(testMeta)
  
  const nextMeta = deepClone(testMeta)
  
  const saveLoc = isArr(loc) ? loc.join(`.`) : loc
  set(nextMeta, `latest.${saveLoc}`, data)

  return await saveTestMeta(nextMeta)
}

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
 * Removes the metadata to file
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