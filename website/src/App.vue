<template>
  <div id="app">
    <Header />
    <h1>
      Website is WIP - please come back later!
    </h1>
    <RedeemCards />
    <CreateCards />
    <Footer />
  </div>
</template>

<script>
import Header from './components/Template/Header'
import Footer from './components/Template/Footer'
import RedeemCards from './components/Card/Redeem/RedeemCards'
import CreateCards from './components/Card/Create/CreateCards'

export default {
  name: 'App',
  components: {
    Header,
    RedeemCards,
    CreateCards,
    Footer
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
