<template>
  <div>
    <div>
      How it Works
    </div>
    <ol>
      <li>
        <div>
          Create gift card
        </div>
        <div>
          Generate a random redeem code and create the card by sending ETH or
          tokens.
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
    <div>
      <button @click.stop.prevent="goToReadTheDocs()">
        <span>Read the Docs</span>
        <i class="fas fa-external-link-alt" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goToReadTheDocs() {
      window.open("https://ethgc.readthedocs.io", "_blank");
    }
  }
};
</script>
