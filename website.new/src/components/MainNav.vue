<template>
  <nav class="main__nav text-center m-auto">
    <ul>
      <li>
        <router-link to="/credit-card">
          Create Card
        </router-link>
      </li>
      <li>
        <router-link to="/manage">
          Manage Cards
        </router-link>
      </li>
      <li>
        <router-link to="/learn">
          Learn More
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
ul {
  display: flex;
  justify-content: space-between;
  li {
    margin-right: 15px;
    padding: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
