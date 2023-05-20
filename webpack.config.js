const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: {
    'demos/noengine/sub/engine': './src/index',
    'demos/noengine/engine': './src/index',
    './index': './src/index',
    'packages/plugin/plugin/engine': './src/index',
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
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
    }),
  ],
  mode: 'none',
};
