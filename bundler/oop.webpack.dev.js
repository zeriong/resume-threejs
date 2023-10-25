const path = require('path')
const { merge } = require('webpack-merge')
const commonConfiguration = require('./oop.webpack.common.js')

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        entry: {
            main: path.resolve(__dirname, '../src/script.js'),
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: '[name].min.js'
        },
        devServer: {
            liveReload: true,
            static: {
                directory: path.resolve(__dirname, '../dist')
            },
            // hot: true,
            watchFiles: ['src/**/*', 'static/**/*'],
            port: 2000,
        },
    }
)
