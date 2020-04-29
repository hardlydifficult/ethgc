<template>
  <header class="header">
    <!-- Logo -->
    <div class="header__logo">
      <img
        alt="ethgc"
        src="@/assets/logo.png">
    </div>
    <!-- Right Content -->
    <div class="header__right align-top">
      <span class="fa fa-fw fa-2x fa-bars" />
    </div>
  </header>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.header {
  background-color: lighten($color--primary, 20);
  display: grid;
  grid: auto / 1fr auto;
  align-items: center;
  align-content: flex-start;
  padding: 1rem;

  height: 250px;

  margin-bottom: -50px;

  &__right {
    align-self: flex-start;
  }


  img {
    max-height: 8rem;
  }
}
</style>
