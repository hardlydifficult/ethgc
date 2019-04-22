<template>
  <div id="app">
    <div class="content">
      <PageHeader />
      <RedeemCard />
      <nav class="nav nav-pills flex-column flex-md-row">
        <a
          class="flex-md-fill text-sm-center nav-link"
          v-bind:class="option === 'create' ? 'active' : ''"
          @click="
            option === 'create' ? (option = undefined) : (option = 'create')
          "
          href="#"
          >Create Card</a
        >
        <a
          class="flex-md-fill text-sm-center nav-link"
          href="#"
          v-bind:class="option === 'manage' ? 'active' : ''"
          @click="
            option === 'manage' ? (option = undefined) : (option = 'manage')
          "
          >Manage Cards</a
        >
        <a
          class="flex-md-fill text-sm-center nav-link"
          href="#"
          v-bind:class="option === 'learn' ? 'active' : ''"
          @click="
            option === 'learn' ? (option = undefined) : (option = 'learn')
          "
          >Learn More</a
        >
      </nav>
      <div v-if="option">
        <div>
          <div v-if="option === 'create'">
            <CreateCards />
          </div>
          <div v-else-if="option === 'manage'">
            <ManageCards />
          </div>
          <div v-else-if="option === 'learn'">
            <LearnMore />
          </div>
        </div>
      </div>
    </div>
    <TxHistory />
    <GDPR class="mt-5" />
    <PageFooter />
  </div>
</template>
<script>
import PageHeader from "./components/Template/PageHeader";
import PageFooter from "./components/Template/PageFooter";
import RedeemCard from "./components/Card/Redeem/index";
import CreateCards from "./components/Card/Create/index";
import ManageCards from "./components/Card/Manage/index";
import LearnMore from "./components/About/index";
import TxHistory from "./components/TxHistory/index";
import GDPR from "./components/Widgets/GDPR";

export default {
  name: "App",
  components: {
    PageHeader,
    RedeemCard,
    CreateCards,
    ManageCards,
    PageFooter,
    LearnMore,
    GDPR,
    TxHistory
  },
  data: () => {
    return {
      option: undefined
    };
  },
  mounted() {
    this.$swal({
      type: "error",
      title: "This is still Under Construction!",
      text: "There is no mainnet contract yet but it may work on testnet.",
      footer:
        "<a href='https://github.com/hardlydifficult/ethgc'>View on GitHub</a>"
    });
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto:100,300,400");
html,
body {
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.content {
  flex: 1 0 auto;
  /* Prevent Chrome, Opera, and Safari from letting these items shrink to smaller than their content's default minimum size. */
  padding: 20px;
  width: 100%;
  max-width: 75em;
  margin: auto;
}
body {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  width: 100%;
}
html {
  font-size: 1.25em;
}

.inputRedeemCode {
  max-width: 36em;
}
.pointer {
  cursor: pointer;
}
.quote {
  vertical-align: text-top;
  font-size: 0.75em;
}
</style>
