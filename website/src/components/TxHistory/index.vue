<template>
  <div v-on:tx="onTx">
    Transaction history:
    <ul class="list-group" v-if="transactions.length">
      <li
        class="list-group-item"
        v-for="(tx, index) in transactions"
        :key="index"
      >
        <ViewOnEtherscan :tx="tx" />

        <!-- <StatusIcon :status="{loadingMessage:'wip<br><small>click to view on EtherScan</small>'}" /> -->

        Create card
        <Date :date="Date.now()" />
        <span v-tooltip="'Success - 5 confirmations. Mined 20 mins ago'">
        </span>
      </li>
    </ul>
    <div v-else>
      <small>
        (none)
      </small>
    </div>
  </div>
</template>

<script>
import Date from "../Widgets/Date";
import StatusIcon from "../Widgets/StatusIcon";
import ViewOnEtherscan from "../Widgets/ViewOnEtherscan";

export default {
  components: {
    Date,
    StatusIcon,
    ViewOnEtherscan
  },
  data() {
    return {
      transactions: []
    };
  },
  mounted() {
    this.transactions = this.$ls.get("transactions") || [];
    this.$observable.subscribe("tx", this.onTx);
  },
  methods: {
    onTx(tx) {
      this.transactions.push(tx);
      this.$ls.set("transactions", this.transactions);
    }
  }
};
</script>
