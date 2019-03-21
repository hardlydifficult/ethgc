<template>
  <div>
    <h3>Create a new Gift Card</h3>

    <RedeemCodes />
    <Tokens />
    <Messages />

    <button>Create Card</button>

    <Costs />

  </div>
</template>

<script>
import Costs from './Costs'
import Messages from './Messages'
import RedeemCodes from './RedeemCodes'
import Tokens from './Tokens'

export default {
  components: {
    Costs,
    Messages,
    RedeemCodes,
    Tokens
  }
}
</script>
