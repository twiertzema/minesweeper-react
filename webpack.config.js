/* eslint-env node */

const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    "uploady-test": "./src/index.js"
  },
  devServer: {
    contentBase: "./public",
    compress: true,
    port: 9000
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
