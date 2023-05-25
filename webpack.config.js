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
  resolve: {
    extensions: ['.ts', '.js'], // 添加此行以解析类型'.ts'和'.js'的文件
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
    }),
  ],
  mode: 'none',
  // mode: 'production',
};
