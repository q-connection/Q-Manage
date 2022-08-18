const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: config => {
        config.optimization.splitChunks({
            ...config.optimization.get('splitChunks'),
            automaticNameDelimiter: '-'
        })
    }  
})
