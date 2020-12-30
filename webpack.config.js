var path    = require('path');
var webpack = require('webpack');

module.exports = {
  entry:{
    /*'demos/pixijs/sub/engine': './src/index',
       'packages/plugin/plugin/engine': './src/index',
       'demos/webgl/libs/engine': './src/index',
       'demos/interactivedemo/sub/engine': './src/index',
       'demos/cocoscreator/build/wechatgame/sub/engine': './src/index',*/
    './index': './src/core/index',
    '../minigame_plugins/minigame_profile/plugin/libs/engine': './src/core/index',
    '../minigame_plugins/minigame_profile/minigame/plugin1/libs/engine': './src/core/index',
  },
  output:{
    path: path.resolve(__dirname, ''),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json", ".wasm"]
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
      },
      {
        test: /\.(frag|vert|glsl)$/,
        use: {
          loader: 'raw-loader',
          options: {},
        },
      },
    ]
  },
  plugins: [
  ],
  mode: 'none',
  /*mode: 'production',*/
  /*mode: 'development',*/
  /*optimization: {
    usedExports: true,
  }*/
};
