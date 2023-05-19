const path = require('path');

module.exports = {
  entry: {
    './dist/index': './src/index',
  },
  output: {
    path: path.resolve(__dirname, ''),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: 'none',
};
