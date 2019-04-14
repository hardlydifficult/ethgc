import "babel-polyfill";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";

import "./assets/scss/bootstrap.scss";

import App from "./App";
import AsyncComputed from "vue-async-computed";
import VTooltip from "v-tooltip";
import Clipboard from "v-clipboard";
import EthGc from "../../library/ethGc.js";
Vue.use(BootstrapVue);
Vue.use(AsyncComputed);
Vue.use(VTooltip);
Vue.use(Clipboard);

Vue.config.productionTip = false;

getWalletIfApproved();

Vue.prototype.$copy = value => {
  Vue.prototype.$clipboard(value);
  Vue.prototype.$toast.success(`copied:${value}`);
};

new Vue({
  render: h => h(App)
}).$mount("#app");

function getWalletIfApproved() {
  Vue.prototype.walletConnected = false;
  const provider = window.web3 ? window.web3.currentProvider : undefined;
  Vue.prototype.ethGc = new EthGc(provider);

  if (provider) {
    if (window.ethereum && window.ethereum._metamask) {
      return window.ethereum._metamask.isApproved().then(approved => {
        if (approved) {
          return window.ethereum.enable().then(() => {
            connectWallet();
          });
        }
      });
    }

    connectWallet();
  }
}

function connectWallet() {
  const provider = window.web3 ? window.web3.currentProvider : undefined;
  if (provider.selectedAddress) {
    console.log(`Connected to wallet ${provider.selectedAddress}`);
    Vue.prototype.walletConnected = true;
  }
}
