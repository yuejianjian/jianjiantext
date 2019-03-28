<template>
  <div class="success">
    <img src="@/common/images/icon-success.png" alt="" class="icon-success">
    <p class="text-success">订单提交成功</p>
    <div class="flex-item btns">
    	<a href="javascript:;" class="continue" @click="goBuy">继续下单</a>
    	<a href="javascript:;" class="payNow" @click="nothing">立即付款</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    },
    methods:{
    	goBuy() {
    		this.$router.push('/shop/base/home');
    	},
    	nothing() {
	    	this.$toast('努力开发中！')
	    }
    }
  }
</script>

<style scoped>
  .success {
  	padding-top: 300px;
  	text-align: center;
  }
  .success .icon-success {
		width: 160px;
		height: 160px;
  }
  .success .text-success {
  	margin-top: 64px;
  	font-size: 34px;
  }
  .btns {
  	position: fixed;
  	width: 100%;
  	bottom: 0;
  }
  .btns a {
  	width: 50%;
  	height: 98px;
  	line-height: 98px;
  	text-align: center;
  }
  .btns .continue {
  	color: #1E90FF;
  	border-top: 0.5px solid #D2D2D2;
  }
  .btns .payNow {
  	color: #fff;
  	background: #1E90FF
  }
</style>