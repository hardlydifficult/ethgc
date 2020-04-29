<template>
  <div>
    <div>
      <div v-for="(card, index) in cards"
           :key="index">
        <RedeemCode :cards="cards"
                    :index="index" />

        <div v-if="cards.length > 1">
          <button @click="removeCard(index)">
            Remove Card
          </button>
        </div>
      </div>

      <button @click="addCard()">
        Add Card
      </button>
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
    addCard() {
      this.cards.push({ redeemCode: undefined, customCode: false })
    },
    removeCard(index) {
      this.cards.splice(index, 1)
    }
  }
}
</script>
