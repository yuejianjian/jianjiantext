<template>
  <div id="orderDetails">
		<div class="header">
			订单详情
			<a href="javascript:;" @click="goBack"></a>
		</div>

    <div class="order-num c-item flex-item">
    	<span>订单编号：{{orderDetail.order_no}}</span>
    	<span>{{orderDetail.order_status_desc}}</span>
    </div>

    <div class="receive-info c-item flex-item">
    	<img src="@/common/images/ic_map.png" alt="">
    	<div>
    		<p>{{orderDetail.contactPerson}} {{orderDetail.contactPhone}}</p>
    		<p class="address">{{orderDetail.address_detail}}</p>
    	</div>
    </div>

    <div class="c-item">
    	<div class="wrap-list flex-item" @click="gotoGoodsList">
    		<ul class="goods-list flex-item">
	    		<li v-for="(item,index) in goods_list" :key="index">
	    			<img :src="item.photo_url||'../../static/404.png'" alt="">
	    		</li>
	    	</ul>
	    	<div class="more" >
	    		<div>商品清单</div>
					<div>共{{orderDetail.goods_count}}件<img src="@/common/images/arrow-right.png" alt=""></div>
	    	</div>
    	</div>
    	<div class="pay-amount flex-item">
    		<span>共{{orderDetail.goods_count}}种{{orderDetail.goods_qit}}件</span>
    		<span>应付金额: ￥{{orderDetail.pay_amount | formatMoney}}</span>
    	</div>
    	<div class="total-amount">
    		<span>优惠金额:<em>￥{{orderDetail.discount_amount | formatMoney}}</em></span>
    		<span>商品总额:￥{{orderDetail.order_amount | formatMoney}}</span>
    	</div>
    </div>

    <div class="c-item flex-item">
    	<span>付款方式</span>
    	<span>{{orderDetail.pay_method_desc}}</span>
    </div>

    <div class="wrap-pay">
    	<div class="flex-item pay-record" @click="gotoPayMod(orderDetail.id)">
    		<span>付款记录</span>
    		<span class="record">{{orderDetail.pay_status_desc}}<img src="@/common/images/arrow-right.png" alt=""></span>
    	</div>
    	<div class="flex-item pay-num">
    		<span>待付款：<em>￥{{orderDetail.pay_amount|formatMoney}}</em></span>
    		<!-- <a href="javascript:;">付款</a> -->
    	</div>
    </div>

    <div class="other-info">
    	<div @click="gotoShipped(orderDetail.id)">
    		<span>出库/发货记录</span>
    		<span>{{orderDetail.delivery_status_desc}}/{{orderDetail.shipping_status_desc}}<img src="@/common/images/arrow-right.png" alt=""></span>
    	</div>
    	<div @click="gotoRemark(orderDetail.id)">
    		<span>备注信息</span>
    		<span class="orderRemark">{{orderDetail.gysOrderRemark.length}}<img src="@/common/images/arrow-right.png" alt=""></span>
    	</div>
    	<div @click="gotoUploadFile(orderDetail.id)">
    		<span>订单附件</span>
    		<span class="orderFile">{{orderDetail.orderFile.length}}<img src="@/common/images/arrow-right.png" alt=""></span>
    	</div>
    	<div>
    		<span>交货日期</span>
    		<span></span>
    	</div>
    	<div>
    		<span>发票信息</span>
    		<span>不需要发票<img src="@/common/images/arrow-right.png" alt=""></span>
    	</div>
    </div>

    <div class="logs">
    	<div>操作日志</div>
    	<div v-for="(item,index) in logList" :key="index">
    		<div>
    			<span>{{item.operate_type_desc}}：</span>
    			<span>{{item.create_time}}</span>
    		</div>
    		<div class="operator">
    			<span>{{item.operate_name}}</span>
    			<span>{{item.operate_mobile}}</span>
    		</div>
    	</div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
        orderDetail:{
        	gysOrderRemark:[],
        	orderFile:[]
        },
        goods_list:[],
        logList:[]
      }
    },
    mounted() {
      this.getDetail();
    },
    filters:{
      formatMoney(val) {
        if(!isNaN(val)) {
          return val.toFixed(2);
        }
      }
    },
    methods:{
      getDetail() {
        this.api.getOrderDetail({order_id:this.$route.params.id}).then(res=> {
          if(res.callStatus == 'SUCCESS') {
            this.orderDetail = res.data
            this.goods_list = this.goods_list.concat(res.data.goods_list)
            res.data.appPromotionRuleVO.forEach(item=>{
            	this.goods_list = this.goods_list.concat(item.appOrderItemVO)
            })
            this.goods_list = this.goods_list.splice(0,3);
            this.logList = res.data.gysOrderTraceLogList
          }
        })
      },
      gotoPayMod(id) {
        this.$router.push(`/order/payMod/${id}`);
      },
      gotoShipped(id) {
      	this.$router.push(`/order/shipped/${id}`);
      },
      gotoGoodsList() {
      	localStorage.setItem('orderDetail',JSON.stringify(this.orderDetail))
      	this.$router.push('/order/goodsList/orderEnter');
      },
      gotoRemark(id) {
      	this.$router.push(`/order/remark/${id}`);
      },
      gotoUploadFile(id) {
      	this.$router.push(`/order/uploadFile/${id}`);
      },
      goBack() {
      	this.$router.back(-1)
      }
    }
}
</script>

