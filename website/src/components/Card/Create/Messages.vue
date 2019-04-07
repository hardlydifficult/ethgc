<template>
  <div>
    <h3>Messages:</h3>
    <div class="tab">
      <div>
        Description:
        <div class="tab">
          <textarea v-model="messages.description" />
        </div>
      </div>
      <div>
        Redeemed Message:
        <div class="tab">
          <textarea v-model="messages.redeemedMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: Object
  }
};
</script>
