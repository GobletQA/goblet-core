const vm = require('vm')
const fs = require('fs')
const path = require('path')

/**
 * Requires a file an allows setting the context and modules available to the file when required
 * This was we can ensure only allowed modules can be be used by dynamically loaded content
 * This is how step definitions are loaded, with a limited set modules available to them
 * @example
 * safeRequire('/path/to/step/definition.js', { ...context }, { ...vmOptions }, { ...allowedModules })
 */

class SafeRequireModule {
  _cacheMap = {}

  constructor(filename, context={}, options={}, moduleMap={}, isCache=false) {
    this.isCache = isCache
    this.options = options
    this.context = context
    this.filename = filename
    this.moduleMap = moduleMap
  }

  createRequireVm(filename) {
    const safeRequireModuleInstance = new SafeRequireModule(filename, this.context, Object.assign({
      ...this.options,
    }, {paths:[path.dirname(filename)]}), this.moduleMap, this.isCache)

    return request => {
      return safeRequireModuleInstance.safeRequire(request)
    }
  }

  updateContext(location) {
    if(!this.options.filename) this.options.filename = location
    if(!this.context.__dirname) this.context.__dirname = path.dirname(location)
    if(!this.context.__filename) this.context.__filename = location

    if(!this.context.module) this.context.module = {}
    if(!this.context.module.exports) this.context.module.exports = {}
    if(!this.context.module.createRequire)
      this.context.module.createRequire = this.createRequireVm

    this.context.exports = this.context.module.exports
  }

  generateScript = (location) => {
    let inlineScript = 'var require' + 
      'if(module.createRequire){'+
        'require = module.createRequire(__filename)'+
      '}'

    let script
    if(this.isCache && this._cacheMap[location]){
      inlineScript += this._cacheMap[location].code
      script = this._cacheMap[location].script
      this.options.cachedData = this._cacheMap[location].cachedData
    }
    else {
      if(!fs.existsSync(location)) throw new Error(`can't find file:${location}`)

      inlineScript += fs.readFileSync(location)
      script = new vm.Script(inlineScript, this.options)

      if(this.isCache && script.createCachedData)
        this._cacheMap[location] = {
          script,
          code: inlineScript,
          cachedData: script.createCachedData(),
        }
    }
    
    return script
  }

  safeRequire(request) {
    if(this.moduleMap[request]) return this.moduleMap[request]

    const location = require.resolve(request, {paths: this.options.paths})
    if(!path.isAbsolute(location))
      throw new Error(`can't find module<${location}>,you maybe need moduleMap params`)

    const codeScript = this.generateScript(location)
    this.updateContext(location)

    codeScript.runInNewContext(this.context, this.options)

    return this.context.module.exports
  }
}

const safeRequire = (request, context={}, options={}, moduleMap={}, isCache=false) => {
  if(!options.paths) {
    const resolvePath = []
    if(module.parent && module.parent.filename)
      resolvePath.push(path.dirname(module.parent.filename), ...module.parent.paths)

    options.paths = resolvePath
  }

  const filename = require.resolve(request, {paths: options.paths})
  const safeRequireModuleInstance = new SafeRequireModule(
    filename,
    context,
    options,
    moduleMap,
    isCache
  )

  return safeRequireModuleInstance.safeRequire(request)
}

safeRequire.default = safeRequire
safeRequire.safeRequire = safeRequire
safeRequire.SafeRequireModule = SafeRequireModule

module.exports = safeRequire