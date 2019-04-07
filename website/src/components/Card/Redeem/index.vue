<template>
  <div class="jumbotron text-center px-2">
    <div class="display-4">
      Redeem a Gift Card
    </div>

    <RedeemCode :card="card" @cardIsValid="cardIsValid()" />

    <div>
      <div v-if="canRedeem" class="mt-2">
        <div>
          Card contains:
          <ul class="list-group">
            <li class="list-group-item list-group-item-info">
              42 ETH
            </li>
            <li class="list-group-item list-group-item-info">
              69 SPANK
            </li>
          </ul>
        </div>
        <div class="pt-2">
          Send to:
          <div class="inputAddress input-group mx-auto">
            <input
              class="form-control"
              type="text"
              placeholder="Your ethereum address (0x...)"
            />
          </div>
        </div>
        <div class="btn btn-primary mt-4" @click="redeem()">
          Redeem
        </div>
        <div>
          <small class="text-white"
            >No fees!
            <span
              v-tooltip="
                'No transactions fees, the gas required was pre-paid by the card creator.  Simply hit the button and the transaction will be broadcasted (nothing to sign, no metamask prompt)'
              "
            >
              <i class="far fa-question-circle"></i>
            </span>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RedeemCode from "./RedeemCode";

export default {
  components: {
    RedeemCode
  },
  data: function() {
    return {
      card: { redeemCode: undefined, customCode: false },
      canRedeem: false
    };
  },
  methods: {
    cardIsValid: function(newValue) {
      if (this.card.isValid) {
        this.canRedeem = true;
        return;
      }
      this.canRedeem = false;
    },
    redeem: async function() {
      if (!this.canRedeem) return;
      await this.ethjs.redeem(this.card.redeemCode);
    }
  }
};
</script>

<style>
.jumbotron {
  padding-top: 1em;
  padding-bottom: 2em;
}
.inputAddress {
  max-width: 36em;
}
</style>
