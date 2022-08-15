const path = require('path')

module.exports = {
    stories: ['../src/stories/**/*.stories.@(js|mdx)'],
    logLevel: 'debug',
    addons: [
      {name: '@storybook/addon-docs', options: {
        vueDocgenOptions: { alias: { '@': path.resolve(__dirname, '../src') }}
      }},
      '@storybook/addon-controls',
      '@storybook/addon-storysource',
      '@storybook/addon-actions',
      '@storybook/addon-interactions',
      '@storybook/addon-links',
      '@storybook/addon-viewport',
      '@storybook/addon-backgrounds',
      '@storybook/addon-a11y',
    ],
    core: {
      builder: 'webpack4',
    },
    staticDirs: ['../public'],
    webpackFinal: async (config, { configType }) => {
        config.resolve.alias = {
            '@': path.resolve(__dirname, "../src"),
            vue: 'vue/dist/vue.js'
        };
        
        // Make whatever fine-grained changes you need
        config.module.rules.push({
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          include: path.resolve(__dirname, '../'),
        });
    
        // Return the altered config
        return config;
    },    
};