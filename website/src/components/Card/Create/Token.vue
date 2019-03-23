<template>
  <div>
    <div>
      <input type="radio" v-model="token.type" value="ETH">ETH
      <input type="radio" v-model="token.type" value="ERC20">Tokens (ERC-20)
      <input type="radio" v-model="token.type" value="ERC721">NFT (ERC-721)
    </div>
    <div v-if="token.type === 'ERC20' || token.type === 'ERC721'">
      Token address: <input />
      <!-- TODO display loading, contract not found, or contract confirmed -->
      <!-- TODO display name if available -->
    </div>
    <span v-if="token.type === 'ETH' || token.type === 'ERC20'">
      Gift Amount: <input type="number" step="0.0001" v-model="token.value" v-on:input="validateCardValue()" class="tokenValue" />
      <span v-if="token.type === 'ETH'">
        ETH
      </span>
      <span v-else>
        <!-- TODO get symbol if we can -->
        tokens
      </span>
      <!-- TODO display number of decimals if available -->
    </span>
    <span v-else>
      TokenId: <input type="text" v-model="token.value" class="tokenValue" />
    </span>

    <span v-if="token.type !== 'ETH'">
      <button>Unlock</button>
    </span>
    <StatusIcon :status="status" :loadingMessage="loadingMessage" />
  </div>
</template>

<script>
import StatusIcon from '../../Widgets/StatusIcon'
const BigNumber = require('bignumber.js')

export default {
  components: {
    StatusIcon
  },
  data: function () {
    return {
      status: undefined,
      loadingMessage: undefined,
      // eslint-disable-next-line no-undef
      bouncer: _.debounce(async () => {
        const balance = await this.ethjs.hardlyWeb3.getEthBalance()
        this.loadingMessage = undefined
        if (balance.gte(this.ethjs.hardlyWeb3.toWei(this.token.value, 'ether'))) {
          this.status.push({
            status: 'SUCCESS',
            message: 'You have enough tokens in your wallet for this gift'
          })
        } else {
          this.status.push({
            status: 'ERROR',
            message: 'You do not have enough tokens in your wallet for this gift'
          })
        }
      }, 2000)
    }
  },
  props: {
    tokens: Array,
    index: Number
  },
  computed: {
    token: function () {
      if (!this.tokens) return
      return this.tokens[this.index]
    }
  },
  mounted: function () {
    this.debouncedGetStatus()
  },
  methods: {
    validateCardValue () {
      if (!this.token) return
      switch (this.token.type) {
        case 'ETH':
          const number = new BigNumber(this.token.value)
          if (number.isPositive()) {
            this.token.value = new BigNumber(number.toFixed(18, BigNumber.ROUND_FLOOR)).toFixed()
          }
          break
      }
    },
    debouncedGetStatus () {
      this.bouncer.cancel()
      this.status = []

      if (!this.token.value) {
        this.status.push({
          status: 'ERROR',
          message: 'Please enter a value'
        })
        return
      }
      if (this.token.type === 'ETH') {
        this.token.baseValue = this.ethjs.hardlyWeb3.toWei(this.token.value)
        for (let i = 0; i < this.index; i++) {
          if (
            this.tokens[i].type === this.token.type &&
            (
              this.tokens[i].type === 'ETH' ||
              this.tokens[i].address === this.token.address
            )
          ) {
            this.status.push({
              status: 'ERROR',
              message: 'You already have this token selected above.'
            })
            return
          }
        }
      }

      this.loadingMessage = 'Confirming you have the balance available in your wallet'
      this.bouncer()
    }
  },
  watch: {
    'token.address': function () {
      this.debouncedGetStatus()
    },
    'token.type': function () {
      this.debouncedGetStatus()
    },
    'token.value': function () {
      this.debouncedGetStatus()
    }
  }
}
</script>
