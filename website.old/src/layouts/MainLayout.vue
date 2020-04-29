<template>
  <div class="layout layout__main-view">
    <div class="layout__inner">
      <!-- Header -->
      <main-header />

      <!-- Content -->
      <main-content />

      <!-- Footer -->
      <main-footer />
    </div>
  </div>
</template>

<script>
import MainHeaderVue from '../components/MainHeader.vue'
import MainFooterVue from '../components/MainFooter.vue'
import MainContentVue from '../components/MainContent.vue'
export default {
  components: {
    MainHeader:  MainHeaderVue,
    MainContent: MainContentVue,
    MainFooter:  MainFooterVue
  }
}
</script>

<style scoped lang="scss">
.layout {
  display: grid;

  &__main-view {
    position: relative;
  }

  &__inner {
    min-height: 100vh;
    display: grid;
    grid: auto 1fr auto / 1fr;
  }
}
</style>
