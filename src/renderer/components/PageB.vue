<template>
  <div class="page-b">
    Hi, it's page b
    <router-link to="/">goto page a</router-link>
  </div>
</template>

<script>
export default {
  name: 'pageb'
}
</script>
<style lang="scss">
.page-b {
  color: green;
}
</style>
