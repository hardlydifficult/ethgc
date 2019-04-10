<template>
  <div v-if="card.isValid">
    Created by:
    <Address :address="card.createdBy" />
  </div>

</template>
<script>
import Address from "../../Widgets/Address";

export default {
  components: {
    Address
  },
  props: {
    card: Object
  }
};
</script>
