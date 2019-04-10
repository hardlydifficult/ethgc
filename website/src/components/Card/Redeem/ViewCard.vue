<template>
  <div>
    <div v-for="(tokenAddress, index) in card.tokenAddresses" :key="index">
      <Token
        :token-address="tokenAddress"
        :value-or-id="card.valueOrIds[index]"
      />
    </div>
    <div v-if="messages">
      <div v-if="messages.description">
        Description: {{ messages.description }}
      </div>
      <div v-else>
        (no description)
      </div>
      <!-- <br><br>
      {{ messages.redeemedMessage }} -->
    </div>
    <div v-else>
      <StatusIcon status-loading-message="Loading the card\'s message" />
    </div>
  </div>
</template>
<script>
import Token from "./Token";
import StatusIcon from "../../Widgets/StatusIcon";

export default {
  components: {
    Token,
    StatusIcon
  },
  props: {
    card: Object
  },
  asyncComputed: {
    messages: async function() {
      return this.ethGc.getCardMessages(this.card.redeemCode);
    }
  }
};
</script>
