<template>
  <div class="card">
    <!-- Icon -->
    <div v-if="icon"
         class="card__icon shadow-strong">
      <span class="fa fa-3x"
            :class="[`fa-${icon}`]" />
    </div>

    <!-- Main Content -->
    <slot>
      Content Here
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.card {
  $icon-size: 5rem;
  position: relative;
  display: inline-grid;
  text-align: center;
  background: #fff;
  color: lighten(#000, 3);
  padding: .5rem 1rem;
    max-width: 600px;
  margin: auto;


  &__icon {
    background-color: darken($color--primary, 5);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    position: relative;
    // transform: translateY(-45%);
    margin-top: -$icon-size * .45;
    margin-bottom: 1.5rem;
    color: #fff;
    border-radius: 50%;
    width: $icon-size;
    height: $icon-size;
    border: 4px solid #fff;
  }

}
</style>
