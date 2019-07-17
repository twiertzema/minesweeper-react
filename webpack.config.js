/* eslint-env node */

const path = require("path");

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
          { loader: "style-loader", options: { sourceMap: true } },
          {
            loader: "css-loader",
            options: { modules: true, sourceMap: true, importLoaders: 2 }
          },
          { loader: "postcss-loader", options: { sourceMap: true } }
        ]
      },
      { test: /\.(gif|jpg|png|svg)$/, use: ["file-loader"] }
    ]
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
