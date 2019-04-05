<template>
  <div>
    <div class="text-3xl text-center">
      How it Works
    </div>
<ol class="pt-6">
<li>
  <div class="text-lg font-bold">Create gift card</div>
  <div class="tab pt-2">
    Generate a random redeem code and create the card by sending ETH or tokens.
  </div>
</li>
<li class="pt-4">
  <div class="text-lg font-bold">Redeem gift</div>
  <div class="tab pt-2">
    Submit the redeem code and get the ETH or tokens inside.
  </div>
</li>
</ol>
  <div class="text-center pt-8">
    <button
      v-on:click.stop.prevent="goToReadTheDocs()"
      class="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
    >
      <span>Read the Docs</span>
      <i class="fas fa-external-link-alt pl-2"></i>
    </button>
  </div>
  </div>
</template>
<script>
export default {
  methods: {
    goToReadTheDocs () {
      window.open('https://ethgc.readthedocs.io', '_blank')
    }
  }
}
</script>
