<template>
  <div class="jumbotron bg-gray-100 mx-auto pb-1">
    <div v-if="walletConnected" class="pb-4">
      <h3>
        Create a new Gift Card
      </h3>

      <RedeemCodes :cards="cards" />
      <Tokens :tokens="tokens" />
      <Messages :messages="messages" />

      <div @click="createCard()" class="btn btn-primary">
        Create Card
      </div>

      <!-- TODO add costs -->
    </div>
    <div v-else>
      <ConnectToWallet />
    </div>
  </div>
</template>

<script>
import Messages from "./Messages";
import RedeemCodes from "./RedeemCodes";
import Tokens from "./Tokens";
import ConnectToWallet from "../../Widgets/ConnectToWallet"

export default {
  components: {
    ConnectToWallet,
    Messages,
    RedeemCodes,
    Tokens
  },
  data: function() {
    return {
      cards: [{ redeemCode: undefined, customCode: false }],
      tokens: [{ type: "ETH", address: 0, value: 1 }],
      messages: {}
    };
  },
  methods: {
    createCard: async function() {
      const cardAddresses = [];
      for (let i = 0; i < this.cards.length; i++) {
        cardAddresses.push(
          await this.ethGc.getCardAddress(this.cards[i].redeemCode)
        );
      }
      const tokenAddresses = [];
      const tokenValues = [];
      for (let i = 0; i < this.tokens.length; i++) {
        if (this.tokens[i].type === "ETH") {
          tokenAddresses.push(null);
        } else {
          tokenAddresses.push(this.tokens[i].address);
        }
        tokenValues.push(this.tokens[i].baseValue);
      }
      await this.ethGc.create(
        cardAddresses,
        tokenAddresses,
        tokenValues,
        this.messages.description,
        this.messages.redeemedMessage
      );
    }
  }
};
</script>
