<template>
  <div>
    <small>card contains:</small>
    <ul class="list-group">
      <div v-for="(tokenAddress, index) in card.tokenAddresses" :key="index">
        <li class="list-group-item list-group-item-info">
          <Token
            :token-address="tokenAddress"
            :value-or-id="card.valueOrIds[index]"
          />
        </li>
      </div>
    </ul>
    <div v-if="messages">
      <div v-if="messages.description">
        <small>from the card creator:</small>
        <div>
          &#8220;<span class="lead">{{ messages.description }}</span
          >&#8221;
        </div>
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
