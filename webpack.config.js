const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpackMode = process.env.NODE_ENV || 'development';

module.exports = {
	mode: webpackMode,
	entry: {
		main: './src/main.js',
	},
	output: {
		path: path.resolve('./dist'),
		filename: '[name].min.js'
	},
	// target: ['web', 'es5'], // es5 환경 작업 시 사용
	devServer: {
		liveReload: true
	},
	optimization: {
		minimizer: webpackMode === 'production' ? [
			new TerserPlugin({
				terserOptions: {
					compress: {
						// 빌드 시 콘솔로그 drop
						drop_console: true
					}
				}
			})
		] : [],
		splitChunks: {
			chunks: 'all'
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				use: ['source-map-loader'],
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			minify: process.env.NODE_ENV === 'production' ? {
				collapseWhitespace: true,
				removeComments: true,
			} : false
		}),
		new CleanWebpackPlugin(),
		// origin 그대로 복사할 파일을 지정
		new CopyWebpackPlugin({
			// 빌드 시 dist 폴더 자동 생성(patterns 경로에 해당 파일이 없으면 에러발생)
			patterns: [
				{ from: "./src/main.css", to: "./main.css" },
				{ from: "./src/models", to: "./models" },
				{ from: "./src/font", to: "./font" },
				{ from: "./src/html.html", to: "./html.html" },
			],
		})
	]
};
