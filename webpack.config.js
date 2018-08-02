const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');

var common = {
    module: {
        rules: [
            {
                test: /\.css$/,
                include: path.resolve(__dirname, "src"),
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif|obj|dae|sea)$/,
                include: path.resolve(__dirname, "src"),
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'day day up'
        })
    ],
    resolve:{
        extensions:[".ts", ".js"]
    }
}

var productionConfig = {
    entry: {
        editor: './src/index.ts',
        vendor:[
            'three',
            'pixi.js'
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            // sourceMap: true
        })
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
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};

var developmentConfig = {
    entry: {
        index: './src/index.ts'
    },
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
