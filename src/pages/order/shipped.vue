<template>
  <div id="shipped">
    <div class="header">
      出库/发货记录
      <a href="javascript:;" @click="goBack"></a>
    </div>

    <div class="waiting-ck c-item flex-item" @click="gotoWaitGoodsList">
      <span>待出库商品</span>
      <span class="hight-color">{{deliveryCount}}件<img src="@/common/images/arrow-right.png" alt=""></span>
    </div>

    <ul class="shipped-list">
      <li v-for="item in shippedList">
        <div class="flex-item" v-if="item.statusDesc">
          <span>出库/发货记录</span>
          <span>{{item.statusDesc}}</span>
        </div>
        <div class="flex-item" @click="gotoGoodsList(item)">
          <span>出库发货商品</span>
          <span class="hight-color">{{item.gysOrderCkDetailVOList.length + item.gysOrderCkPromotionList.length}}件<img src="@/common/images/arrow-right.png" alt=""></span>
        </div>
        <div class="flex-item">
          <span>出库编码</span>
          <span>{{item.ck_no}}</span>
        </div>
        <div class="flex-item">
          <span>出库时间</span>
          <span>{{item.createTime}}</span>
        </div>
        <div class="flex-item" v-if="item.shippingDate">
          <span>发货日期</span>
          <span>{{item.shippingDate}}</span>
        </div>
        <div class="flex-item" v-if="item.waybillCompany">
          <span>物流公司</span>
          <span>{{item.waybillCompany}}</span>
        </div>
        <div class="flex-item" v-if="item.waybillNumber">
          <span>物流单号</span>
          <span>{{item.waybillNumber}}</span>
        </div>
        <button v-if="item.status == 'waitting_received'" @click="shippingReceived(item.id)" class="btn-receive">确认签收</button>
      </li>
    </ul>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
export default {
	data() {
    return {
      shippedList:[],
      deliveryCount:0,
      deliverylist:[]
    }
  },
  mounted() {
    this.getShippedList();
    this.getDelivery();
  },
  methods:{
    getShippedList() { //发货记录列表
      this.api.getShippedList({orderId:this.$route.params.id}).then(res=> {
        if(res.callStatus == 'SUCCESS') {
          this.shippedList = res.data
        }
      })
    },
    getDelivery() {  //未发货数量
      this.api.getDelivery({order_id:this.$route.params.id}).then(res=> {
        if(res.callStatus == 'SUCCESS') {
          this.deliveryCount = res.data.goodsCount
          this.deliverylist = res.data.deliverylist
        }
      })
    },
    shippingReceived(id) {
      MessageBox.confirm('确认签收？').then(action => {
        if(action == 'confirm') {
          this.api.shippingReceived({id:id}).then(res=> {
            if(res.callStatus == 'SUCCESS') {
              this.getShippedList();
            }
          })
        }
      });
    },
    gotoGoodsList(data) {  //出库/发货商品清单
      localStorage.setItem('ckGoods',JSON.stringify(data))
      this.$router.push({
        name:'CkGoodsList'
      });
    },
    gotoWaitGoodsList() {  //待出库商品清单
      if(this.deliveryCount == 0) {
        return
      }
      localStorage.setItem('waitGoods',JSON.stringify(this.deliverylist))
      this.$router.push('/order/wait_goodsList');
    },
    goBack() {
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
  .header {
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

  #shipped {
    padding-top: 108px;
  }
	.waiting-ck img,.shipped-list li img {
    margin-left: 20px;
    width: 13px;
  }
  .shipped-list li {
    margin-top: 20px;
    background: #FFF;
  }
  .shipped-list li>div {
    margin: 0 24px;
    padding: 30px 0;
    border-bottom: 0.5px solid #eee;
  }
  .btn-receive {
    display: block;
    width: 702px;
    margin: 20px auto;
    background: #1E90FF;
    border: none;
    color: #FFF;
    height: 66px;
    border-radius: 12px;
  }
  .hight-color {
    color: #1E90FF;
  }
</style>
