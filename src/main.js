import Vue from 'vue'
import App from './App.vue'
import device from 'vue-device-detector'

import router from './router'
import store from './store'
import customMixins from '@/mixins'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import progressBar from 'vue-progressbar'

import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';
import { Icon } from '@iconify/vue2';
import vSelect from 'vue-select'
import VueViewer from 'v-viewer'

Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
});
  
// with typescript
for (let [rule, validation] of Object.entries(rules)) {
    extend(rule, {
        ...validation,
        message: messages[rule]
    });
}

import DefaultLayout from '@/layouts/desktop/DefaultLayout.vue'
import BlankLayout from '@/layouts/desktop/BlankLayout.vue'
import DefaultMobileLayout from '@/layouts/mobile/DefaultLayout.vue'
import BlankMobileLayout from '@/layouts/mobile/BlankLayout.vue'
import VueBootstrap4Table from '@/modules/vue-bootstrap4-table'

Vue.config.productionTip = false
Vue.use(device)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(progressBar, {
    color: 'var(--success)',
    failedColor: 'var(--danger)',
    thickness: '2.5px',
    transition: {
      speed: '0.2s',
      opacity: '0.6s',
      termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
})
Vue.use(VueViewer)

Vue.component('default-desktop-layout', DefaultLayout)
Vue.component('blank-desktop-layout', BlankLayout)
Vue.component('default-mobile-layout', DefaultMobileLayout)
Vue.component('blank-mobile-layout', BlankMobileLayout)
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('QIcon', Icon);
Vue.component('b-select2', vSelect)
Vue.component('QTable', VueBootstrap4Table)

const componentContext = require.context('./components/', true, /\.vue$/i, 'lazy');
componentContext.keys().forEach((componentFilePath) => {
    const componentName = componentFilePath.split('/').pop().split('.')[0];
    Vue.component(componentName, () => componentContext(componentFilePath));
});

Vue.mixin(customMixins)

export default new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')