<template>
  <div>
    Redeem Code
    <input type="text" v-model="card.redeemCode" v-on:input="card.customCode = true" />
    <i class="far fa-copy" v-on:click="$clipboard(card.redeemCode)" v-tooltip="'Copy'"></i>
    <button v-on:click="randomizeCode()"><i class="fas fa-redo"></i></button>
    <StatusIcon v-if="card.customCode && status.status !== 'ERROR'" status="WARNING" message="! Warning ! Be careful when choosing your own code. It must not be something someone could guess." />
    <StatusIcon v-if="status" :status="status.status" :message="status.message" />
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
      status: undefined,
      // eslint-disable-next-line no-undef
      bouncer: _.debounce(async () => {
        let available = await this.ethjs.getAddressIsAvailableByCode(this.card.redeemCode)
        if (!this.card) return
        if (available) {
          if (this.card.redeemCode.length < 15) {
            this.status = {
              status: 'WARNING',
              message: 'This redeem code is available but careful with short codes, someone might steal this card.'
            }
          } else {
            this.status = {
              status: 'SUCCESS',
              message: 'This redeem code is available'
            }
          }
        } else {
          this.status = {
            status: 'ERROR',
            message: 'This redeem code is already in use, pick another.'
          }
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

      if (!this.card.redeemCode) {
        this.status = {
          status: 'ERROR',
          message: 'Enter a redeem code.'
        }
        return
      }

      for (let i = 0; i < this.index; i++) {
        if (this.cards[i].redeemCode === this.card.redeemCode) {
          this.status = {
            status: 'ERROR',
            message: 'Each card must have a unique redeem code.'
          }
          return
        }
      }

      this.status = {
        status: 'LOADING',
        message: 'Checking if this code is already in use...'
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
