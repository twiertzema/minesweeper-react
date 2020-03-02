/* eslint-env node */

const plugins = require('./webpack.plugins')
const rules = require("./webpack.rules");

rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "@teamsupercell/typings-for-css-modules-loader" },
    {
      loader: "css-loader",
      options: { importLoaders: 1, modules: true, sourceMap: true }
    },
    { loader: "postcss-loader", options: { sourceMap: true } }
  ]
});
rules.push({
  test: /\.(gif|jpg|png|svg|ico)$/,
  use: ["url-loader"]
});

module.exports = {
  mode: "development",
  module: {
    rules
  },
  plugins,
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  }
};
