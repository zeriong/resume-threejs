const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: {
		main: path.resolve(__dirname, '../src/main.js'),
	},
	output: {
		path: path.resolve(__dirname, '../public'),
		filename: '[name].min.js'
	},
	// target: ['web', 'es5'], // es5 환경 작업 시 사용
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
			},
			{
				test: /\.s?css$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(glb|gltf)$/,
				use: ['file-loader']
			},
		]
	},
};
