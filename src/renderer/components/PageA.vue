<template>
  <div class="page-a">
    Hi, it's page a
    <router-link to="/b">goto page b</router-link>
  </div>
</template>

<script>
export default {
  name: 'pagea'
}
</script>
<style lang="scss">
.page-a {
  color: red;
}
</style>
