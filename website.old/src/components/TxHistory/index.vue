<template>
  <div @tx="onTx">
    Transaction history:
    <ul v-if="transactions.length"
        class="list-group">
      <li
        v-for="(tx, index) in transactions"
        :key="index"
        class="list-group-item">
        <ViewOnEtherscan :tx="tx" />

        <!-- <StatusIcon :status="{loadingMessage:'wip<br><small>click to view on EtherScan</small>'}" /> -->

        Create card
        <Date :date="Date.now()" />
        <span v-tooltip="'Success - 5 confirmations. Mined 20 mins ago'" />
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
import Date from '../Widgets/Date'
import ViewOnEtherscan from '../Widgets/ViewOnEtherscan'

export default {
  components: {
    Date,
    ViewOnEtherscan
  },
  data() {
    return {
      transactions: []
    }
  },
  mounted() {
    this.transactions = this.$ls.get('transactions') || []
    this.$observable.subscribe('tx', this.onTx)
  },
  methods: {
    onTx(tx) {
      this.transactions.push(tx)
      this.$ls.set('transactions', this.transactions)
    }
  }
}
</script>
