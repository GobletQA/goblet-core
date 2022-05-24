const fs = require('fs')
const { parkin } = require('HerkinParkin/instance')
const { buildFileModel } = require('HerkinSharedUtils/buildFileModel')

class DefinitionsParser {
  clear = () => {
    parkin.steps.clear()
  }

  /**
   * Loads and parses a step definition and based on the passed in filePath
   * Then creates a fileModel from it's content
   * @param {string} filePath - Path to the step definition file
   * @param {Object} repo - Repo Class instance for the currently active repo
   *
   * @returns {Array} - Loaded Definition file model
   */
  getDefinitions = async (filePath, repo) => {
    const { fileModel } = await this.parseDefinition(filePath, repo)

    // The definitions get auto-loaded into the parkin instance
    // from the require call in the parseDefinition method below
    const definitions = parkin.steps.list()

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

  parseDefinition = (filePath, repo) => {
    return new Promise((res, rej) => {
      // We still want to load the file content
      // Even if the require call fails
      // So wrap if in a try catch, and log the error if it happends
      let response
      try {
        // Always clear out the node require cache
        // This ensure we get a fresh file every time
        // Otherwise changed files would not get reloaded
        delete require.cache[filePath]

        // Require the file, to auto-load the definitions into parkin
        // Later we'll pull them from parkin
        response = require(filePath)
      } catch (err) {
        console.log(`Could not load step definition file ${filePath}`)
        console.log('')
        console.error(err.message)
      }

      // Read the file to get it's content and build the fileModel
      fs.readFile(filePath, async (err, content) => {
        if (err) return rej(err)

        const fileModel = await buildFileModel(
          {
            location: filePath,
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
