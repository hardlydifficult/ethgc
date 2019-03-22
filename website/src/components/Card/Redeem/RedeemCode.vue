<template>
  <div>
    Redeem Code
    <input type="text" v-model="card.redeemCode" />
    <i class="far fa-clipboard" v-on:click="paste()" v-tooltip="'Paste'"></i>
    <StatusIcon v-if="status" :status="status.status" :message="status.message" />
    <ViewCard :card="card" v-if="card.isValid" />
  </div>
</template>

<script>
import StatusIcon from '../../Widgets/StatusIcon'
import ViewCard from './ViewCard'

export default {
  components: {
    StatusIcon,
    ViewCard
  },
  props: {
    cards: Array,
    index: Number
  },
  data: function () {
    return {
      status: undefined,
      // eslint-disable-next-line no-undef
      bouncer: _.debounce(async () => {
        const card = await this.ethjs.getCardByCode(this.card.redeemCode)
        if (!this.card) return

        if (!card) {
          this.status = {
            status: 'ERROR',
            message: 'Card not found, check the redeem code.'
          }
          return
        }
        Object.assign(this.card, card)
        this.card.isValid = true
        this.$emit('cardIsValid')
        this.status = {
          status: 'SUCCESS',
          message: 'This redeem code is available'
        }
      }, 2000)
    }
  },
  computed: {
    card: {
      get: function () {
        if (!this.cards) return
        return this.cards[this.index]
      },
      set: function (newCard) {
        this.cards[this.index] = newCard
      }
    }
  },
  beforeDestroy: function () {
    this.bouncer.cancel()
  },
  methods: {
    paste () {
      navigator.clipboard.readText().then(clipText => {
        this.card.redeemCode = clipText.trim()
      })
    },
    debouncedGetStatus () {
      this.bouncer.cancel()
      this.card.isValid = undefined
      this.$emit('cardIsValid')

      if (!this.card.redeemCode) {
        if (this.cards.length > 1) {
          this.status = {
            status: 'ERROR',
            message: 'Enter a redeem code.'
          }
        } else {
          this.status = undefined
        }
        return
      }

      for (let i = 0; i < this.index; i++) {
        if (this.cards[i].redeemCode === this.card.redeemCode) {
          this.status = {
            status: 'ERROR',
            message: 'You already entered that code above.'
          }
          return
        }
      }

      this.status = {
        status: 'LOADING',
        message: 'Checking if this card is still available.'
      }
      this.bouncer()
    }
  },
  watch: {
    'card.redeemCode': function (newCode, oldCode) {
      this.debouncedGetStatus()
    }
  }
}
</script>
