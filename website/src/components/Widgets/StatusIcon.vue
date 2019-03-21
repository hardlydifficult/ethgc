<template v-if="upperStatus">
  <span>
    <span v-tooltip="message">
      <img v-if="upperStatus==='SUCCESS'" src="../../assets/succ.png" class="icon" />
      <img v-else-if="upperStatus==='WARNING'" src="../../assets/warn.png" class="icon" />
      <img v-else-if="upperStatus==='ERROR'" src="../../assets/erro.png" class="icon" />
      <i v-else-if="upperStatus==='LOADING'" class="fas fa-spinner fa-spin"></i>
      <span v-else>{{ upperStatus }}aoeu{{upperStatus.toString()=='WARNING'}}</span>
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
.icon {
  width: 1.5em;
}
</style>
