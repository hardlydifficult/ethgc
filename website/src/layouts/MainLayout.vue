<template>
  <div class="layout layout__main-view">
    <div class="layout__inner">
      <slot>
        <router-view />
      </slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
.layout {
  display: grid;

  &__main-view {
    position: relative;
  }
}
</style>
