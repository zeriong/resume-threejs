const path = require('path')
const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer: {
            liveReload: true,
            static: {
                directory: path.resolve(__dirname, '../public')
            },
            hot: true,
            watchFiles: ['src/**/*', 'static/**/*'],
            port: 3000,
        },
    }
)
