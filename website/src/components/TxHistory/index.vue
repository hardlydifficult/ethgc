<template>
  <div v-on:tx="onTx">
    Transaction history:
    <ul class="list-group" v-if="transactions.length">
      <li
        class="list-group-item"
        v-for="(tx, index) in transactions"
        :key="index"
      >
        <StatusIcon
          :status="{
            url:
              '0x86c74643e51183b739c3f2164455ec6ef5077f9c037d4c657764a77c3470aab1',
            urlMessage: 'etherscan.com'
          }"
        />
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

export default {
  components: {
    Date,
    StatusIcon
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
