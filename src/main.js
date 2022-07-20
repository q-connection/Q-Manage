import Vue from 'vue'
import App from './App.vue'
import device from 'vue-device-detector'

import router from './router'
import store from './store'
import customMixins from '@/mixins'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import DefaultLayout from '@/layouts/desktop/DefaultLayout.vue'
import BlankLayout from '@/layouts/desktop/BlankLayout.vue'
import DefaultMobileLayout from '@/layouts/mobile/DefaultLayout.vue'
import BlankMobileLayout from '@/layouts/mobile/BlankLayout.vue'

Vue.config.productionTip = false
Vue.use(device)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.component('default-desktop-layout', DefaultLayout)
Vue.component('blank-desktop-layout', BlankLayout)
Vue.component('default-mobile-layout', DefaultMobileLayout)
Vue.component('blank-mobile-layout', BlankMobileLayout)

const componentContext = require.context('./components/', true, /\.vue$/i, 'lazy');
componentContext.keys().forEach((componentFilePath) => {
    const componentName = componentFilePath.split('/').pop().split('.')[0];
    Vue.component(componentName, () => componentContext(componentFilePath));
});

Vue.mixin(customMixins)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')