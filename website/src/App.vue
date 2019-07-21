<template>
  <div id="app">
    <transition mode="out-in"
                name="fade">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>
