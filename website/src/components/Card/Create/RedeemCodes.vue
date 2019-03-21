<template>
  <div>
    <h3>Cards:</h3>
    <div class="tab">
      <div v-for="(card, index) in cards" :key="'redeem'+index" class="card">
        <div>
          Redeem Code <input type="text" v-model="cardRedeemCode" v-on:input="customCode = true" />
          <button v-on:click="randomizeCode()">New</button>
          <div class="small" v-if="customCode">
            ! Warning ! Be careful when choosing your own code. It must not be something
            someone could guess easily.
          </div>
        </div>
        <div v-if="cards.length > 1">
          <button v-on:click="removeCard(index)">Remove Card</button>
        </div>
      </div>

      <button v-on:click="addCard()">Add Card</button>
    </div>
  </div>
</template>

<script>
import Random from '../../../logic/random.js'
const random = new Random()

export default {
  data: function () {
    return {
      cards: [undefined]
    }
  },
  mounted: function () {
    if (this.cardRedeemCode) return
    this.randomizeCode()
  },
  methods: {
    addCard () {
      this.cards.push(undefined)
    },
    removeCard (index) {
      this.cards.splice(index, 1)
    },
    randomizeCode () {
      this.cardRedeemCode = random.getRandomCode(16, true)
      this.customCode = false
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
