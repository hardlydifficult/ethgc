<template>
  <div id="app">
    <Header />
    <h1>
      Website is WIP - please come back later!!!
    </h1>
    <div v-if="ethjs">
      <RedeemCards />
      <CreateCards />
      <ManageCards />
    </div>
    <div v-else>
      LOGIN TO METAMASK!
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from './components/Template/Header'
import Footer from './components/Template/Footer'
import RedeemCards from './components/Card/Redeem/index'
import CreateCards from './components/Card/Create/index'
import ManageCards from './components/Card/Manage/index'

export default {
  name: 'App',
  components: {
    Header,
    RedeemCards,
    CreateCards,
    ManageCards,
    Footer
  }
}
</script>

<style lang="scss">
a {
  text-decoration: none;
  color: black;
}
a:hover {
  color: blue;
  border-bottom: 1px solid blue;
}
a:active {
  color: red;
}
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

.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}
</style>
