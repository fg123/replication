const path = require('path');

module.exports = {
  entry: './client/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'client/dist'),
  },
  resolve: {
    alias: {
        path: require.resolve("path-browserify")
    },
    fallback: {
      "fs": false,
    }
  },
  watch: true,
};