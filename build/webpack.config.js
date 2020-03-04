const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HappyPack = require('happypack');
const TSconfigPathsPlugin= require('tsconfig-paths-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path=require('path');
const theme=require('../theme');
const APP_NAME='fly-chat';

// 生产环境
var isProd = process.env.NODE_ENV === 'production';

function pathResolve(projectPath){
    return path.resolve(__dirname,'..' ,projectPath);
}

var plugins = [
    new HtmlWebpackPlugin({
        title:APP_NAME,
        minify: {
            caseSensitive: false,             //是否大小写敏感
            collapseBooleanAttributes: true, //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled
            collapseWhitespace: true         //是否去除空格
        },
        chunks:['app', 'vendor1'],
        inject:true,
        favicon:'./public/logo192.png',
        template:'./public/index.html',
        filename:'./index.html', //结合output.path,
    }),
    // new HtmlWebpackPlugin({
    //     title:APP_NAME,
    //     minify: {
    //         caseSensitive: false,             //是否大小写敏感
    //         collapseBooleanAttributes: true, //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled
    //         collapseWhitespace: true         //是否去除空格
    //     },
    //     chunks:['login', 'vendor1'],
    //     inject:true,
    //     favicon:'./src/img/Cloud_logo.png',
    //     template:'./src/login.html',
    //     filename:'./login.html', //结合output.path,
    // }),
    new HappyPack({
        id: 'less',
        loaders: [
            'css-loader?minimize', 
            {
            loader:'less-loader',
            options:{
                javascriptEnabled:true,
                modifyVars:theme
            }
        }]
    }),
    new HappyPack({
        id: 'babel',
        loaders: ['babel-loader']
    }),
    new HappyPack({
        id: 'css',
        loaders: ['style-loader', 'css-loader?minimize']
    }),
    new HappyPack({
        id:'tsLoader',
        loaders:[
            {
                loader:'ts-loader',
                options:{
                    happyPackMode:true,//使用happypack
                    // 注意：ts-loader 文档建议使用 cache-loader，但是这实际上会由于使用硬盘写入而减缓增量构建速度。
                    transpileOnly: true,//增量构建
                    experimentalWatchApi: true,
                    getCustomTransformers:()=>({
                        before:[
                            tsImportPluginFactory({
                                libraryName:'antd',
                                libraryDirectory:'lib',
                                style:true
                            })
                        ]
                    })
                }
            }
        ]
    }),
    new CopyWebpackPlugin([
        // {from:pathResolve('src/vendor'), ignore:['fonts/*']},
        {from:'src/*.html', to:'[name].html'}
    ]),
    new webpack.ProvidePlugin({
        React:'react',
        // pinyinUtil:'pinyinUtil',
        // Img:'components/Img',
        // APP_LOGO_EN:'img/favicon_en.svg',
        // APP_LOGO_ZH:'img/favicon_zh.svg'
    }),
    new webpack.DefinePlugin({
        'APP_NAME': JSON.stringify(APP_NAME),
        'APP_EDITION': JSON.stringify('default')
    }),
    //为了重新获得类型检查，但会严重拖慢首次编译速度
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new ExtractTextPlugin({
        filename: '[name].[hash].css', //路径以及命名
        allChunks:true
    })
]

if(process.env.npm_config_report){
    plugins.push(
        new BundleAnalyzerPlugin({
            //  可以是`server`，`static`或`disabled`。
            //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
            //  在“静态”模式下，会生成带有报告的单个HTML文件。
            //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
            analyzerMode: 'server',
            //  将在“服务器”模式下使用的主机启动HTTP服务器。
            analyzerHost: '127.0.0.1',
            //  将在“服务器”模式下使用的端口启动HTTP服务器。
            analyzerPort: 8888,
            //  路径捆绑，将在`static`模式下生成的报告文件。
            //  相对于捆绑输出目录。
            reportFilename: 'report.html',
            //  模块大小默认显示在报告中。
            //  应该是`stat`，`parsed`或者`gzip`中的一个。
            //  有关更多信息，请参见“定义”一节。
            defaultSizes: 'parsed',
            //  在默认浏览器中自动打开报告
            openAnalyzer: true,
            //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
            generateStatsFile: false,
            //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
            //  相对于捆绑输出目录。
            statsFilename: 'stats.json',
            //  stats.toJson（）方法的选项。
            //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
            //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            logLevel: 'info' //日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
        }),
    )
  }

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app:['react-hot-loader/patch','./src/index'], //入口
        // login:'./src/ts/login'
    },
    output: {
        //给require.ensure用；webpack-dev-server的网站名
        publicPath:isProd ? './' : '/',
        //js的发布路径,是相对于package.json文件而言
        path: pathResolve('./dist/src'),
        //对应与entry中要打包出来分文件
        filename: isProd ? '[name].[chunkhash:8].js' : '[name].js',
        //对应于非entry中但仍需要打包出来的文件，比如按需加载require,ensure
        chunkFilename:isProd ? '[name].chunk.[chunkhash:8].js' : '[name].chunk.js'
    },
    resolve: {
        extensions: ['.js', '.less','.ts','.tsx','.json'],//在这里指定所有拓展名，否则会找不到对应模块[
        alias:{
            "@ant-design/icons/lib/dist$": pathResolve("src/icons.js")
        },
        plugins:[
            new TSconfigPathsPlugin({
                configFile:pathResolve('tsconfig.json')
            })
        ]
    },
    externals:{
        moment:'moment',
        // mockjs:'Mock',
    },
    mode: 'production',
    
    module:{
        rules:[
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,//不解析node_modules
                //这里无法结合happypack进行使用，否则无法解析antd样式,也就慢了1~2s
                // loader: 'happypack/loader?id=tsLoader',
                loader:'ts-loader',
                options:{
                    happyPackMode:true,//使用happypack
                    // 注意：ts-loader 文档建议使用 cache-loader，但是这实际上会由于使用硬盘写入而减缓增量构建速度。
                    transpileOnly: true,//增量构建
                    experimentalWatchApi: true,
                    getCustomTransformers:()=>({
                        before:[
                            tsImportPluginFactory({
                                libraryName:'antd',
                                libraryDirectory:'lib',
                                style:true
                            })
                        ]
                    })
                }
            },
            {test: /\.css$/, use:'happypack/loader?id=css'},
            {test: /\.js$/, use: 'happypack/loader?id=babel', include:pathResolve('src')},
            // { test: /\.js$/, loader: "babel-loader", include:[path.resolve(__dirname, "src")] },
            {
                test: /\.less$/,
                //这里使用happypack快2~3s
                use:ExtractTextPlugin.extract({
                    use:[
                        {
                            loader:'cache-loader',
                            options:{
                                cacheDirectory:pathResolve('.cache')
                            }
                        } ,
                        'happypack/loader?id=less'
                    ],
                    fallback:'style-loader'
                }),
                include:[pathResolve('node_modules/antd'),pathResolve('src/less')]
            },
            {
                test: /\.(otf|eot|svg|ttf|woff|woff2|png|jpe?g|gif)\??.*$/, 
                use:'url-loader?limit=100000&name=[hash:8].[ext]'
            },
            // {
            //     test: /\.(png|jpe?g|gif)(\?.*)?$/,//这里加上svg反而会处理不了svg图
            //     loader: 'url-loader',
            //     include: [pathResolve('src/img')],
            //     options: {
            //         limit: 100000,
            //         // name: utils.assetsPath('img/[name].[hash:7].[ext]')
            //     }
            // },
            //加载json，png等文件
            //安装npm install --save-dev file-loader
            // {
            //    test: /\.[(png)|(jpg)|(obj)|(json)]$/,
            //    loader: "file-loader" 
            // },
        ]
    },
    plugins: plugins
}