<template>
  <div class="content" id="orderList">
    <!-- 搜索和筛选 -->
		<div class="mod-search">
        <div class="wrap-input">
          <img src="@/common/images/icon-search.png" alt="" @click="searchByKeyword">

          <!-- <form action="javascript:return true;"> -->
            <input type="search" @keyup.13="searchByKeyword" v-model="queryOrderParams.search_keyword" placeholder="订单编号/客户名称">
          <!-- </form> -->
        </div>
      
        <img src="@/common/images/icon-filter.png" alt="" class="btn-filter" @click="isShowFilter = true">
    </div>
    
    <!-- 列表 -->
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :autoFill="false" :top-method="loadTop" @translate-change="translateChange" @top-status-change="handleTopChange"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" class="load-more" @bottom-status-change="handleBottomChange">
        <ul class="order-list">
          <li v-for="(item,index) in orderList" :key="index" @click="gotoDetails(item.id)">
            <div class="item-top">
              <span>{{item.order_no}}</span>
              <span>【{{item.order_status_desc}}】</span>
            </div>
            <div class="item-details">
              <p class="s-name">{{item.buyer_name}}</p>
              <p>下单类型：{{item.order_type_desc}}</p>
              <p>下单时间：{{item.create_time}}</p>
              <p>订单金额：<span class="price">￥{{item.order_amount | formatMoney}}</span><span>【{{item.pay_status_desc}}】</span></p>
              <img src="@/common/images/arrow-right.png" alt="">
            </div>
            <div class="btns">
              <button @click.stop="cancelOrder(item.id)" v-show="item.order_status_desc == '待订单审核'">作废订单</button>
              <!-- <button v-show="item.pay_status_desc == '未付款' &&item.order_status_desc !== '已作废'" @click.stop="payRightNow(item.id)">立即付款</button> -->
              <button @click.stop="printOrder(item.id)" v-show="item.order_status_desc !== '已作废'">打印订单</button>
              <button @click.stop="removeOrder(item.id)" v-show="item.order_status_desc == '已作废'">删除</button>
            </div>
          </li>
        </ul>

        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
          <span v-show="topStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
        </div>    


        <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
          <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
        </div>
      </mt-loadmore>
    </div>

    <mt-spinner color="#1e90ff" class="loading-spinner" v-show="loading" type="fading-circle"></mt-spinner>


    <!-- 筛选 -->
    <div class="wrap-filter shade animated0 slideInRight" v-show="isShowFilter" @click="isShowFilter = false">
      <div class="shade-box" @click.stop="stopp">
        <div class="tags">
          <p>订单状态</p>
          <ul>
            <li v-for="(item,index) in orderStatusList" :key="index" @click="changeOrderStatus(item.name)" :class="{'active':item.active}">{{item.desc}}</li>
          </ul>
          <p>付款状态</p>
          <ul>
            <li v-for="(item,index) in payStatusList" :key="index" :class="{'active':item.active}" @click="changePayStatus(item.name)">{{item.desc}}</li>
          </ul>
        </div>
        <div class="create-user flex-item" @click="showPop">
          <span>创建人</span>
          <span>{{curUser}}<img src="@/common/images/arrow-right.png" alt=""></span>
        </div>
        <div class="bottom-btns flex-item">
          <button class="reset" @click="resetStatus">重置</button>
          <button class="sure" @click="sureToSearch">确定</button>
        </div>
      </div>
    </div>

    <mt-popup v-model="popupVisible" :closeOnClickModal="false" position="bottom">
      <a href="javascript:;" @click="popupVisible = false">确定</a>
      <mt-picker value-key="userName" :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
	export default {
    data() {
      return {
        allLoaded:false,
        queryOrderParams:{
          pager:{currentPage: 1, pageSize: 10},
          search_keyword:'',
          // order_status:'All',
        },
        orderList:[],
        bottomStatus: '',
        wrapperHeight: 0,
        topStatus: '',
        translate: 0,
        moveTranslate: 0,
        loading:false,

        orderStatusList:[],
        payStatusList:[],

        isShowFilter:false,

        popupVisible:false,
        slots:[
          {
            flex: 1,
            defaultIndex: 1,
            values: [],
            className: 'slot',
            textAlign: 'center'
          }
        ],
        curUser:'请选择',
        create_user_id:''
      }
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      this.getOrderList();
      this.getOrderStatus('OrderStatusEnum');
      this.getOrderStatus('PayStatusEnum');
      this.$nextTick(()=> {
        this.slots[0].defaultIndex = 0
      })
      
    },
    filters:{
      formatMoney(val) {
        return val.toFixed(2);
      }
    },
    methods:{
      getOrderStatus(type) {
        this.api.getOrderStatus({enumname:type}).then(res=> {
          if(res.callStatus == 'SUCCESS') {
            if(type == "OrderStatusEnum") {
              this.orderStatusList = res.data;
              this.orderStatusList.forEach(item=>{
                item.active = false;
              })
            }
            if(type == "PayStatusEnum") {
              this.payStatusList = res.data;
              this.payStatusList.forEach(item=>{
                item.active = false;
              })
            }
          }
        })
      },
      showPop() {
        this.popupVisible = true
        this.getGysUserList();
      },
      getGysUserList() {
        this.api.getGysUserList({}).then(res=> {
          this.loading = false;
          if(res.callStatus == 'SUCCESS') {
            this.slots[0].values = res.data
          }else {
            this.$toast(res.message);
          }
        })
      },
      onValuesChange(picker, values) {
        console.log(values)
        if(values[0]) {
          this.create_user_id = values[0].id
          this.curUser = values[0].userName
          this.queryOrderParams.create_user_id = values[0].id
        }
      },
      changeOrderStatus(status) {
        this.queryOrderParams.order_status = status;
        this.orderStatusList.forEach(item=>{
          if(status == item.name) {
            item.active = true;
          } else {
            item.active = false;
          }
        })
        this.orderStatusList.push({})
        this.orderStatusList.pop()
      },
      changePayStatus(status) {
        this.queryOrderParams.pay_status = status;
        this.payStatusList.forEach(item=>{
          if(status == item.name) {
            item.active = true;
          } else {
            item.active = false;
          }
        })
        this.payStatusList.push({})
        this.payStatusList.pop()
      },
      resetStatus() {
        this.orderStatusList.forEach(item=>{
          item.active = false;
        })
        this.orderStatusList.push({})
        this.orderStatusList.pop()
        this.payStatusList.forEach(item=>{
          item.active = false;
        })
        this.payStatusList.push({})
        this.payStatusList.pop()
        delete this.queryOrderParams.order_status;
        delete this.queryOrderParams.pay_status;
      },
      sureToSearch() {
        this.orderList = [];
        this.isShowFilter = false;
        this.queryOrderParams.pager.currentPage = 1;
        this.getOrderList();
      },
      stopp() {

      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      handleTopChange(status) {
        this.moveTranslate = 1;
        this.topStatus = status;
      },
      getOrderList() {  //获取订单列表
        if(this.queryOrderParams.search_keyword == '') {
           delete this.queryOrderParams.search_keyword
        }
        this.loading = true;
        this.api.queryOrder(this.queryOrderParams).then(res=> {
          this.loading = false;
          if(res.callStatus == 'SUCCESS') {
            this.orderList = res.data
          }else {
            this.$toast(res.message);
          }
        })
      },
      searchByKeyword() {  //关键字搜索
        this.queryOrderParams.pager.currentPage = 1;
        this.getOrderList();
      },
      loadTop() {
        this.$refs.loadmore.onTopLoaded();
      },
      loadBottom() {
        // 加载更多数据
        this.queryOrderParams.pager.currentPage++;
        this.api.queryOrder(this.queryOrderParams).then(res=> {
          if(res.callStatus == 'SUCCESS') {
            this.orderList = this.orderList.concat(res.data);
            this.$refs.loadmore.onBottomLoaded();
          }
        })

        // this.allLoaded = true;// 若数据已全部获取完毕
      },
      translateChange(translate) {
        const translateNum = +translate;
        this.translate = translateNum.toFixed(2);
        this.moveTranslate = (1 + translateNum / 70).toFixed(2);
      },
      gotoDetails(id) {
        this.$router.push(`/order/orderDetails/${id}`);
      },
      payRightNow(id) {
        console.log(0)
        this.$router.push(`/order/payMod/${id}`);
      },
      cancelOrder(id) {  //作废
        MessageBox.confirm('确认作废订单？').then(action => {
          if(action == 'confirm') {
            this.api.cancelOrder({order_id:id}).then(res=> {
              if(res.callStatus == 'SUCCESS') {
                this.orderList = []
                this.getOrderList()
              }
            })
          }
        });
      },
      removeOrder(id) {  //删除
        MessageBox.confirm('确认删除订单？').then(action => {
          if(action == 'confirm') {
            this.api.removeOrder({order_id:id}).then(res=> {
              if(res.callStatus == 'SUCCESS') {
                this.orderList = []
                this.getOrderList()
              } else {
                this.$toast(res.message);
              }
            })
          }
        });
      },
      printOrder(id) { //打印,触发app端的同名方法
        window.WebViewJavascriptBridge.callHandler(
          'printOrder', {
            'order_id': id
          },
          function (responseData) {
            // alert(responseData)
          }
        )
      }
    }
  }
</script>
<style lang="less" scoped>
  .mod-search {
    padding: 15px 20px;
    background: #1E90FF;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .wrap-input {
    width: 633px;
    height: 60px;
    line-height: 60px;
    border-radius: 30px;
    background: #FFF;
  }
  .wrap-input img {
    margin:0 24px;
    width: 33px;
    vertical-align: middle;
  }
  .wrap-input input {
    width: 500px;
    vertical-align: middle;
    text-align: center;
  }
  .btn-filter {
    width: 44px;
    height: 46px;
  }

  .order-list li {
    margin-bottom: 20px;
  }
  .order-list li>div {
    padding: 0 24px;
    background: #fff;
  }
  .order-list li .item-top {
    line-height: 81px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 0.5px solid #EEEEEE;
  }
  .order-list li .item-details {
    position: relative;
    padding: 40px 24px;
  }
  .item-details p {
    margin-top: 20px;
    font-size: 26px;
  }
  .item-details p span {
    color: #FF6754;
  }
  .item-details p .price {
    font-size: 32px;
  }
  .item-details .s-name {
    font-size: 32px;
    margin-top: 0;
  }
  .item-details img {
    position: absolute;
    width: 15px;
    top: 50%;
    right: 24px;
    margin-top: -14px;
  }
  .order-list li .btns {
    padding: 20px 24px;
    border-top: 0.5px solid #EEEEEE;
    text-align: right;
  }
  .btns button {
    margin-left: 5px;
    width: 160px;
    height: 60px;
    background: #fff;
    border: 0.5px solid #1E90FF;
    color: #1E90FF;
    border-radius: 8px;
    font-size: 26px;
    appearance: none;
    outline:none;
  }


  .mint-loadmore-top span {
    display: inline-block;
    vertical-align: middle
  }
  .mint-loadmore-top span.is-rotate {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg)
  }
  .page-loadmore .mint-spinner {
      display: inline-block;
      vertical-align: middle
  }
  .page-loadmore-desc {
      text-align: center;
      color: #666;
      padding-bottom: 5px
  }
  .page-loadmore-desc:last-of-type,
  .page-loadmore-listitem {
      border-bottom: 1px solid #eee
  }
  .page-loadmore-listitem {
      height: 50px;
      line-height: 50px;
      text-align: center
  }
  .page-loadmore-listitem:first-child {
      border-top: 1px solid #eee
  }
  .page-loadmore-wrapper {
      overflow: scroll;
      -webkit-overflow-scrolling : touch;
  }
  .mint-loadmore-bottom span {
      display: inline-block;
      -webkit-transition: .2s linear;
      transition: .2s linear;
      vertical-align: middle
  }
  .mint-loadmore-bottom span.is-rotate {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg)
  }

  .loading-spinner {
    position: fixed;
    top: 130px;
    left: 50%;
    -webkit-transform:translate(-50%,0);
  }

  .tags {
    padding: 0 24px;
  }
  .tags p {
    margin-top: 40px;
  }
  .tags ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .tags ul li {
    margin-top: 20px;
    width: 190px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-radius: 8px;
    background: #EEEEEE;
  }
  .tags ul li.active {
    background: #1E90FF;
    color: #fff;
  }
  .bottom-btns {
    position: absolute;
    width: 100%;
    bottom: 0;
  }
  .bottom-btns button {
    width: 50%;
    height: 98px;
    border: none;
    font-size: 30px;
  }
  .bottom-btns .reset {
    background: #fff;
    border-top: 0.5px solid #D2D2D2;
  }
  .bottom-btns .sure {
    background: #1E90FF;
    color: #fff;
  }
  .create-user {
    margin: 50px 20px;
    padding: 20px 24px;
    border: 0.5px solid #ddd;
  }
  .create-user img {
    margin-left: 20px;
    width: 13px;
  }

  .mint-popup,.picker {
    width: 100%;
  }
  .mint-popup a {
    float: right;
    margin: 20px 0;
    margin-right: 30px;
    color: #000;
    width: 120px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 0.5px solid #ccc;
    border-radius: 8px;
  }
</style>