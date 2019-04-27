/* eslint-disable react/react-in-jsx-scope, react/no-this-in-sfc */

import { storiesOf } from "@storybook/vue";

import App from "../src/App.vue";

storiesOf("Welcome", module).add("to Storybook", () => ({
  components: { App },
  template: "<div class='app' />"
}));

/* eslint-enable react/react-in-jsx-scope */
