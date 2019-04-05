<template>
  <div>
    <div class="text-3xl text-center">
      Create a new Gift Card
    </div>

    <RedeemCodes :cards="cards" />
    <Tokens :tokens="tokens" />
    <Messages :messages="messages" />

    <button v-on:click="createCard()">Create Card</button>

    <!-- TODO add costs -->
  </div>
</template>

<script>
import Messages from './Messages'
import RedeemCodes from './RedeemCodes'
import Tokens from './Tokens'

export default {
  components: {
    Messages,
    RedeemCodes,
    Tokens
  },
  data: function () {
    return {
      cards: [{redeemCode: undefined, customCode: false}],
      tokens: [{type: 'ETH', address: 0, value: 1}],
      messages: {}
    }
  },
  methods: {
    createCard: async function () {
      const cardAddresses = []
      for (let i = 0; i < this.cards.length; i++) {
        cardAddresses.push(await this.ethjs.getCardAddress(this.cards[i].redeemCode))
      }
      const tokenAddresses = []
      const tokenValues = []
      for (let i = 0; i < this.tokens.length; i++) {
        if (this.tokens[i].type === 'ETH') {
          tokenAddresses.push(null)
        } else {
          tokenAddresses.push(this.tokens[i].address)
        }
        tokenValues.push(this.tokens[i].baseValue)
      }
      await this.ethjs.create(
        cardAddresses,
        tokenAddresses,
        tokenValues,
        this.messages.description,
        this.messages.redeemedMessage
      )
    }
  }
}
</script>
