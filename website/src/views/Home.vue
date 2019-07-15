<template>
  <div class="home p-4 w-screen">
    <!-- Redeem Card -->
    <card class="rounded-lg w-full"
          icon="gift">
      <h2 class="text-3xl">
        Redeem a Gift Card
      </h2>
      <p>Type or paste in your code below</p>

      <input v-model="code"
             class="p-2 bg-blue-700 text-white border-gray-800 border-2 text-center uppercase my-5">

      <button class="btn">
        <span class="fa fa-fw fa-paste" />
      </button>
    </card>

    <!-- Results -->
    <transition name="fade"
                mode="out-in">
      <div v-show="code"
           key="content"
           class="results">
        Hello
      </div>
    </transition>
  </div>
</template>

<script>
import CardVue from '../components/containers/Card.vue'

export default {
  name:       'Home',
  components: {
    Card: CardVue
  },
  data: () => ({
    code: 'hey dude'
  })
}
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  position: relative;
  // justify-content: center;
}

.results {
  animation-duration: 1s;
  animation-fill-mode: both;
  position: relative;
}
</style>

