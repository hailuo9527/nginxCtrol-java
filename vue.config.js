const path = require('path');
// 配置文件

const TEST_URL = process.env.NODE_ENV === 'production'
    ? 'http://wingsbro.mynetgear.com:8081'
    : '/'
const BASE_URL = process.env.NODE_ENV === 'production'
    ? '//nc.naccenter.cn/ng/'
    : '/'
module.exports = {
    //baseUrl: '/ng/',
    publicPath: BASE_URL,
    pluginOptions: {
       /* dll: {
           entry: ['vue', 'axios','vue-router', 'view-design','vuex']
           /!* entry: {
                vue: ['vue'],
                axios: ['axios'],
                vueRouter: ['vue-router'],
                viewDesign: ['view-design'],
                vuex: ['vuex']

            }*!/
        },*/
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, './src/assets/varibles.less')]
        }
    },
    /*chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config
                .plugin('uglify')
                .tap(([options]) =>{
                    // 去除 console.log
                    return [Object.assign(options, {
                        uglifyOptions: { compress: {
                                drop_console : true,
                                pure_funcs: ['console.log']
                            }}
                    })]
                })
        }
    },*/
    /*chainWebpack: config => {
       /!* config
            .plugin('webpack-bundle-analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            .delete('prefetch')*!/
    },*/
    productionSourceMap: false,
    devServer: {
        open: true,
        proxy: {
            '/api' : {
                //  target: 'http://192.168.1.112:8085',
                target: 'https://nc.naccenter.cn:8085',
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
