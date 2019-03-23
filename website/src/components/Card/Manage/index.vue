<template>
  <div>
    <h2>My Cards</h2>
    {{ myCards }}
  </div>
</template>
<script>
export default {
  asyncComputed: {
    myCards: async function () {
      return this.ethjs.getCardsICreated()
    }
  }
}
</script>
