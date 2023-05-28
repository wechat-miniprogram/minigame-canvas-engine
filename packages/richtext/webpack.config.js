const path = require('path');

console.log(path.join('.', 'src', 'index.ts'))

module.exports = {
  entry: {
    './dist/index': './src/index',
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
  mode: 'none',
  // devtool: 'inline-source-map',
};
