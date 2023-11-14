const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

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
            // build 과정에서 환경변수 사용 가능하도록 설정
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), // 환경변수 접근 필수 지정!
                'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
                'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
                'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
                'process.env.FIREBASE_SENDER_ID': JSON.stringify(process.env.FIREBASE_SENDER_ID),
                'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
                'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID),
            })
        ]
    }
)
