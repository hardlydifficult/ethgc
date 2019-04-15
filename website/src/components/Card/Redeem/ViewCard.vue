<template>
  <div>
    <small>card contains:</small>
    <ul class="list-group">
      <div v-for="(tokenAddress, index) in card.tokenAddresses" :key="index">
        <li class="list-group-item list-group-item-info">
          <Token
            :token-address="tokenAddress"
            :value-or-id="card.valueOrIds[index]"
          />
        </li>
      </div>
    </ul>
  </div>
</template>
<script>
import Token from "./Token";

export default {
  components: {
    Token
  },
  props: {
    card: Object
  }
};
</script>
