<template>
  <div id="app">
    <PageHeader />
    <RedeemCard />
    <div>
      <div>
        <button
          @click="
            option === 'create' ? (option = undefined) : (option = 'create')
          "
        >
          Create Card
        </button>
        <button
          @click="
            option === 'manage' ? (option = undefined) : (option = 'manage')
          "
        >
          Manage Cards
        </button>
        <button
          @click="
            option === 'learn' ? (option = undefined) : (option = 'learn')
          "
        >
          Learn More
        </button>
      </div>
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
    <PageFooter />
  </div>
</template>
<script>
import PageHeader from "../components/Template/PageHeader";
import PageFooter from "../components/Template/PageFooter";
import RedeemCard from "../components/Card/Redeem/index";
import CreateCards from "../components/Card/Create/index";
import ManageCards from "../components/Card/Manage/index";
import LearnMore from "../components/About/index";

export default {
  name: "App",
  components: {
    PageHeader,
    RedeemCard,
    CreateCards,
    ManageCards,
    PageFooter,
    LearnMore
  },
  data: () => {
    return {
      option: undefined
    };
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto:100,400,Open-Sans");

body {
  font-family: "Open-Sans", sans-serif;
  font-weight: 400;
  width: 100%;
  margin: 0;
}
html {
  font-size: 24px;
}

.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: #3c3c3d;
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
    border-color: #3c3c3d;
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

  &[aria-hidden="true"] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden="false"] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
}
</style>
