<template>
  <div>
    {{ shiftedValue }}
    <span v-if="isEth">
      ether
    </span>
    <span v-else>
      {{ tokenAddress }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    tokenAddress: String,
    valueOrId: String
  },
  computed: {
    isEth: function() {
      return this.tokenAddress === "0x0000000000000000000000000000000000000000";
    },
    shiftedValue: function() {
      if (!this.isEth) return this.valueOrId;
      return this.ethjs.hardlyWeb3.fromWei(this.valueOrId, "ether");
    }
  }
};
</script>
