<template>
  <div>
    <div v-for="(tokenAddress, index) in card.tokenAddresses" :key="index">
      <Token :tokenAddress="tokenAddress" :valueOrId="card.valueOrIds[index]" />
    </div>
    Created by:
    <Address :address="card.createdBy" />
    <br>
    <div v-if="messages">
      <div v-if="messages.description">
        Description: {{ messages.description }}
      </div>
      <div v-else>
        (no description)
      </div>
      <!-- <br><br>
      {{ messages.redeemedMessage }} -->
    </div>
    <div v-else>
      <StatusIcon status="LOADING" message="Loading the card's message" />
    </div>
  </div>
</template>
<script>
import Address from '../../Widgets/Address'
import Token from './Token'
import StatusIcon from '../../Widgets/StatusIcon'

export default {
  components: {
    Address,
    Token,
    StatusIcon
  },
  props: {
    card: Object
  },
  asyncComputed: {
    messages: async function () {
      return this.ethjs.getCardMessages(this.card.redeemCode)
    }
  }
}
</script>
