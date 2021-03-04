<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'main-app',
  data() {
    return {}
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  position: relative;
  display: block;
}
</style>
