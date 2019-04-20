<template>
  <span v-tooltip="dateString"> {{ deltaString }} ago </span>
</template>

<script>
import BigNumber from "bignumber.js";

export default {
  props: {
    date: Number
  },
  data() {
    return {
      deltaString: undefined
    };
  },
  created() {
    this.delta();
    setInterval(this.delta, 1000);
  },
  computed: {
    dateString() {
      if (!this.date) return undefined;
      let value = new Date(this.date);
      var fullTz = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
      var parts = fullTz.split(" ");
      var tz = "";
      parts.forEach(function(element, index, array) {
        tz += element.substring(0, 1);
      });

      return `${value.toLocaleDateString()} ${value.toLocaleTimeString()} ${tz}`;
    }
  },
  methods: {
    delta() {
      if (!this.date) {
        this.deltaString = undefined;
      }
      let value = new BigNumber(this.date).minus(Date.now()).toFixed();
      value = new BigNumber(value).abs();
      let label;
      if (value > 1000 * 60 * 60 * 24 * 1.5) {
        // > 1.5 days
        value = value.div(1000 * 60 * 60 * 24);
        label = "day";
      } else if (value > 1000 * 60 * 60 * 1.5) {
        // > 1.5 hours
        value = value.div(1000 * 60 * 60);
        label = "hr";
      } else if (value > 1000 * 60 * 1.5) {
        // > 1.5 minutes
        value = value.div(1000 * 60);
        label = "min";
      } else {
        value = value.div(1000).dp(0);
        label = "sec";
      }

      if (!value.dp(1).eq(value.dp(0))) {
        value = value.toFormat(1);
      } else {
        value = value.toFormat(0);
      }
      if (value != "1") {
        label += "s";
      }
      this.deltaString = `${value} ${label}`;
    }
  }
};
</script>
