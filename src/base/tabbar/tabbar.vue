<template>
  <div id="Tabbar">
    <router-link class="home" tag="div" to="/shop/base/home">首页</router-link>
    <router-link class="article" tag="div" to="/shop/base/category/10">商品</router-link>
    <router-link class="shop" tag="div" to="/shop/base/shoppingCar">进货单<span>￥{{shopCartAmount}}</span></router-link>
  </div>
</template>

<script>
  import Bus from '@/store/bus.js'
  export default {
    data() {
      return {
        shopCartAmount:''
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
      this.getShopCartAmount()
      Bus.$on('getAmount', (e) => {
        console.log(e)
        this.shopCartAmount = e
      })
      Bus.$on('getAmountReq', () => {
        this.getShopCartAmount();
      })
    },
    methods:{
      getShopCartAmount() {
        this.api.getShopCartAmount({}).then(res=> {
          if(res.callStatus == 'SUCCESS') {
            this.shopCartAmount = res.data.shopcart_amount
             console.log(this.shopCartAmount)
          }
        })
      },

    }
  };
</script>
<style scoped>
#Tabbar{
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 97px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFF;
  z-index: 999;
}
#Tabbar>div {
  width: 33.3%;
  text-align: center;
  height: 70px;
  padding-top: 43px;
  font-size: 24px;
}
#Tabbar .mint-tab-item-label {
  color: #999999;
  height: 25px;
}
#Tabbar .home.active{
  background: url('../../common/images/homeColor.png') no-repeat center top;
  color: #1E90FF;
}
#Tabbar .home{
  background: url('../../common/images/home.png') no-repeat center top;
}
#Tabbar .article.active{
  background: url('../../common/images/categoryColor.png') no-repeat center top;
  color: #1E90FF;
}
#Tabbar .article{
  background: url('../../common/images/category.png') no-repeat center top;
}
#Tabbar .shop.active{
  background: url('../../common/images/shopCarColor.png') no-repeat center top;
  color: #1E90FF;
}
#Tabbar .shop{
  position: relative;
  background: url('../../common/images/shopCar.png') no-repeat center top;
}
#Tabbar .shop span {
  position: absolute;
  top: -10px;
  right: 40px;
  background: #ff6754;
  color: #fff;
  border-radius: 20px;
  padding: 2px 5px;
  font-size: 22px;
}
</style>
