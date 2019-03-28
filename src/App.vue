<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    
  }
}
</script>

<style>
@import './common/reset.css';
@import './common/common.css';
*{
  padding: 0;
  margin: 0;
  list-style: none;
}
#app {
  height: 100%;
  background: #F7F7F7;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
