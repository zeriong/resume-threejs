const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
	entry: {
		main: path.resolve(__dirname, '../src/script.js'),
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
				{ from: path.resolve(__dirname, '../src/style.css') },
			]
		}),
		// dotenv-webpack패키지를 통한 환경변수(env) 사용
		new DotEnv({ path: '.env' }),
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
};
