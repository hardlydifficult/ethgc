<template>
  <div>
    <div>
      <input v-model="token.type" type="radio" value="ETH" />ETH
      <input v-model="token.type" type="radio" value="ERC20" />Tokens (ERC-20)
      <input v-model="token.type" type="radio" value="ERC721" />NFT (ERC-721)
    </div>
    <div v-if="token.type === 'ERC20' || token.type === 'ERC721'">
      Token address: <input />
      <!-- TODO display loading, contract not found, or contract confirmed -->
      <!-- TODO display name if available -->
    </div>
    <span v-if="token.type === 'ETH' || token.type === 'ERC20'">
      Gift Amount:
      <input
        v-model="token.value"
        type="number"
        step="0.0001"
        @input="validateCardValue()"
      />
      <span v-if="token.type === 'ETH'">
        ETH
      </span>
      <span v-else>
        <!-- TODO get symbol if we can -->
        tokens
      </span>
      <!-- TODO display number of decimals if available -->
    </span>
    <span v-else> TokenId: <input v-model="token.value" type="text" /> </span>

    <span v-if="token.type !== 'ETH'">
      <button>Unlock</button>
    </span>
    <StatusIcon :status="status" />
  </div>
</template>

<script>
import StatusIcon from "../../Widgets/StatusIcon";
const BigNumber = require("bignumber.js");

export default {
  components: {
    StatusIcon
  },
  props: {
    tokens: Array,
    index: Number
  },
  data: function() {
    return {
      status: undefined,
      // eslint-disable-next-line no-undef
      bouncer: _.debounce(async () => {
        const balance = await this.ethGc.getEthBalance();
        this.$set(this.status, "loadingMessage", undefined);
        if (
          balance.gte(this.ethGc.toWei(this.token.value, "ether"))
        ) {
          this.status.status.push({
            status: "SUCCESS",
            message: "You have enough tokens in your wallet for this gift"
          });
        } else {
          this.status.status.push({
            status: "ERROR",
            message:
              "You do not have enough tokens in your wallet for this gift"
          });
        }
      }, 2000)
    };
  },
  computed: {
    token: function() {
      if (!this.tokens) return;
      return this.tokens[this.index];
    }
  },
  watch: {
    "token.address": function() {
      this.debouncedGetStatus();
    },
    "token.type": function() {
      this.debouncedGetStatus();
    },
    "token.value": function() {
      this.debouncedGetStatus();
    }
  },
  mounted: function() {
    this.debouncedGetStatus();
  },
  methods: {
    validateCardValue() {
      if (!this.token) return;
      switch (this.token.type) {
        case "ETH":
          const num = new BigNumber(this.token.value);
          if (num.isPositive()) {
            this.token.value = new BigNumber(
              num.toFixed(18, BigNumber.ROUND_FLOOR)
            ).toFixed();
          }
          break;
      }
    },
    debouncedGetStatus() {
      this.bouncer.cancel();
      this.status = { status: [] };

      if (!this.token.value) {
        this.status.status.push({
          status: "ERROR",
          message: "Please enter a value"
        });
        return;
      }
      if (this.token.type === "ETH") {
        this.token.baseValue = this.ethGc.toWei(this.token.value);
        for (let i = 0; i < this.index; i++) {
          if (
            this.tokens[i].type === this.token.type &&
            (this.tokens[i].type === "ETH" ||
              this.tokens[i].address === this.token.address)
          ) {
            this.status.status.push({
              status: "ERROR",
              message: "You already have this token selected above."
            });
            return;
          }
        }
      }

      this.$set(
        this.status,
        "loadingMessage",
        "Confirming you have the balance available in your wallet"
      );
      this.bouncer();
    }
  }
};
</script>
