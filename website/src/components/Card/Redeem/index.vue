<template>
  <div class="jumbotron text-md-center px-2 mx-auto">
    <div class="pl-3 pr-3">
      <div class="display-4 pb-2">
        Redeem a Gift Card
      </div>

      <RedeemCode :card="card" @cardIsValid="cardIsValid()" />

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
        <ViewCard v-if="card.isValid" :card="card" />
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
                'No transactions fees, the gas required was pre-paid by the card creator.  Simply hit the button and the transaction will be broadcasted (i.e. nothing to sign!)'
              "
            >
              <i class="far fa-question-circle"></i>
            </span>
          </small>
        </div>
      </div>
      <CreatedBy :card="card" />
    </div>
  </div>
</template>

<script>
import RedeemCode from "./RedeemCode";
import ViewCard from "./ViewCard";
import CreatedBy from "./CreatedBy"

export default {
  components: {
    CreatedBy,
    RedeemCode,
    ViewCard
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
      await this.ethGc.redeem(this.card.redeemCode);
    }
  }
};
</script>

<style>
.jumbotron {
  width: 90%;
  max-width: 40em;
  padding-top: 1em;
  padding-bottom: 2em;
  color: black;
}
.inputAddress {
  max-width: 36em;
}
</style>
