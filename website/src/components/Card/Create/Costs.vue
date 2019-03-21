<template>
  <div>
    <div class="tab small">
      <div>
        Gift Card Value: {{ cardValue }}
        <span v-if="tokenType == 'eth'">
          ETH
        </span>
        <span v-else>
          <!-- TODO get symbol if we can -->
          tokens
        </span>
        <!-- TODO display fine print without decimals (maybe?) -->
      </div>
      <div>
        Fee to Create a Card:
          <span v-if="newCardFee">
            {{ newCardFee }} ETH
          </span>
          <span v-else>
            ...
          </span>
      </div>
      <div>
        <div>
          Estimated gas fee: {{ estimatedTotalGasCost }}* ETH
          <!-- TODO how consistent is gas fee, can we remove estimated? -->
        </div>
        <div class="small">
          * at 4 GWEI
        </div>
      </div>
      <div>
        Estimated total:
        <span v-if="estimatedTotalCost">
          {{ estimatedTotalCost }} ETH
          <span v-if="tokenType == 'erc20'">
            +
            {{ cardValue }}
            <!-- TODO get symbol if we can -->
            tokens
          </span>
          <span v-else-if="tokenType == 'erc721'">
            +
            <!-- TODO get symbol if we can -->
            NFT id #{{ cardValue }}
          </span>
        </span>
        <span v-else>
          ...
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import Constants from '../../../logic/constants.js'
const BigNumber = require('bignumber.js')

function sleep (ms) { // todo remove
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {

  computed: {
    estimatedTotalGasCost () {
      return this.ethjs.hardlyWeb3.fromWei(
        this.ethjs.hardlyWeb3.toWei(4, 'gwei') * Constants.gas.createCard,
        'ether')
    }
  },
  asyncComputed: {
    async newCardFee () {
      await sleep(1000)
      return 0.0005 // TODO add library
    },
    async estimatedTotalCost () {
      if (this.newCardFee === null) return undefined

      return new BigNumber(this.tokenType === 'eth' ? this.cardValue : 0)
        .plus(this.newCardFee)
        .plus(this.estimatedTotalGasCost)
        .toFixed()
    }
  }
}
</script>
