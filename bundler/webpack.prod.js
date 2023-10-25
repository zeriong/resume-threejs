const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

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
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../src/index.html'),
                filename: 'index.html',
                minify: true,
            }),
            // origin 그대로 복사할 파일을 지정
            new CopyWebpackPlugin({
                // 빌드 시 dist 폴더 자동 생성(patterns 경로에 해당 파일이 없으면 에러발생)
                patterns: [
                    { from: path.resolve(__dirname, '../static') },
                    { from: path.resolve(__dirname, '../src/main.css') },
                ]
            }),
        ]
    }
)
