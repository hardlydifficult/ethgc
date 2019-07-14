<template>
  <div class="jumbotron bg-gray-100 mx-auto pb-1">
    <div v-if="walletConnected">
      <h3>My Cards</h3>
      {{ myCards }}
    </div>
    <div v-else>
      <ConnectToWallet />
    </div>
  </div>
</template>
<script>
import ConnectToWallet from '../../Widgets/ConnectToWallet'

export default {
  components: {
    ConnectToWallet
  },
  asyncComputed: {
    myCards: async function() {
      if (!this.walletConnected) return undefined
      return this.ethGc.getCardsICreated()
    }
  }
}
</script>
