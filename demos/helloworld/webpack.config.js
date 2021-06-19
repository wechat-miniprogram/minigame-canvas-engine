var path    = require('path');
var webpack = require('webpack');

module.exports = {
    entry:{
       'app': './index',
    },
    output:{
        path: path.resolve(__dirname, ''),
        filename: '[name].js',
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
