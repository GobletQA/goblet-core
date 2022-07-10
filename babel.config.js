/**
 * **IMPORTANT** - DON'T REMOVE!
 * This is needed for parkin to properly run tests
 * Will eventually be replaced by esbuild
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

