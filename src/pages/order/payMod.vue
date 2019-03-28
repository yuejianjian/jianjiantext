<template>
  <div id="payMod">
    <div class="header">
      付款记录
      <a href="javascript:;" @click="goBack"></a>
    </div>

    <div class="flex-item c-item">
			<span>应付金额：</span>
			<span>￥{{paymentInfo.orderPayAmount|formatMoney}}</span>
    </div>
    <div class="flex-item c-item">
			<span>已付金额：</span>
			<span>￥{{paymentInfo.payedAmount || 0 | formatMoney}}</span>
    </div>
    <div class="flex-item c-item">
			<span>待收款审核金额：</span>
			<span class="hightColor">￥{{paymentInfo.autiding_amount || 0 |formatMoney}}</span>
    </div>
    <div class="flex-item c-item">
			<span>未付金额：</span>
			<span class="hightColor">￥{{paymentInfo.orderPayAmount|formatMoney}}</span>
    </div>
  </div>
</template>

<script>
export default {
	data() {
    return {
      paymentInfo:{}
    }
  },
  mounted() {
    this.getPaymentInfo();
  },
  filters:{
    formatMoney(val) {
      if(!isNaN(val)) {
        return val.toFixed(2);
      }
    }
  },
  methods:{
    getPaymentInfo() {
      this.api.getPaymentInfo({orderId:this.$route.params.id}).then(res=> {
        if(res.callStatus == 'SUCCESS') {
        	this.paymentInfo = res.data;
        }
      })
    },
    goBack() {
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 88px;
    line-height: 88px;
    text-align: center;
    background: #000;
    background: #1E90FF;
    color: #fff;
    font-size: 34px;
  }
  .header a {
    position: absolute;
    width: 88px;
    height: 88px;
    left: 0;
    top: 0;
    background: url(../../common/images/arrow-left.png) no-repeat center center;
    background-size: 21px 40px;
  }

	#payMod {
		padding-top: 108px;
	}
	#payMod>div {
		border-bottom: 0.5px solid #EEEEEE;
	}
	#payMod .hightColor {
		color: #FF6754;
	}
</style>
