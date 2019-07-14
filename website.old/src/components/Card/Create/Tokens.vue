<template>
  <div>
    <h5>Tokens:</h5>
    <div>
      <div v-for="(token, index) in tokens"
           :key="index">
        <Token :tokens="tokens"
               :index="index" />

        <div v-if="tokens.length > 1">
          <button @click="removeToken(index)">
            Remove Token
          </button>
        </div>
      </div>

      <button v-if="tokens.length < 5"
              @click="addToken()">
        Add Token
      </button>
    </div>
  </div>
</template>

<script>
import Token from './Token'

export default {
  components: {
    Token
  },
  props: {
    tokens: Array
  },
  methods: {
    addToken() {
      this.tokens.push({ type: 'ERC20', address: 0, value: 1 })
    },
    removeToken(index) {
      this.tokens.splice(index, 1)
    }
  }
}
</script>
