const fs = require('fs')
const { Logger } = require('@keg-hub/cli-utils')
const { definitionRequire } = require('./definitionRequire')
const { requireOverride, parkinCheck } = require('./parkinOverride')
const { buildFileModel } = require('HerkinSharedUtils/buildFileModel')

class DefinitionsParser {
  clear = (repo) => {
    repo.parkin.steps.clear()
  }

  /**
   * Loads and parses a step definition and based on the passed in filePath
   * Then creates a fileModel from it's content
   * @param {string} filePath - Path to the step definition file
   * @param {Object} repo - Repo Class instance for the currently active repo
   *
   * @returns {Array} - Loaded Definition file model
   */
  getDefinitions = async (filePath, repo, overrideParkin) => {
    try {

      const { fileModel } = await this.parseDefinition(filePath, repo, overrideParkin)

      // The definitions get auto-loaded into the parkin instance
      // from the require call in the parseDefinition method below
      const definitions = repo.parkin.steps.list()

      definitions.map(def => {
        // If the file model contains the step def
        // And it's a valid match string
        // Then add the def to the fileModels ast.definitions array
        fileModel.content.includes(def.match.toString()) &&
          this.validateMatch(def.match, def.type) &&
          fileModel.ast.definitions.push({
            ...def,
            // Add a reference back to the parent
            location: filePath,
          })
      })

      return fileModel
    }
    catch(err){
      // TODO: @lance-tipton - temporary fix to catch errors in definition parsing
      // Should be a better way to handel these so we can notify the user of the issues
      Logger.warn(`[Parse Definition Error] File path => ${filePath}`)
      Logger.error(err)
      return false
    }
  }

  parseDefinition = (filePath, repo, overrideMethod) => {
    return new Promise((res, rej) => {
      let requireError
      const requireReset = overrideMethod && requireOverride(parkinCheck, overrideMethod)

      try {
        // Always clear out the node require cache
        // This ensure we get a fresh file every time
        // Otherwise changed files would not get reloaded
        delete require.cache[filePath]

        // TODO: update this to use the safe require
        // Also ensure the correct parkin instance is resolved
        // definitionRequire(filePath)

        // Require the file, to auto-load the definitions into parkin
        // Later we'll pull them from parkin
        require(filePath)
      }
      catch (err) {
        Logger.warn(`[Parse Definition Error] Could not load step definition => ${filePath}`)
        Logger.error(err.stack)
        Logger.empty()
        requireError = err.message 
      }
      finally {
        requireReset && requireReset()
      }

      // Read the file to get it's content and build the fileModel
      fs.readFile(filePath, async (err, content) => {
        if (err) return rej(err)

        const fileModel = await buildFileModel(
          {
            location: filePath,
            error: requireError,
            content: content.toString(),
            fileType: 'definition',
            ast: { definitions: [] },
          },
          repo
        )

        return res({ fileModel })
      })
    })
  }

  validateMatch = (match, type) => {
    if (!match)
      return console.warn(
        `Found a ${type} definition that contains an empty match in the definition definition files!`
      )

    return match
  }
}

const definitionsParser = new DefinitionsParser()

module.exports = {
  DefinitionsParser: definitionsParser,
}
