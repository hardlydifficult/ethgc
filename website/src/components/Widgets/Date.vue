<template>
  <span>
    {{ dateString }}
  </span>
</template>

<script>
export default {
  props: {
    date: Number
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
  }
};
</script>
