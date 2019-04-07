<template>
  <span v-if="status">
    <span v-if="overallStatus" v-tooltip="messages">
      <i v-if="overallStatus === 'SUCCESS'" class="far fa-thumbs-up green" />
      <i
        v-else-if="overallStatus === 'WARNING'"
        class="fas fa-exclamation orange"
      />
      <i v-else-if="overallStatus === 'ERROR'" class="fas fa-times red" />
    </span>
    <a
      v-if="status.url"
      v-tooltip="status.urlMessage"
      :href="status.url"
      target="blank"
    >
      <i class="fas fa-receipt" />
    </a>
    <span v-if="status.loadingMessage" v-tooltip="status.loadingMessage">
      <i class="fas fa-spinner fa-spin" />
    </span>
  </span>
</template>

<script>
export default {
  props: {
    status: Object
  },
  computed: {
    overallStatus() {
      if (
        !this.status ||
        !this.status.status ||
        this.status.status.length < 1
      ) {
        return undefined;
      }
      let overallStatus = this.status.status[0].status;
      for (let i = 0; i < this.status.status.length; i++) {
        const status = this.status.status[i].status;
        if (overallStatus === "ERROR" || status === "ERROR") {
          overallStatus = "ERROR";
        } else if (overallStatus === "WARNING" || status === "WARNING") {
          overallStatus = "WARNING";
        } else if (overallStatus === "SUCCESS" || status === "SUCCESS") {
          overallStatus = "SUCCESS";
        } else {
          throw new Error(`Invalid status ${status}`);
        }
      }
      return overallStatus;
    },
    messages() {
      if (this.status.status.length < 1) return undefined;
      let messages = "";
      for (let i = 0; i < this.status.status.length; i++) {
        const statusMessage = this.status.status[i].message;
        messages += `<div>${statusMessage}</div>`;
      }
      return messages;
    }
  }
};
</script>
<style>
.orange {
  color: #f79862;
}
.red {
  color: red;
}
.green {
  color: green;
}
</style>
