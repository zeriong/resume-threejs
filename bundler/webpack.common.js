const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: {
		main: path.resolve(__dirname, '../src/main.js')
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
				test: /\.css$/i,
				include: path.resolve(__dirname, '../src'),
				use: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(glb|gltf)$/,
				use: ['file-loader']
			},
		]
	},
	plugins: [
		// origin 그대로 복사할 파일을 지정
		new CopyWebpackPlugin({
			// 빌드 시 dist 폴더 자동 생성(patterns 경로에 해당 파일이 없으면 에러발생)
			patterns: [{ from: path.resolve(__dirname, '../static') }]
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../src/index.html'),
			minify: true
		}),
		new CleanWebpackPlugin(),
	]
};
