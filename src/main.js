import Vue from 'vue'

import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/fragment'
import PubNubVue from 'pubnub-vue'
import '@/components'

import { publishKey, subscribeKey } from '@/constants'

Vue.use(PubNubVue, {
  subscribeKey,
  publishKey,
  ssl: true
}, store)

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
