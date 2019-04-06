<template>
  <div>
    <div class="text-3xl mb-3">Redeem a Gift Card</div>

    <RedeemCode :card="card" v-on:cardIsValid="cardIsValid()"/>

    <div style="min-height: 3em">
      <div v-if="canRedeem" class="pt-5 pb-5">


        <button v-on:click="redeem()"
          class="pt-5 bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 border-b-4 border-blue-dark hover:border-blue rounded"
        >Redeem</button>
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
