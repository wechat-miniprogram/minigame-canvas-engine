const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: {
    [path.join('..', 'demos', 'noengine', 'sub', 'engine')]: path.join('..', 'src', 'index'),
    [path.join('..', 'demos', 'noengine', 'engine')]: path.join('..', 'src', 'index'),
    [path.join('..', 'dist', 'index')]: path.join('..', 'src', 'index'),
    [path.join('..', 'packages', 'plugin', 'plugin', 'engine')]: path.join('..', 'src', 'index'),
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
  mode: 'development',
  devtool: 'inline-source-map',
};
