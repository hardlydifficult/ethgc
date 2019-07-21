<template>
  <div id="app">
    <transition mode="out-in"
                name="fade">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {

}
</script>


<style lang="scss" src="@/assets/scss/style.scss"></style>
