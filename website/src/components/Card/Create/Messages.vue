<template>
  <div>
    <h5>Messages:</h5>
    <div>
      <div>
        Description:
        <div>
          <textarea v-model="messages.description" />
        </div>
      </div>
      <div>
        Redeemed Message:
        <div>
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
