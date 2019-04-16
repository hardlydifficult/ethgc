<template>
  <div>
    Transaction history:
    <ul class="list-group">
      <li class="list-group-item">
        <Hex
          :value="
            '0x86c74643e51183b739c3f2164455ec6ef5077f9c037d4c657764a77c3470aab1'
          "
        />
        <Date :date="Date.now()" />
      </li>
      <li class="list-group-item">Dapibus ac facilisis in</li>
      <li class="list-group-item">Morbi leo risus</li>
      <li class="list-group-item">Porta ac consectetur ac</li>
      <li class="list-group-item">Vestibulum at eros</li>
    </ul>
  </div>
</template>

<script>
import Date from "../Widgets/Date";
import Hex from "../Widgets/Hex";

export default {
  components: {
    Date,
    Hex
  }
};
</script>
