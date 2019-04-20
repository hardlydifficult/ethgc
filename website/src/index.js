import "babel-polyfill";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";

import "./assets/scss/bootstrap.scss";

import App from "./App";
import AsyncComputed from "vue-async-computed";
import VTooltip from "v-tooltip";
import Clipboard from "v-clipboard";
import EthGc from "../../library/ethGc.js";
import Toasted from "vue-toasted";
import Storage from "vue-ls";
import VueCookieAcceptDecline from "vue-cookie-accept-decline";
import VueSub from "vue-sub";

Vue.use(VueSub);

const observable = new VueSub();

Vue.component("vue-cookie-accept-decline", VueCookieAcceptDecline);

const options = {
  namespace: "vuejs__", // key prefix
  name: "ls", // name variable Vue.[ls] or this.[$ls],
  storage: "local" // storage name session, local, memory
};

Vue.use(Storage, options);
Vue.use(Toasted);
Vue.use(BootstrapVue);
Vue.use(AsyncComputed);
Vue.use(VTooltip);
Vue.use(Clipboard);

// Hides the dev-mode warning message
Vue.config.productionTip = false;

getWalletIfApproved();

Vue.prototype.$copy = (value, itemDescription) => {
  Vue.prototype.$clipboard(value);
  Vue.prototype.$toasted.show(
    `<div class="text-center mt-2 mb-3">
      <div>copied</div>
      <div><span class='h6'><span class="quote">&#8220;</span>${value}<span class="quote">&#8221;</span></span></div>
      <small>${itemDescription}</small>
    </div>`,
    {
      theme: "bubble",
      position: "top-right",
      duration: 3000,
      action: {
        text: "close",
        onClick: (e, toastObject) => {
          toastObject.goAway(0);
        }
      }
    }
  );
};

new Vue({
  render: h => h(App),
  observable
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
