<template>
  <div class="whitespace-no-wrap">
    <div class="w-12 inline-block text-left" />
    <input
      v-model="card.redeemCode"
      type="text"
      class="w-64 shadow appearance-none border rounded py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
      placeholder="Redeem Code"
    >
    <div class="w-12 inline-block text-left">
      <i
        v-tooltip="'Paste'"
        class="far fa-clipboard"
        @click="paste()"
      />
      <StatusIcon :status="status" />
    </div>
    <ViewCard
      v-if="card.isValid"
      :card="card"
    />
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
    card: Object
  },
  data: function () {
    return {
      status: undefined,
      // eslint-disable-next-line no-undef
      bouncer: _.debounce(async () => {
        const cardAddress = await this.ethjs.getCardAddress(this.card.redeemCode)
        const card = await this.ethjs.getCard(cardAddress)
        this.$set(this.status, 'loadingMessage', undefined)
        if (!this.card) return

        if (!card) {
          this.status.status.push({
            status: 'ERROR',
            message: 'Card not found, check the redeem code.'
          })
          this.$set(this.status, 'loadingMessage', 'Checking if the code was previously redeemed (vs it was never a valid code)')
          const tx = await this.ethjs.getRedeemTx(cardAddress)
          this.$set(this.status, 'loadingMessage', undefined)
          if (tx) {
            if (tx.returnValues.redeemer === this.ethjs.hardlyWeb3.defaultAccount()) {
              this.status.url = `https://etherscan.io/tx/${tx.transactionHash}`
              this.status.urlMessage = 'You redeemed this card earlier. Click to view on EtherScan.'
            } else {
              this.status.url = `https://etherscan.io/tx/${tx.transactionHash}`
              this.status.urlMessage = 'This code was previously redeemed. Click to view on EtherScan.'
            }
          }
          return
        }
        Object.assign(this.card, card)
        this.card.isValid = true
        this.$emit('cardIsValid')
        this.status.status.push({
          status: 'SUCCESS',
          message: 'This redeem code is available'
        })
      }, 2000)
    }
  },
  watch: {
    'card.redeemCode': function (newCode, oldCode) {
      this.debouncedGetStatus()
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
      this.status = { status: [] }
      this.card.isValid = undefined
      this.$emit('cardIsValid')

      if (!this.card.redeemCode) {
        return
      }

      for (let i = 0; i < this.index; i++) {
        if (this.cards[i].redeemCode === this.card.redeemCode) {
          this.status.status.push({
            status: 'ERROR',
            message: 'You already entered that code above.'
          })
          return
        }
      }

      this.$set(this.status, 'loadingMessage', 'Checking if this card is still available.')
      this.bouncer()
    }
  }
}
</script>
