const path = require('path')
const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
            watchFiles: ['src/**/*', 'static/**/*'],
            port: 3000,
        },
        plugins: [
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
