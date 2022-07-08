const path = require('path')
const { ask } = require('@keg-hub/ask-it')
const { appRoot } = require('../../paths')
const { toBool } = require('@keg-hub/jsutils')
const semverLt = require('semver/functions/lt')
const semverInc = require('semver/functions/inc')
const semverValid = require('semver/functions/valid')
const { Logger, fileSys, constants } = require('@keg-hub/cli-utils')
const packagePath = path.join(appRoot, `package.json`)
// const { SEMVER_TYPES } = constants

/**
 * TODO: Replace this to use cli-utils constants once new version is pushed
 */
const SEMVER_TYPES = [
  'major',
  'minor',
  'patch',
  'meta',
  `premajor`,
  `preminor`,
  `prepatch`,
  `prerelease`,
]


/**
 * Validates if version is one of: minor,major,patch or specific semver version
 * @function
 * @param {string} version
 * 
 * @returns {Boolean} - true if valid
 */
 const isValidSemver = async (package, version) => {
  const valid = SEMVER_TYPES.indexOf(version) !== -1
    ? true
    : semverValid(version)

  if(!toBool(valid)) throw new Error(`Invalid Semver version ${version}`)

  const verNum = semverInc(package.version, version)

  if(semverLt(verNum, package.version))
    throw new Error(`New version ${verNum} must be greater then the previous version ${package.version}!`)

  return verNum
}

/**
 * Rewrites the package.json for the passed in location
 * If a version is passed in, it update the version in the package before writing
 * @function
 * @param {Object} package - Package.json as a JS object
 * @param {string} location - Location of the repo containing the package.json file
 * @param {string} version - NEw version to update package.json to
 *
 * @returns {void}
 */
const writePackageVersion = (package, version) => {
  version && (package.version = version)
  return fileSys.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n')
}

/**
 * Loads the package.json from the goblet-root directory
 * @function
 *
 * @returns {Object} - Loaded package.json file
 */
const loadPackage = () => {
  const content = fileSys.readFileSync(packagePath)
  return JSON.parse(content)
}

const logCurrent = package => {
  Logger.yellow(`\n  ${package.name}:`)
  Logger.pair(`    * Current:`, package.version)
  Logger.empty()
}

/**
 * Updates the version in package.json with a valid semver value
 * @param {string} version - New version to update package.json to
 * @param {boolean} confirm - Should the update be confirmed
 * @param {boolean} log - Log output
 * 
 * @returns {string} - Updated version number
 */
const updateVersion = async (version, confirm, log) => {
  const package = loadPackage()

  log && logCurrent(package)

  const inputVer = version
    ? version
    : await ask.input(`Please enter the new version for ${package.name}?`)

  const updateTo = await isValidSemver(package, inputVer)

  const isConfirmed = confirm
    ? await ask.confirm(`Update ${package.name} version to ${updateTo}?`)
    : true
  
  if(!isConfirmed){
    log && Logger.info(`  User cancelled version update\n`)
    process.exit(0)
  }

  writePackageVersion(package, updateTo)
  log && Logger.success(`\n${package.name} was successfully updated to vesion "${package.version}"\n`)
  
  return updateTo
}

module.exports = {
  updateVersion
}