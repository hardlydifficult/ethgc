<template>
  <div>
    <h2>Redeem a Gift Card</h2>

    <RedeemCode :card="card" v-on:cardIsValid="cardIsValid()"/>

    <div v-if="canRedeem">
      <div>
        <button v-on:click="redeem()">Redeem</button>
      </div>
    </div>
  </div>
</template>

<script>
import RedeemCode from './RedeemCode'

export default {
  components: {
    RedeemCode
  },
  data: function () {
    return {
      card: {redeemCode: undefined, customCode: false},
      canRedeem: false
    }
  },
  methods: {
    cardIsValid: function (newValue) {
      if (this.card.isValid) {
        this.canRedeem = true
        return
      }
      this.canRedeem = false
    },
    redeem: async function () {
      if (!this.canRedeem) return
      await this.ethjs.redeem(this.card.redeemCode)
    }
  }
}
</script>
