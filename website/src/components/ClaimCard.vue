<template>
  <div>
    <h3>Claim &amp; Redeem a Gift Card</h3>
    <div>
      Redeem Code: <input v-model="redeemCode" />
    </div>
    <div v-if="card">
      <img src="../assets/sampleCard.png" width="25%" />
      <div>
        <button>Claim</button>
      </div>
      <div class="small">
        (step 1 of 2)
      </div>
    </div>
  </div>
</template>

<script>
function sleep (ms) { // todo remove
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  data: function () {
    return {
      redeemCode: ''
    }
  },
  asyncComputed: {
    async card () {
      if (!this.redeemCode) return undefined
      await sleep(1000)
      // TODO
      return {
        token: 0x0,
        valueOrTokenId: 198291,
        claimedBy: 0x0,
        claimedAtTime: 0,
        temp: this.redeemCode // todo remove
      }
    }
  }
}
</script>
