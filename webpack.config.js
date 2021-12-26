var path    = require('path');

module.exports = {
    entry:{
       'demos/pixijs/sub/engine': './src/index',
       'packages/plugin/plugin/engine': './src/index',
       'demos/webgl/libs/engine': './src/index',
       'demos/interactivedemo/sub/engine': './src/index',
       'demos/noengine/sub/engine': './src/index',
       'demos/cocoscreator/build/wechatgame/sub/engine': './src/index',
       'demos/touchbugdemo/openDataContext/engine': './src/index',
       './index': './src/index',
    },
    output:{
        path: path.resolve(__dirname, ''),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
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
            }
        ]
    },
    plugins: [
    ],
    mode: 'none',
};
