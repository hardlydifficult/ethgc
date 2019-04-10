<template>
  <span>
    <span v-tooltip="`${address}<br><small>click to view on EtherScan</small>`">
      <a :href="`https://etherscan.io/address/${address}`" target="_blank">
        <span>0x</span>{{ shortAddressPrefix }}<span>...</span
        >{{ shortAddressSuffix }}</a
      >
    </span>
  </span>
</template>

<script>
export default {
  props: {
    address: String
  },
  computed: {
    shortAddressPrefix() {
      if(!this.address) return undefined
      return this.address.substr(2, 4);
    },
    shortAddressSuffix() {
      if(!this.address) return undefined
      return this.address.substr(42 - 4);
    }
  }
};
</script>
