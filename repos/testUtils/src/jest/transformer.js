const path = require('path')
const {transformSync} = require('esbuild')
const { default:createCacheKeyFunction } = require('@jest/create-cache-key-function')

const loaders = ['js', 'jsx', 'ts', 'tsx']
const nodeVersion = process.env.NODE_ENV === 'test' ? '16' : process.versions.node

module.exports = {
  getCacheKey: createCacheKeyFunction([], []),
  process: (src, file, options) => {
    const extname = path.extname(file)

    const {
      map,
      code,
    } = transformSync(src, {
      format: 'cjs',
      sourcefile: file,
      sourcemap: 'inline',
      target: `node${nodeVersion}`,
      loader: loaders.find(ext => `.${ext}` === extname)|| 'js',
    })

    return {
      map,
      code,
    }
  }
}
