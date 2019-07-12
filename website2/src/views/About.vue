<template>
  <div class="about">
    <h1>This is an about page</h1>

    <mycomponent />
  </div>
</template>

<script>
import HelloWorldVue from '../components/HelloWorld.vue'
export default {
  components: {
    Mycomponent: HelloWorldVue
  },
  data: () => ({
    testing: 'hello there'
  })
}
</script>
