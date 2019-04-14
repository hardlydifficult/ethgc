<template>
  <div class="jumbotron bg-gray-100 mx-auto">
    <h3>My Cards</h3>
    {{ myCards }}
  </div>
</template>
<script>
export default {
  asyncComputed: {
    myCards: async function() {
      return this.ethGc.getCardsICreated();
    }
  }
};
</script>
