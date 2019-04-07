<template>
  <div id="app">
    <div class="body">
      <PageHeader />
      <div class="flex justify-center text-center">
        <div
          class="pr-1 pl-1 pt-3 justify-center veryRounded"
          style="background-color: #AAC1B5"
        >
          <RedeemCard />
        </div>
      </div>
      <div style="min-height: 5em">
        <div class="flex justify-center mt-10">
          <button
            class="text-grey-darkest font-bold py-2 px-4 rounded-l"
            :class="
              option === 'create'
                ? 'bg-grey-darker text-orange'
                : 'bg-grey-light hover:bg-grey'
            "
            @click="
              option === 'create' ? (option = undefined) : (option = 'create')
            "
          >
            Create Card
          </button>
          <button
            class="text-grey-darkest font-bold py-2 px-4"
            :class="
              option === 'manage'
                ? 'bg-grey-darker text-orange'
                : 'bg-grey-light hover:bg-grey'
            "
            @click="
              option === 'manage' ? (option = undefined) : (option = 'manage')
            "
          >
            Manage Cards
          </button>
          <button
            class="text-grey-darkest font-bold py-2 px-4 rounded-r"
            :class="
              option === 'learn'
                ? 'bg-grey-darker text-orange '
                : 'bg-grey-light hover:bg-grey'
            "
            @click="
              option === 'learn' ? (option = undefined) : (option = 'learn')
            "
          >
            Learn More
          </button>
        </div>
        <div v-if="option" class="flex justify-center pt-5">
          <div class="p-5 pb-10 veryRounded" style="background-color: #AAC1B5">
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
  background-color: #ecf0f1;
  margin: 0;
  color: #3c3c3d; // darkest ethereum color
}
html {
  font-size: 24px;
}
.veryRounded {
  border-radius: 2em;
}
.body {
  padding-bottom: 3em;
}
.link {
  text-decoration: none;
  color: #3c3c3d;
}
.link:hover {
  color: blue;
  text-decoration: underline;
}
.link:active {
  color: red;
}
a {
  text-decoration: none;
  color: #3c3c3d;
}
a:hover {
  color: blue;
  text-decoration: underline;
}
a:active {
  color: red;
}
.hidden {
  display: none;
}
.small {
  font-size: 0.5em;
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
