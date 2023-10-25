const path = require('path')
const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        plugins: [
            // origin 그대로 복사할 파일을 지정
            new CopyWebpackPlugin({
                // 빌드 시 dist 폴더 자동 생성(patterns 경로에 해당 파일이 없으면 에러발생)
                patterns: [
                    { from: path.resolve(__dirname, '../static') },
                    { from: path.resolve(__dirname, '../src/style.css') },
                ]
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../src/main.html'),
                filename: 'index.html',
                minify: true,
            })
        ]
    }
)
