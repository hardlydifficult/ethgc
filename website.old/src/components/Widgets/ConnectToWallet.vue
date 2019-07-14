<template>
  <div>
    <div v-if="hasWallet">
      <button class="btn btn-primary"
              @click="connectToWallet()">
        Connect to Metamask (or ??)
      </button>
    </div>
    <div v-else>
      <h3>
        No Ethereum wallet detected
      </h3>
      <div>
        We recommend you use Metamask - it's a browser extension to manage your
        account (and supports hardware wallets if you have one).
      </div>
      <a href="https://metamask.io"
         target="_blank">
        <img src="../../assets/3rdParty/Metamask.svg">
        <div class="text-center metamaskLink">https://metamask.io</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    hasWallet() {
      return window.ethereum !== undefined
    }
  },
  methods: {
    async connectToWallet() {
      await window.ethereum.enable()
      location.reload()
    }
  }
}
</script>
<style>
.metamaskLink {
  font-size: 1.75em;
  font-weight: 100;
  position: relative;
  top: -0.75em;
}
</style>
