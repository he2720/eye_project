const webpack = require('webpack')
module.exports = {
    publicPath: './',
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
    pages: {
      index: {
        //入口
        entry: 'src/main.js',
      },
    },
    lintOnSave: false,
    devServer: {
        host:'0.0.0.0',
        port:8081,
        hot:true,
        https:false,
        hotOnly:false,
        proxy: {
            '/api': {     //这里最好有一个 /
                target: 'http://10.206.32.104:8000',  // 后台接口域名
                ws: true,        //如果要代理 websockets，配置这个参数
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    }

  };

