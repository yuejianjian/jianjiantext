<template>
  <div id="wait_goodsList">
    <div class="header">
      待出库商品清单
      <a href="javascript:;" @click="goBack"></a>
    </div>

    <ul class="list">
      <li v-for="item in goodsList" class="flex-item">
        <img :src="item.photo_url||'../../static/404.png'" alt="">
        <div>
          <p class="goods_name">{{item.goods_name}}</p>
          <p class="buy_qit">订购数量：{{item.delivery_qit}} {{item.specific_name}}</p>
          <p class="item_qit">待出库数量：{{item.wait_delivery_qit}} {{item.specific_name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
	data() {
    return {
      goodsList:[],
    }
  },
  mounted() {
    const data = JSON.parse(localStorage.getItem('waitGoods'))
    data.forEach(item=>{
      this.goodsList = this.goodsList.concat(item.gysGoodsStockVOList)
    })
    console.log(this.goodsList)
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

  #wait_goodsList {
    padding-top: 108px;
  }
  .list li {
    padding: 40px 24px;
    border-bottom: 0.5px solid #EEEEEE;
    background: #fff;
  }
  .list li img {
    width: 175px;
    height: 175px;
  }
  .list li>div {
    width: 494px;
  }
  .list li .goods_name {
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
    word-break:break-all;
  }
  .list li .buy_qit {
    margin-top: 15px;
    font-size: 26px;
    color: #666666;
  }
  .list li .item_qit {
    margin-top: 15px;
    color: #FF6754;
  }
</style>
