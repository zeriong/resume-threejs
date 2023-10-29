const path = require('path')
const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer: {
            liveReload: true,
            static: {
                directory: path.resolve(__dirname, '../public')
            },
            // hot: true,
            watchFiles: ['src/**/*'],
            port: 3000,
        },
    }
)
