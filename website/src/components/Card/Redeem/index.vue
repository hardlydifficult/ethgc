<template>
  <div class="jumbotron text-md-center px-2 mx-auto bg-light">
    <div class="pl-3 pr-3">
      <div class="display-4 pb-2">
        Redeem a Gift Card
      </div>

      <RedeemCode :card="card"
                  @cardIsValid="cardIsValid()" />

      <div v-if="canRedeem"
           class="mt-2">
        <ViewCard v-if="card.isValid"
                  :card="card" />
        <div class="pt-2">
          <div v-if="walletConnected">
            Sending to: {{ sendTo }}
            <div><small>(your connected address)</small></div>
          </div>
          <div v-else>
            Send to:
            <div class="inputAddress input-group mx-auto">
              <input
                class="form-control"
                type="text"
                placeholder="Your ethereum address (0x...)"
                :value="window.ethereum.selectedAddress">
            </div>
            or connect to Metamask
            <ConnectToWallet />
          </div>
        </div>
        <div class="btn btn-primary mt-4"
             @click="redeem()">
          Redeem
        </div>
        <div>
          <small class="text-white">No fees!
            <span
              v-tooltip="
                'No transactions fees, the gas required was pre-paid by the card creator.  Simply hit the button and the transaction will be broadcasted (i.e. nothing to sign!)'
              ">
              <i class="far fa-question-circle" />
            </span>
          </small>
        </div>
        <CreatedBy :card="card"
                   class="pt-3" />

        <div style="min-height: 1.5em">
          <div v-if="messages">
            <div v-if="messages.description">
              <div>
                &#8220;<span class="lead">{{ messages.description }}</span>&#8221;
              </div>
            </div>
            <div v-else>
              (no description)
            </div>
            <!-- <br><br>
      {{ messages.redeemedMessage }} -->
          </div>
          <div v-else>
            <!-- TODO move lower or middle alignment -->
            <StatusIcon
              :status="{ loadingMessage: 'Loading the card\'s message' }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RedeemCode from './RedeemCode'
import ViewCard from './ViewCard'
import CreatedBy from './CreatedBy'
import ConnectToWallet from '../../Widgets/ConnectToWallet'
import StatusIcon from '../../Widgets/StatusIcon'

export default {
  components: {
    ConnectToWallet,
    CreatedBy,
    RedeemCode,
    ViewCard,
    StatusIcon
  },
  data: function() {
    return {
      card:      { redeemCode: undefined, customCode: false },
      canRedeem: false
    }
  },
  computed: {
    sendTo() {
      return window.ethereum.selectedAddress
    }
  },
  asyncComputed: {
    messages: async function() {
      return this.ethGc.getCardMessages(this.card.redeemCode)
    }
  },
  methods: {
    cardIsValid: function() {
      if (this.card.isValid) {
        this.canRedeem = true
        return
      }
      this.canRedeem = false
    },
    redeem: async function() {
      if (!this.canRedeem) return
      const tx = await this.ethGc.redeem(this.card.redeemCode, this.sendTo)
      this.$observable.fire('tx', tx)
    }
  }
}
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
