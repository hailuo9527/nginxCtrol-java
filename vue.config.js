const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin')
// 配置文件

const TEST_URL = process.env.NODE_ENV === 'production'
    ? '/'
    : '/'
const BASE_URL = process.env.NODE_ENV === 'production'
    ? '//nc.naccenter.cn/ng/'
    : '/'



module.exports = {
    //baseUrl: '/ng/',
    publicPath: TEST_URL,
    pluginOptions: {
        dll: {
           entry: ['vue', 'axios','vue-router', 'view-design','vuex','v-charts','echarts']
        },
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, './src/assets/varibles.less')]
        }
    },
    /*chainWebpack: config => {
       /!* config
            .plugin('webpack-bundle-analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            .delete('prefetch')*!/
    },*/
    configureWebpack: config => {
      if (process.env.NODE_ENV === 'production'){
          return {
              plugins: [new CompressionPlugin({
                  test: /\.js$|\.html$|\.css/,
                  threshold: 10240, // 超过10kb压缩
                  deleteOriginalAssets: false // 是否删除原文件
              })]
          }
      }
    },
    productionSourceMap: false,
    devServer: {
        open: true,
        proxy: {
            '/api' : {
                target: 'http://192.168.1.169:8085',
                // target: 'http://192.168.1.105:8085',
                // target: 'https://nc.naccenter.cn:8085',
                //ws: true,        //如果要代理 websockets，配置这个参数
                //secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
                pathRewrite:{
                    '^/api':''
                }
            }
        },
        hot: true,
    },
    filenameHashing: true,
    // css的处理
    css: {
        // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
        sourceMap: true,
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译


};
