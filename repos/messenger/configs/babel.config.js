module.exports = {
  presets: [
    ["@babel/preset-env", {
      useBuiltIns: "usage",
      debug: true,
      corejs: 3
    }]
  ],
  plugins: [
    ["@babel/plugin-syntax-dynamic-import"],
    ["@babel/plugin-proposal-optional-chaining"],
    ["@babel/plugin-proposal-class-properties"],
  ]
}