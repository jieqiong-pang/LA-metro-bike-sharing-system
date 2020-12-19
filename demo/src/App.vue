<template>
  <div id="app">
    <Navbar class="nav_position"></Navbar>
    <router-view class="content"/>
  </div>
</template>

<script>
import Navbar from '@/components/content/navbar/Navbar'

export default {
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
body {
  background-color: #f4f3ef !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // height: 100vh;
  // background-color: #f3f4f6;
  
  display: grid;
  grid-template-rows: 66px 1fr;
}

.nav_position {
  grid-row: 1/2;
  position: -webkit-sticky;
  position: -moz-sticky;
  position: -ms-sticky;
  position: -o-sticky;
  position: sticky;
  top: 0;

  z-index: 401;
}

.content {
  grid-row: 2/3;
}
</style>
