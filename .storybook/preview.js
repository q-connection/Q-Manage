import Vue from 'vue';
import Vuex from 'vuex';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { Icon } from '@iconify/vue2';

Vue.use(Vuex);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.component('QIcon', Icon);

import '../src/assets/sass/main.scss';

export const parameters = {
  docs: {
    inlineStories: true,
    iframeHeight: '60px',
  },
};