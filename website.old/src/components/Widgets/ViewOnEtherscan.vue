<template>
  <StatusIcon :status="statusObject" />
</template>

<script>
import StatusIcon from '../Widgets/StatusIcon'

export default {
  components: {
    StatusIcon
  },
  props: {
    tx: Object
  },
  computed: {
    statusObject() {
      if (!this.tx) return undefined
      return {
        // TODO select the correct etherscan network
        url:        `https://etherscan.io/tx/${this.tx.hash}`,
        urlMessage: 'Click to view on EtherScan.'
      }
    }
  }
}
</script>
