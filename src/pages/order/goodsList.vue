<template>
  <!-- 商品清单 -->
  <div id="goodsList">
    <div class="header">
      商品清单
      <a href="javascript:;" @click="goBack"></a>
    </div>

    <div class="collect c-item flex-item">
      <span>共{{orderDetail.goods_count || orderDetail.total_goods_count}}种{{orderDetail.goods_qit||orderDetail.total_goods_qit}}件</span>
      <span class="order_amount">订单总额：￥{{orderDetail.order_amount||orderDetail.sum_goods_amount|formatMoney}}</span>
    </div>
    <ul class="list">
      <li v-for="(item,index) in goodsList" :key="index" class="flex-item">
        <img :src="item.photo_url||'../../static/404.png'" alt="">
        <div>
          <p class="goods_name">{{item.goods_name}}</p>
          <div class="flex-item price_num">
            <span class="sales_price">￥{{item.item_sales_price || item.sales_price|formatMoney}}/{{item.specific_name}}</span>
            <span>x {{item.item_qit || item.goods_qit}}</span>
          </div>
        </div>
      </li>
    </ul>

    <!-- 促销清单 -->
    <ul class="promotion-list">
      <li class="parent-li" v-for="(item,index) in promotionList" :key="index">
        <div v-if="item.appOrderItemVO.length" class="title c-item flex-item">
          <div>
            <span class="tit">{{item.promotionOrderTypeDesc}}</span>
            <span>促销价格：<em>￥{{item.payMoney|formatMoney}}</em></span>
          </div>
          <div>x {{item.qit}}</div>
        </div>
        <ul class="list">
          <li class="child-li flex-item" v-for="(childItem,index) in item.appOrderItemVO" :key="index">
            <img :src="childItem.photo_url" alt="">
            <div>
              <p class="goods_name"><span v-if="childItem.item_type == 'GIFT'">【赠品】</span> {{childItem.goods_name}}</p>
              <div class="flex-item price_num">
                <span class="sales_price">￥{{childItem.item_sales_price|formatMoney}}/{{childItem.specific_name}}</span>
                <span>x {{childItem.item_qit}}</span>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
	data() {
    return {
      orderDetail:{},
      goodsList:[],
      promotionList:[]
    }
  },
  filters:{
    formatMoney(val) {
      if(!isNaN(val)) {
        return val.toFixed(2);
      }
    }
  },
  mounted() {
    const data = JSON.parse(localStorage.getItem('orderDetail'))
    if(this.$route.params.status == 'confirm') {
      this.orderDetail = data
      this.goodsList = data.confirm_goods_list;
      this.promotionList = data.promotion_gift_list;
    } else {
      this.orderDetail = data;
      this.goodsList = data.goods_list;
      this.promotionList = data.appPromotionRuleVO;
    }
  },
  methods:{
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

  #goodsList {
    padding-top: 108px;
  }

  .collect {
    margin-bottom: 20px;
  }
  .collect .order_amount {
    color: #FF6754;
  }
  .list li {
    padding: 20px 24px;
    border-bottom: 0.5px solid #EEEEEE;
    background: #fff;
  }
  .list li img {
    width: 150px;
    height: 150px;
  }
  .list li>div {
    width: 520px;
  }
  .list li .goods_name {
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
    word-break:break-all;
  }
  .list li .price_num {
    margin-top: 50px;
  }
  .price_num .sales_price {
    color: #FF6754;
  }
  .parent-li {
    margin-top: 20px;
  }
  .parent-li .title {
    border-bottom: 0.5px solid #EEEEEE;
  }
  .title .tit {
    margin-right: 20px;
    color: #1e90ff;
  }
  .title em {
    color: #FF6754;
  }
  .child-li .goods_name span {
    color: #1e90ff;
  }
</style>
