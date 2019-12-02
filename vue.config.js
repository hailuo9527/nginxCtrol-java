const path = require('path');
// 配置文件
module.exports = {
    publicPath: '/',
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: [path.resolve(__dirname, './src/assets/varibles.less')]
      }
    },
    devServer: {
        open: true,
        proxy: {
            '/api' : {
                target: 'http://192.168.1.128:5051',
                //ws: true,        //如果要代理 websockets，配置这个参数
                //secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    },
    filenameHashing: true,
    // css的处理
    css: {
        // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
        // sourceMap: true,
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
};
