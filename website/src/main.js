// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import AsyncComputed from 'vue-async-computed'
import VTooltip from 'v-tooltip'
import Clipboard from 'v-clipboard'
import Ethjs from '../../library/ethgc.js'
Vue.use(AsyncComputed)
Vue.use(VTooltip)
Vue.use(Clipboard)
// to assist with any data manipulation [global usage]
window._ = require('lodash')

Vue.config.productionTip = false

Vue.prototype.ethjs = new Ethjs(window.web3.currentProvider, window.web3.defaultAccount)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
