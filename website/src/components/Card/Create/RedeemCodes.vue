<template>
  <div>
    <div v-for="(card, index) in cards" :key="'redeem'+index">
      <div>
        Redeem Code <input type="text" v-model="cardRedeemCode" v-on:input="customCode = true" />
        <button v-on:click="randomizeCode()">New</button>
        <div class="small" v-if="customCode">
          ! Warning ! Be careful when choosing your own code. It must not be something
          someone could guess easily.
        </div>
      </div>
      <div v-if="index > 0">
        <button v-on:click="removeCard(index)">Remove Card</button>
      </div>
    </div>

    <button v-on:click="addCard()">Add Card</button>

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
