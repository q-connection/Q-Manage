const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: config => {
        config.optimization.splitChunks({
            ...config.optimization.get('splitChunks'),
            automaticNameDelimiter: '-'
        })
    },
    pwa:{
        workboxPluginMode: "InjectManifest",
        workboxOptions:{
            swSrc:"./src/sw.js",
        }
    }    
})
