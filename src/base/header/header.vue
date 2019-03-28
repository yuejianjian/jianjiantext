<template>
  <header id="headerContainer">
    <img class="scan" src="../../common/images/scan.png" alt="">
    <p class="search" >
        <img src="../../common/images/sousuo.png" alt="">
        <input type="text" style="text-align:center;" placeholder="商品名称/品牌" @keyup.enter.stop="openSearch1"  v-model.trim="keywords">
    </p>
    <img class="warn" src="../../common/images/ic_message_home.png" alt="" @click="waiting">
  </header>
</template>

<script>
import Bus from '@/store/bus.js'
  export default {
    data() {
      return {
         keywords:'',//搜索商品
      }
    },
    methods:{
      waiting() {
        this.$toast('努力开发中！')
      },

      openSearch1() {
         Bus.$emit('toSearch',this.keywords);
      }
      
    },
    created() {
      
    },
    mounted() {
      
    }
  }
</script>

<style lang="less" scoped>
  #headerContainer{
      width: 100%;
      height: 100px;
      position: fixed;
      z-index:10;
      top: 0;
      background: linear-gradient(to left, #1e90ff, #4fe4fa);

      .scan{
          display: none;
          float: left;
          width: 47px;
          margin-left:24px;
          margin-top:30px; 
      }
      .search >input{
          float: center;
          margin-left:27px;
          margin-top:20px;
          margin-right: 27px;
          width:93%;
          height: 70px;
          background-color: #fff;
          border-radius: 12px;
      }
      .search >img{
          width:30px;
          height: 30px;
          position: absolute;
          bottom: 30px;
          left: 115px;
      }
      input::-ms-input-placeholder{text-align: center;}
      input::-webkit-input-placeholder{text-align: center;}
      .warn{
          display: none;
          height: 50px;
          position: absolute;
          bottom: 20px;
          right: 22px;
      }
  }
</style>