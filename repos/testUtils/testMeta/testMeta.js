
const path = require('path')
const { fileSys } = require('@keg-hub/cli-utils')
const { getDefaultGobletConfig } = require('GobletSharedConfig')
const { deepClone, set } = require('@keg-hub/jsutils')

const { readFile, writeFile, pathExists } = fileSys
  
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

const upsertTestMeta = async (loc, data) => {
  const testMeta = await readTestMeta()
  const nextMeta = deepClone(testMeta)
  set(nextMeta, loc, data)

  return await saveTestMeta(nextMeta)
}


module.exports = {
  saveTestMeta,
  readTestMeta,
  upsertTestMeta,
  getTestMetaPath,
}