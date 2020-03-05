/* eslint-env node */
const config = require('./webpack.config.js');
const webpack = require('webpack');

config.plugins.push(new webpack.NamedModulesPlugin());
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.devServer = {
  host:'0.0.0.0',
  port:3010,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  proxy:{
    "/zpl/**": {
      target: 'https://www.tct-rom.com/api/',
      // target:'http://10.92.36.16:8200/api/',
      pathRewrite: {"^/zpl" : ""},
      changeOrigin:true
    },
  }
}

config.mode = 'development';
// config.optimization = {
//   splitChunks:{
//     chunks:'all',
//     cacheGroups:{
//       commons: {
//       chunks: "async",
//       minChunks: 1, // 开发阶段选用小值加快编译速度，生产阶段使用大值减小包大小
//       maxInitialRequests: 5, // The default limit is too small to showcase the effect
//       // minSize:  // This is example is too small to create commons chunks
//       },
//     }
//   },
//   runtimeChunk: "single"
// },

module.exports = config;


