/**
 * Default bable config for Keg-Herkin loaded from the root babel.config.js file
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
  plugins: [],
}
