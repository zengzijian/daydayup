const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');

var common = {
	entry: {
		index: './src/index.js'
	},
	module: {
     	rules: [
        	{
         		test: /\.css$/,
         		include: path.resolve(__dirname, "src"),
            	use: ['style-loader', 'css-loader']
        	},
        	{
				test: /\.(png|svg|jpg|gif|obj|dae)$/,
				include: path.resolve(__dirname, "src"),
				use: [
					'file-loader'
				]
		},
			{
				test: /\.(js|jsx)$/,
				use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
			}
		]
    },
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'Output Management'
		})
	],
}

var productionConfig = {
	entry: {
		vendor:[
			'three',
			'react',
			'react-dom'
		]
	},
	plugins: [
		new UglifyJSPlugin({
			// sourceMap: true
		}),
		new webpack.HashedModuleIdsPlugin() //vendor的hash变化需要修复，用于生产环境构建
	],
	optimization: {//代码分离
	    splitChunks: {
	        cacheGroups: {
	            commons: {
	                test: /[\\/]node_modules[\\/]/,
	                name: "vendor", //vendor必须早‘manifest’实例之前引入！！引入顺序很重要
	                chunks: "all"
	            }
	        }
	    }
	},
	optimization: {//代码分离
	    splitChunks: {
	        cacheGroups: {
	            commons: {
	                test: /[\\/]node_modules[\\/]/,
	                name: "manifest",
	                chunks: "all"
	            }
	        }
	    }
	},
	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	}
};

var developmentConfig = {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		hot: true,
		open: true,
		stats: 'errors-only',//在终端只显示报错的信息
		overlay: true //格式化错误提示，在浏览器端直接显示
	},
	plugins:[
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};

module.exports = mode => {

	if(mode === 'development'){
		return merge(common, developmentConfig, {mode});
	} 

	return merge(common, productionConfig, {mode});

}