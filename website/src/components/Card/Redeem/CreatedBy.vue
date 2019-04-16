<template>
  <div v-if="card.isValid">
    Created by:
    <Hex :value="card.createdBy" />
  </div>
</template>
<script>
import Hex from "../../Widgets/Hex";

export default {
  components: {
    Hex
  },
  props: {
    card: Object
  }
};
</script>
