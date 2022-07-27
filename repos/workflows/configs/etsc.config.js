const aliasPlugin = require('esbuild-plugin-path-alias')
const { aliases } = require('../../../configs/aliases.config')

module.exports = {
  outDir: "./dist",
  esbuild: {
    bundle: true,
    outdir: 'dist',
    minify: false,
    target: "es2015",
    plugins: [
      aliasPlugin(aliases),
    ],
  },
  assets: {
    baseDir: "src",
    outDir: "./dist",
    filePatterns: ["**/*.json"]
  },
};