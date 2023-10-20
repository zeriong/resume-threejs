const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(
    commonConfiguration,
    {
        mode: 'production',
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            // 빌드 시 콘솔로그 drop
                            drop_console: true
                        }
                    }
                })
            ],
            splitChunks: { chunks: 'all' }
        },
        plugins: [ new CleanWebpackPlugin() ]
    }
)
