const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(
    commonConfiguration,
    {
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.s?css$/,
                    use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader', 'sass-loader']
                }
            ]
        },
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
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin(),
        ]
    }
)
