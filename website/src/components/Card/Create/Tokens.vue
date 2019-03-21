<template>
  <div>
    <h3>Tokens:</h3>
    <div class="tab">
      <div v-for="(token, index) in tokens" :key="index" class="token">
        <input type="radio" v-model="tokenType" value="eth">ETH
        <input type="radio" v-model="tokenType" value="erc20">Tokens (ERC-20)
        <input type="radio" v-model="tokenType" value="erc721">NFT (ERC-721)
        <div v-if="tokenType == 'erc20' || tokenType == 'erc721'">
          Token address: <input />
          <!-- TODO display loading, contract not found, or contract confirmed -->
          <!-- TODO display name if available -->
        </div>
        <div v-if="tokenType == 'eth' || tokenType == 'erc20'">
          Gift Amount: <input type="number" step="0.0001" v-model="cardValue" v-on:input="validateCardValue()" class="tokenValue" />
          <span v-if="tokenType == 'eth'">
            ETH
          </span>
          <span v-else>
            <!-- TODO get symbol if we can -->
            tokens
          </span>
          <!-- TODO display number of decimals if available -->
        </div>
        <div v-else>
          TokenId: <input type="text" v-model="cardValue" />
        </div>

        <div>
          <button>Unlock</button>
        </div>
        <div>
          ✔
          <!-- TODO: confirm allowance and balance is available -->
        </div>

        <div v-if="tokens.length > 1">
          <button v-on:click="removeToken(index)">Remove Token</button>
        </div>
      </div>

      <button v-on:click="addToken()" v-if="tokens.length < 5">Add Token</button>
    </div>
  </div>
</template>

<script>
const BigNumber = require('bignumber.js')

export default {
  data: function () {
    return {
      tokens: [{address: 0, value: 1}]
    }
  },
  methods: {
    addToken () {
      this.tokens.push({address: 0, value: 1})
    },
    removeToken (index) {
      this.tokens.splice(index, 1)
    },
    validateCardValue () {
      if (!this.cardValue) return
      switch (this.tokenType) {
        case 'eth':
          const number = new BigNumber(this.cardValue)
          if (number.isPositive()) {
            this.cardValue = new BigNumber(number.toFixed(18, BigNumber.ROUND_FLOOR)).toFixed()
          }
          break
      }
    }
  }
}
</script>
<style>
.token
{
  border:2px solid green;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding: 0.5em;
}
</style>
