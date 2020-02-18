/* eslint-env node */

const path = require("path");
const webpack = require("webpack")

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: [path.resolve("./src"), "node_modules"]
  },
  module: {
    rules: [
      { test: /\.[jt]sx?$/, use: ["babel-loader"] },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {loader: "@teamsupercell/typings-for-css-modules-loader"},
          {
            loader: "css-loader",
            options: { importLoaders: 1, modules: true, sourceMap: true }
          },
          { loader: "postcss-loader", options: { sourceMap: true } }
        ]
      },
      {
        test: /\.(gif|jpg|png|svg|ico)$/,
        use: ["file-loader?name=[name].[ext]"]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ])
  ]
};
