const path = require("path");

module.exports = {
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    }
  },
  title: "Blacbox React Components Library",
  styleguideDir: "dist-docs",
  moduleAliases: {
    "blackbox-react": path.resolve(__dirname, "src")
  }
};