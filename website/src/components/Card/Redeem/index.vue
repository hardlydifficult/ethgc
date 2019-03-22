<template>
  <div>
    <h3>Redeem a Gift Card</h3>

    <RedeemCodes :cards="cards" v-on:cardIsValid="cardIsValid()"/>

    <div v-if="canRedeem">
      <div>
        <button v-on:click="redeem()">Redeem</button>
      </div>
    </div>
  </div>
</template>

<script>
import RedeemCodes from './RedeemCodes'

export default {
  components: {
    RedeemCodes
  },
  data: function () {
    return {
      cards: [{redeemCode: undefined, customCode: false}],
      canRedeem: false
    }
  },
  methods: {
    cardIsValid: function (newValue) {
      for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].isValid) {
          this.canRedeem = true
          return
        }
      }
      this.canRedeem = false
    },
    redeem: async function () {
      if (!this.canRedeem) return
      const redeemableCards = []
      for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].isValid) {
          redeemableCards.push(this.cards[i])
        }
      }
      await this.ethjs.redeemCardsByCodes(redeemableCards)
    }
  }
}
</script>
