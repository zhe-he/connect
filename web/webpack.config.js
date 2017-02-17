const webpack = require("webpack");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 独立样式
const fs = require('fs');
const path = require('path');

const autoprefixer = require('autoprefixer');
// const pluginsText = new Date().toUTCString() + '\n\r * built by `zhe-he`';

const ASSETS = 'www'; // 输出目录名
var commonJs = ['whatwg-fetch','babel-polyfill','js/lib/fastclick.js','js/lib/autosize.js'];

var loaders = [
	{loader: 'css-loader'},
	{
		loader: 'postcss-loader',
		options: {
			plugins: [
				autoprefixer({ browsers: ['last 9 versions'], cascade: false })
			]
		}
	}
];
module.exports = {
	// 页面入口文件配置
	entry: {
		"wifi_help": commonJs.concat(['js/page/wifi_help.js'])
	},
	// 入口文件输出配置
	output: {
		publicPath: `./${ASSETS}/`,
		path: path.resolve(__dirname, ASSETS),
		filename: 'js/[name].js' //[chunkhash]
	},
	devServer: {

	},
	// 插件项
	plugins: [
		new CommonsChunkPlugin({
			name: "common",
			minChunks: 3
		}),
		new ExtractTextPlugin('/css/[name].css'), 	// 独立样式
		new CopyWebpackPlugin([
			{from: 'images/tmp/**/*'}
		]),
	    /*new webpack.optimize.UglifyJsPlugin({
	      compressor: {
	        warnings: false
	      }
	    }),*/
	],
	module: {
		rules: [
			{test: /\.html$/,exclude:/node_modules/,use: ['pug-loader']},
			{
				test: /\.js$/,
				exclude:/(node_modules|bower_components|lib)/,
				use: [
					// jshint,代码优化时打开
					/*{
						loader: "jshint-loader", 
						options: { 
						    "freeze": true, // 禁止覆盖本地对象
							"-W041": false,    // 忽略 === 与 == 的区别
							// "loopfunc": true, // 允许循环中使用函数
							"asi": true, 	// 允许省略行尾分号
							"esversion": 6, // 支持es6语法规则
							"elision": true, // 支持[1,,,3]
							"unused": true, // 警告未使用的定义对象
							"expr": true, 	// 可以使用表达式,某些[奇淫技巧]
							"lastsemic": true // 最后的分号可以省略
							// more see -> http://www.jshint.com/docs/options/
						}
					},*/
					{
						loader:'babel-loader',
						options: {
							presets: [
								["es2015", { "modules": false }]
							]
						}
					}
				]
			},
			{test: /\.tsx?$/,exclude:/(node_modules)/,use:['ts-loader']},
			{
				test: /\.css$/,
				exclude:/node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: loaders
				})
			},
			{
				test: /\.(scss|sass)$/,
				exclude:/node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: loaders.concat({loader: 'sass-loader'})
				})
			},
			{
				test: /\.less$/,
				exclude:/node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: loaders.concat({loader: 'less-loader'})
				})
			},
			{test: /\.vue$/,exclude:/node_modules/,use: ['vue-loader']},
			{test: /\.(json|data)$/,exclude:/node_modules/,use: ['json-loader']},
			{test: /\.(txt|md)$/,exclude:/node_modules/,use: ['raw-loader']},
			{
				test: /\.(png|jpe?g|gif|ttf)$/,
				exclude:/node_modules/,
				use: [
					{
						loader:'url-loader',
						options: {
							limit: 8192,
							name: '[path][name].[ext]?[hash]'
						}
					}
				]
			}
		]
	},
	// 其他配置
	resolve: {
		modules: [
			process.cwd(),
			"node_modules"
		],
		extensions: ['.js', '.vue'],
		alias: {
			"vue": 				"js/lib/vue.common.js",
			"echarts": 			"js/lib/echarts.common.js",
			"dataFormat": 		"js/modules/dataFormat.js",
		}
	}
};