<template>
  <div>
    Redeem Code
    <input
      v-model="card.redeemCode"
      type="text"
      @input="card.customCode = true"
    >
    <i
      v-tooltip="'Copy'"
      class="far fa-copy"
      @click="$clipboard(card.redeemCode)"
    />
    <button
      v-tooltip="'Generate a new random code'"
      @click="randomizeCode()"
    >
      <i class="fas fa-redo" />
    </button>
    <StatusIcon :status="status" />
  </div>
</template>

<script>
import StatusIcon from '../../Widgets/StatusIcon'
import Random from '../../../logic/random.js'
const random = new Random()

export default {
  components: {
    StatusIcon
  },
  props: {
    cards: Array,
    index: Number
  },
  data: function () {
    return {
      status: {},
      // eslint-disable-next-line no-undef
      bouncer: _.debounce(async () => {
        const cardAddress = await this.ethjs.getCardAddress(this.card.redeemCode)
        let available = (await this.ethjs.getCard(cardAddress)) === undefined
        this.$set(this.status, 'loadingMessage', undefined)
        if (!this.card) return
        if (available) {
          if (this.card.redeemCode.length < 15) {
            this.status.status.push({
              status: 'WARNING',
              message: 'This redeem code is available but careful with short codes, someone might steal this card.'
            })
          } else {
            this.status.status.push({
              status: 'SUCCESS',
              message: 'This redeem code is available'
            })
          }
        } else {
          this.status.status.push({
            status: 'ERROR',
            message: 'This redeem code is already in use, pick another.'
          })
        }
      }, 2000)
    }
  },
  computed: {
    card: function () {
      if (!this.cards) return
      return this.cards[this.index]
    }
  },
  watch: {
    'card.redeemCode': function (newCode, oldCode) {
      this.debouncedGetStatus()
    }
  },
  mounted: function () {
    if (!this.card.redeemCode) {
      this.randomizeCode()
    }
  },
  beforeDestroy: function () {
    this.bouncer.cancel()
  },
  methods: {
    randomizeCode () {
      this.card.redeemCode = random.getRandomCode(16, true)
      this.card.customCode = false
    },
    debouncedGetStatus () {
      this.bouncer.cancel()
      this.status = { status: [] }

      if (!this.card.redeemCode) {
        this.status.status.push({
          status: 'ERROR',
          message: 'Enter a redeem code.'
        })
        return
      }

      for (let i = 0; i < this.index; i++) {
        if (this.cards[i].redeemCode === this.card.redeemCode) {
          this.status.status.push({
            status: 'ERROR',
            message: 'Each card must have a unique redeem code.'
          })
          return
        }
      }

      if (this.card.customCode) {
        this.status.status.push({
          status: 'WARNING',
          message: 'Be careful when choosing your own code. It must not be something someone could guess.'
        })
      }

      this.$set(this.status, 'loadingMessage', 'Checking if this code is already in use...')
      this.bouncer()
    }
  }
}
</script>
