<template>
  <div>
    <h3>Create a new Gift Card</h3>

    <div v-for="(token, index) in tokens" :key="index">
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

      <div v-if="index > 0">
        <button v-on:click="removeToken(index)">Remove Token</button>
      </div>
    </div>

    <button v-on:click="addToken()">Add Token</button>

    <div v-for="(card, index) in cards" :key="index">
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

    <div>
      Description: <textarea />
    </div>
    <div>
      Redeemed Message: <textarea />
    </div>
    <button>Create Card</button>
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

import Constants from '../logic/constants.js'
import Random from '../logic/random.js'
const random = new Random()
const BigNumber = require('bignumber.js')

function sleep (ms) { // todo remove
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  props: {
    ethjs: undefined
  },
  data: function () {
    return {
      cardValue: 1,
      cardRedeemCode: undefined,
      customCode: false,
      tokenType: 'eth',
      tokens: [{address: 0, value: 1}],
      cards: [undefined],
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
    addToken () {
      this.tokens.push({address: 0, value: 1})
    },
    removeToken (index) {
      this.tokens.splice(index, 1)
    },
    randomizeCode () {
      this.cardRedeemCode = random.getRandomCode(16, true)
      this.customCode = false
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
    },
  },
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
