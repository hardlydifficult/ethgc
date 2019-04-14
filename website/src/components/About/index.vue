<template>
  <div class="jumbotron bg-gray-100 mx-auto">
    <h3>
      How it Works
    </h3>
    <ol>
      <li>
        <div>
          Create gift card
        </div>
        <div>
          Generate a random redeem code and create the card by sending ETH,
          tokens, and/or NFTs.
        </div>
      </li>
      <li>
        <div>
          Redeem gift
        </div>
        <div>
          Submit the redeem code and get the ETH or tokens inside.
        </div>
      </li>
    </ol>
    <div class="text-center pt-3">
      <button @click.stop.prevent="goToDocs()" class="btn btn-secondary">
        <span>Documentation</span>
        <i class="fas fa-external-link-alt" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goToDocs() {
      window.open("/docs", "_blank");
    }
  }
};
</script>
