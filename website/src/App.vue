<template>
  <div id="app">
    <Header />
    <h1>
      Website is WIP - please come back later!
    </h1>
    <ClaimCard />
    <CreateCard :ethjs="ethjs" />
  </div>
</template>

<script>
import Ethjs from '../../library/ethgc.js'
import Header from './components/Header'
import ClaimCard from './components/ClaimCard'
import CreateCard from './components/CreateCard'

export default {
  name: 'App',
  components: {
    Header,
    ClaimCard,
    CreateCard
  },
  computed: {
    ethjs () {
      return new Ethjs(window.web3.currentProvider, window.web3.defaultAccount)
    }
  }
}
</script>

<style>
.hidden {
  display: none;
}
.small {
  font-size: .5em;
}
.tokenValue {
  width: 25em;
}
.tab {
  margin-left: 1em;
}
</style>
