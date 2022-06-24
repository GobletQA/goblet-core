const { safeRequire } = require('HerkinSharedUtils/safeRequire')

const allowedRequires = [
  `HerkinParkin`,
  `HerkinSupport`,
  `HerkinTestEnv`,
  `HerkinPlaywright`,
  `HerkinSCPlaywright`,
  `@ltipton/parkin`,
  `@keg-hub/jsutils`,
]

const moduleMap = allowedRequires.reduce((acc, allowed) => {
  acc[allowed] = require.resolve(allowed)
  return acc
}, {})

const gobletRequire = (repo) => {
  const { repoRoot } = repo.paths
  return (location) => {
    if(location.startsWith('/')) throw new Error(`Can not load absolute file paths`)

    if(location.startsWith('./')){
      const resolvedLoc = require.resolve(location)

      if(!resolvedLoc.startsWith(repoRoot))
        throw new Error(`Can not load files outside the repo root directory`)

      return require(resolvedLoc)
    }
    else if(!allowedRequires.filter(allowed => location.startsWith(allowed)))
      throw new Error(`Can not load module ${location}`)

    return require(moduleMap[location])
  }
}


// TODO: update to safely require definition file
const definitionRequire = (repo, definitionLoc) => {
  // Require the file, to auto-load the definitions into parkin
  // Later we'll pull them from parkin
  response = safeRequire(
    filePath,
    // TODO: define the context that step-definitions are allowed to use
    {
      But: repo.parkin.But,
      And: repo.parkin.And,
      Then: repo.parkin.Then,
      When: repo.parkin.When,
      Given: repo.parkin.Given,
      $world: repo.parkin.$world,
      process: {},
      require: gobletRequire,
      global: {
        process: {},
        require: gobletRequire,
      }
    },
    {
      // Don't allow wasm || eval, string functions to be used 
      contextCodeGeneration: {
        wasm: false,
        strings: false,
      },
      // Disable using `import()` method
      importModuleDynamically: () => {
        throw new Error(`Dynamic module imports are not supported`)
      },
    }
  )
}


module.exports = {
  definitionRequire
}