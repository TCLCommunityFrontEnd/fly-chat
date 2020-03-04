/* eslint-env node */
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


const config = require('./webpack.config.js');
const webpack = require('webpack');

const plugins = [
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
        filename: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
        algorithm: 'gzip',//算法
        test: new RegExp(
            '\\.(js|css)$'    //压缩 js 与 css
        ),
        test: /\.js$|\.html$/,
        threshold: 10240,//只处理比这个值大的资源。按字节计算
        minRatio: 0.8//只有压缩率比这个值小的资源才会被处理
    }),
     //压缩js代码，webpack自带的uglifyjs处理不了es6代码，这里改用低版本的uglifyjs-webpack-plugin
     new UglifyJSPlugin({ uglifyOptions: {  } })
];

plugins.forEach(function(plugin){
    config.plugins.push(plugin);
})


config.mode = 'production';
config.optimization = {
        splitChunks:{
            chunks:'all',
            cacheGroups:{
                commons: {
					chunks: "async",
					minChunks: 5, // 开发阶段选用小值加快编译速度，生产阶段使用大值减小包大小
					maxInitialRequests: 5, // The default limit is too small to showcase the effect
					minSize: 0 // This is example is too small to create commons chunks
                },
            }
        },
        runtimeChunk: "single"
    },

module.exports = config;


