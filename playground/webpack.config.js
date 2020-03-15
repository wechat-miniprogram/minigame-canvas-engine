var path    = require('path');
var webpack = require('webpack');

module.exports = {
    mode: 'none',
    entry:{
       index    : './js/index',
    },
    output:{
        path: path.resolve(__dirname, "dist"),
        filename: "index.js", // string
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
                parser: {
                    system: false
                }
            },
            {
                test: /\.css$/i,
                use: ['css-loader', 'style-loader'],
            },
        ]
    },
    plugins: [
    ]
};
