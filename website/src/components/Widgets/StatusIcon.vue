<template v-if="upperStatus">
  <span>
    <span v-tooltip="message">
      <i v-if="upperStatus==='SUCCESS'" class="far fa-thumbs-up" />
      <i v-else-if="upperStatus==='WARNING'" class="fas fa-exclamation-circle orange" />
      <i v-else-if="upperStatus==='ERROR'" class="fas fa-times red" />
      <i v-else-if="upperStatus==='LOADING'" class="fas fa-spinner fa-spin"></i>
      <span v-else>{{ upperStatus }}</span>
    </span>
  </span>
</template>

<script>
export default {
  props: {
    status: undefined,
    message: undefined
  },
  computed: {
    upperStatus () {
      if (!this.status) return
      return this.status.toUpperCase()
    }
  }
}
</script>
<style>
.orange {
  color: coral
}
.red {
  color: red
}
</style>
