<template v-if="upperStatus">
  <span>
    <span v-if="overallStatus" v-tooltip="messages">
      <i v-if="overallStatus==='SUCCESS'" class="far fa-thumbs-up" />
      <i v-else-if="overallStatus==='WARNING'" class="fas fa-exclamation orange" />
      <i v-else-if="overallStatus==='ERROR'" class="fas fa-times red" />
      <i v-else-if="overallStatus==='DONE'" class="fas fa-receipt"></i>
    </span>
    <span v-if="loadingMessage" v-tooltip="loadingMessage">
      <i class="fas fa-spinner fa-spin"></i>
    </span>
  </span>
</template>

<script>
export default {
  props: {
    loadingMessage: String,
    status: Array
  },
  computed: {
    overallStatus () {
      if (!this.status || this.status.length < 1) return undefined
      let overallStatus = this.status[0].status
      for (let i = 0; i < this.status.length; i++) {
        const status = this.status[i].status
        if (overallStatus === 'ERROR' || status === 'ERROR') {
          overallStatus = 'ERROR'
        } else if (overallStatus === 'WARNING' || status === 'WARNING') {
          overallStatus = 'WARNING'
        } else if (overallStatus === 'DONE' || status === 'DONE') {
          overallStatus = 'DONE'
        } else if (overallStatus === 'SUCCESS' || status === 'SUCCESS') {
          overallStatus = 'SUCCESS'
        } else {
          throw new Error(`Invalid status ${status}`)
        }
      }
      return overallStatus
    },
    messages () {
      if (this.status.length < 1) return undefined
      let messages = ''
      for (let i = 0; i < this.status.length; i++) {
        const statusMessage = this.status[i].message
        messages += `<div>${statusMessage}</div>`
      }
      return messages
    }
  }
}
</script>
<style>
.orange {
  color: #f79862
}
.red {
  color: red
}
</style>
