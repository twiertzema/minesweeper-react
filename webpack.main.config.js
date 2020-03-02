module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: require("./webpack.rules")
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".json"]
  }
};
