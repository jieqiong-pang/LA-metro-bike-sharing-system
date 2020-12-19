const path = require("path");

module.exports = {
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "./src/assets/styles/scss/import.scss")]
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: process.env.NODE_ENV === 'production' ?
    path.resolve(__dirname, '/dsci-554-projects/project-love554') //production path
    :
    '/' //development path
};