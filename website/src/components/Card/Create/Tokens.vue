<template>
  <div>
    <h3>Tokens:</h3>
    <div class="tab">
      <div v-for="(token, index) in tokens" :key="index" class="token">
        <Token :tokens="tokens" :index="index" />

        <div v-if="tokens.length > 1">
          <button v-on:click="removeToken(index)">Remove Token</button>
        </div>
      </div>

      <button v-on:click="addToken()" v-if="tokens.length < 5">Add Token</button>
    </div>
  </div>
</template>

<script>
import Token from './Token'

export default {
  components: {
    Token
  },
  data: function () {
    return {
      tokens: [{type: 'ETH', address: 0, value: 1}]
    }
  },
  methods: {
    addToken () {
      this.tokens.push({type: 'ERC20', address: 0, value: 1})
    },
    removeToken (index) {
      this.tokens.splice(index, 1)
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
