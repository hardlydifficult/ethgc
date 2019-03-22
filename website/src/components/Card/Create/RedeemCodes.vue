<template>
  <div>
    <h3>Cards:</h3>
    <div class="tab">
      <div v-for="(card, index) in cards" :key="index" class="card">
        <RedeemCode :cards="cards" :index="index" />

        <div v-if="cards.length > 1">
          <button v-on:click="removeCard(index)">Remove Card</button>
        </div>
      </div>

      <button v-on:click="addCard()">Add Card</button>
    </div>
  </div>
</template>

<script>
import RedeemCode from './RedeemCode'

export default {
  components: {
    RedeemCode
  },
  props: {
    cards: Array
  },
  methods: {
    addCard () {
      this.cards.push({redeemCode: undefined, customCode: false})
    },
    removeCard (index) {
      this.cards.splice(index, 1)
    }
  }
}
</script>

<style>
.card
{
  border:2px solid blue;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding: 0.5em;
}
</style>
