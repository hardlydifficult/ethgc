import "babel-polyfill";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";

import "./assets/scss/bootstrap.scss";

import App from "./App";
import AsyncComputed from "vue-async-computed";
import VTooltip from "v-tooltip";
import Clipboard from "v-clipboard";
import EthGc from "../../library/EthGc.js";
Vue.use(BootstrapVue);
Vue.use(AsyncComputed);
Vue.use(VTooltip);
Vue.use(Clipboard);

Vue.config.productionTip = false;

Vue.prototype.ethGc = new EthGc(
  window.web3 ? window.web3.currentProvider : undefined
);
if (window.ethereum) {
  window.ethereum.enable();
} // TODO maybe else means go get metamask

/* eslint-disable no-new */
// new Vue({
//   el: "#app",
//   components: { App },
//   template: "<App/>"
// });

new Vue({
  render: h => h(App)
}).$mount("#app");
