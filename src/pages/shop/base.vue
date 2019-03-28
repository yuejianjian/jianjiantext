<template>
  <div id="base">
      <tab-bar></tab-bar>
      <router-view />
  </div>
</template>

<script>
import {api} from '../../api/api.js'
import Tabbar from '@/base/tabbar/tabbar'
export default {
  data() {
    return {
      
    }
  },
  components:{
    'tab-bar':Tabbar,
  },
  mounted() {

  },
}
</script>

<style>
  #base {
    height: 100%;
  }
</style>
