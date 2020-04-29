<template>
  <span>
    <span v-tooltip="`${value}<br><small>click to view on EtherScan</small>`">
      <!-- TODO address vs transaction. and testnet support -->
      <a :href="`https://etherscan.io/address/${value}`"
         target="_blank">
        <span>0x</span>{{ shortHexPrefix }}<span>...</span>{{ shortHexSuffix }}</a>
    </span>
  </span>
</template>

<script>
export default {
  props: {
    value: String
  },
  computed: {
    shortHexPrefix() {
      if (!this.value) return undefined
      return this.value.substr(2, 4)
    },
    shortHexSuffix() {
      if (!this.value) return undefined
      return this.value.substr(this.value.length - 4)
    }
  }
}
</script>