<style scpoed>
	#orderDetails {
		padding-top: 108px;
		padding-bottom: 120px;
	}
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

	#orderDetails>div {
		margin-bottom: 20px;
	}
	.order-num span:last-child {
		color: #FF6754;
	}
	.receive-info img {
		width: 30px;
	}
	.receive-info div {
		width: 651px;
	}
	.receive-info .address {
		margin-top: 16px;
		color: #666666;
		font-size: 26px;
	}

	.wrap-list {
		border-bottom: 0.5px solid #EEEEEE;
	}
	.wrap-list .more{
		padding-top: 45px;
		height: 175px;
		padding-left: 30px;
		box-shadow: -3px 0px 5px #f2f2f2;
	}
	.wrap-list .more img {
		margin-left: 10px;
		width: 10px;
	}
	.goods-list li {
		padding: 20px 0;
	}
	.goods-list li img {
		width: 175px;
	}
	.goods-list .text-detail {
		position: relative;
		padding-bottom: 104px;
		width: 497px;
	}
	#orderDetails .text-detail>div {
		position: absolute;
		bottom: 0;
		width: 100%;
		font-size: 26px;
	}
	#orderDetails .text-detail .spec {
		margin-top: 15px;
		font-size: 26px;
		color: #929292;
	}
	#orderDetails .text-detail .unit-price {
		font-size: 28px;
		color: #FF6754;
	}
	.pay-amount {
		margin-top: 38px;
	}
	.total-amount {
		margin-top: 15px;
		text-align: right;
		font-size: 24px;
		color: #666666;
	}
	.total-amount span:first-child {
		margin-right: 20px;
	}
	.total-amount em {
		color: #FF6754;
	}

	.wrap-pay {
		padding: 0 24px;
		background: #FFF;
	}
	.pay-record .record {
		padding: 30px 0;
		color: #FF6754;
	}
	.record img {
		width: 13px;
		margin-left: 20px;
	}
	.pay-num {
		padding: 14px 0;
		border-top: 0.5px solid #EEEEEE;
	}
	.pay-num a {
		width: 150px;
		height: 55px;
		line-height: 55px;
		color: #FFF;
		text-align: center;
		border-radius: 5px;
		background: #FF6754;
	}
	.pay-num span em {
		font-size: 32px;
		color: #FF6754;
	}

	.other-info,.logs {
		padding: 0 24px;
		background: #fff;
	}
	.other-info>div {
		display: flex;
	  align-items: center;
	  justify-content: space-between;
		padding: 30px 0;
		border-bottom: 0.5px solid #EEEEEE;
	}
	.other-info>div img {
		margin-left: 20px;
		width: 13px;
	}
	.other-info .orderRemark,.other-info .orderFile {
		color: #1e90ff;
	}

	.logs>div {
		padding: 30px 0;
		border-bottom: 0.5px solid #EEEEEE;
		color: #565656;
	}
	.logs>div>div {
		display: flex;
	  align-items: center;
	  justify-content: space-between;
	}
	.operator {
		margin-top: 20px;
	}
</style>
