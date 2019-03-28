<template>
  <div id="searchGoodsListContainer">
      <!-- 搜索栏遮罩 -->
    <div id="container" >
        <div class="search_bg"></div>
        <!--头部-->
        <header class="searchHeader">
            <a href="#" class="back search_back" @click="closeSearch"></a>
            <p class="zzSearhVal">
                <img class="sousuo" src="../../../common/images/sousuo.png" alt="">
                <input  @keyup.enter="searchGoods"  v-model.trim="keywords" placeholder="商品名称/品牌" class="search_ipt">
                <img class="saomiao" src="../../../common/images/ic_scan.png" alt="">
            </p>
            <a href="javascript:;" v-on:click.prevent="searchGoods" class="search1">搜索</a>
        </header>
        <!--头部-->
        <!--主体-->
        <section class="content">
            <div class="hot-search">
                <h4 class="title">搜索历史</h4>
                <div class="his-list" style="margin-left:15px;">
                    <p class="p_list" style="color:#fff;border-bottom:1px solid #fff;height:30px;line-height:30px;" v-for="x in his_list" :key="x.id" v-text="x" @click="searchx(x)"></p>
                </div>
                <p class="clear" id="clear" @click="clearHis">清空搜索历史</p>
            </div>
        </section>
    </div>
      <!--头部-->
      <header class="header" id="tbHeader" >
          <a href="javascript:history.go(-1)" class="back"></a>
          <p class="val" @click="gotoSearchInput">
              <img class="sousuo" src="../../../common/images/sousuo.png" alt="">
              <span v-if="search_val!=''" class="input"  v-text="search_val"></span>
              <i v-if="search_val!=''" class="close_icon"></i>
          </p>
          <a href="javascript:;" v-on:click.prevent="scanbarcode" class="search"></a>
      </header>
      <!-- 头部 end -->
      <!--主体-->
      <section id="content" style="overflow-y: auto;">
          <mt-loadmore :top-method="reload" :bottom-method="loadMore" :bottom-all-loaded="allLoaded" ref="loadmore">
              <!-- 商品列表 -->
              <div class="sp">
                  <div class="sp-list" v-bind:class="{hide:showLoading}">
                      <dl v-cloak v-for="goods in goods_list" :key="goods.goods_id">
                          <router-link :to="{path:'/shop/detail',query:{goods_id:goods.goods_id}}">
                              <dt class="i_mg active">
                                  <img :src="goods.photo_url" class="photo" onerror="this.src='static/404.png'">
                                  <em class="hide sp_em">补货中</em>
                              </dt>
                          </router-link>
                          <dd>
                              <p class="title">
                                  <span class="tit_inne" v-text="goods.goods_name"></span>
                              </p>
                              <p class="company"  v-if="isshowkucun == 'Y'">
                                  <a href="javascript:;">
                                      <span  v-cloak>可销售:{{goods.sales_info_detail[0].showStockCount?goods.sales_info_detail[0].showStockCount:0}}</span>
                                  </a>
                              </p>                            
                              <p class="price-add">
                                  <span class="price">￥
                                      <span><abbr v-cloak>{{goods.priceNow}}</abbr></span>
                                  </span>
                                  <ul class="a_r_bt">
                                      <li class="a_dd_bt j_add" @click="buy(goods)"></li>
                                  </ul>
                                  <span class="asp" v-if="goods.sales_info_detail[0].advice_sales_price  != null">             
                                          建议零售价:{{goods.sales_info_detail[0].advice_sales_price}}
                                  </span>
                              </p>
                              <!-- <p class="asp" v-if="goods.sales_info_detail[0].advice_sales_price">
                                        建议零售价:{{goods.sales_info_detail[0].advice_sales_price}}
                              </p> -->
                          </dd>
                      </dl>
                  </div>
              </div>
              </mt-loadmore>
              <!-- 加载中icon -->
              <span class="loadIcon" v-if="showLoading">加载中</span>
              <!-- 加载中icon end -->
              <!-- 加载更多 -->
              <div class="l-noData" v-if="allLoaded && !showLoading">
                  <div class="l_nomore">
                      <span>已经全部加载完毕</span>
                  </div>
              </div>
              <!-- 商品列表 -->
              <!-- 商品为空与-->
              <div class="null" v-if="goods_list.length == 0">
                  <p>
                      <img src="static/images/img_search.png">
                  </p>
                  <!-- 点击跳转到首页 -->
                  <a href="#">抱歉，没有找到符合条件的商品！</a>
              </div>
              <!-- 商品为空  end -->
          </section>
          <!--主体-->
          <!-- 购物车  点击跳转到购物车-->
          <!-- <a href="#" class="shopcar j_shopcar_icon">
              <span class='num goods_num' ></span>
          </a> -->
          <!-- 购物车 end -->
          <!-- 搜索列表 -->
          <!-- 滑动菜单 -->
        <div class="slider" v-bind:class="{activ:clickBuy}" v-if="!showLoading">
            <div class="s_flap" @click="hideSlider"></div>
            <div class="s_content">
                <div class="right_main">
                    <!-- 商品详情 -->
                    <dl class="j_goods_item bord_n">
                        <a :href="selectItem.detail_url">
                            <dt class="i_mg active">
                                <img :src="selectItem.photo_url" class="photo" >
                            </dt>
                        </a>
                        <dd>
                            <p class="title">
                                <span class="tit_inne" v-text="selectItem.goods_name"></span>
                            </p>
                            <p style="font-size: 12px;color:#1e90ff;" class="G-g bl" v-if="isshowkucun === 'Y'">可销售：{{selectSpec.showStockCount}}</p>
                            <p class="price-add">
                                <span class="price" style="font-weight:900;font-size:14px;">
                                    <span>￥</span>
                                    <span v-text="selectSpec.sales_price_desc"></span>
                                </span>
                            </p>
                        </dd>
                    </dl>
                    <!-- 商品详情  end -->
                </div>
                <div style="border-bottom:1px solid#eee;height:20px;margin-bottom:10px;"></div>
                <!-- 规格 -->
                <div class="q-g">
                    <div class="sale-wrap">
                        <p class="g_title">销售规格：</p>
                        <p class="g_conte j_gConte">
                            <span class="salesScale" v-for="(item,index) in selectItem.sales_info_detail" :key="item.id" v-if="index<2" v-bind:class="{activ:item.goods_sales_info_id==selectSpec.goods_sales_info_id}"
                                v-on:click="changeSpec(item)" v-text="item.package_specific"></span>
                        </p>
                        <p class="g_conte j_gConte">
                            <span class="salesScale" v-for="(item,index) in selectItem.sales_info_detail" :key="item.id" v-if="index>=2&&index<4" v-bind:class="{activ:item.goods_sales_info_id==selectSpec.goods_sales_info_id}"
                                v-on:click="changeSpec(item)" v-text="item.package_specific"></span>
                        </p>
                        <p class="g_conte j_gConte">
                            <span class="salesScale" v-for="(item,index) in selectItem.sales_info_detail" :key="item.id" v-if="index>=4" v-bind:class="{activ:item.goods_sales_info_id==selectSpec.goods_sales_info_id}"
                                v-on:click="changeSpec(item)" v-text="item.package_specific"></span>
                        </p>
                        <p class="gm_num tx_16">订购数量
                            <span class="tx_12 ml5">(起订量：
                                <span class="rr">{{selectSpec.min_purchased +''+ selectSpec.specific_name}}</span>)
                            </span>
                        </p>
                        <ul class="a_r" style="position:relative;overflow:initial">
                            <li class="add j_goods_reduceS" v-bind:class="{active:Minus}" @click="minus"></li>
                            <li class="input j_goods_numS">
                                <span class="buyNum" v-text="purchaseQit" @click.stop.prevent="modifyNum()"></span>
                            </li>
                            <li class="a_dd j_goods_plusS" @click="plus"></li>
                            <span style="position:absolute;bottom: 3px;left: 160px;">{{selectSpec.specific_name}}</span>
                        </ul>
                    </div>
                </div>
                <!-- 规格 end -->
                <!-- 起订量 -->
                <div class="sub_b">
                    <!-- 起订量 end -->
                    <footer class="detail_footer">
                        <button class="shoucang" @click.prevent="modifyGoodsCollection">
                            <img style="margin:0 auto;" :src="isCollection?'../../../../static/images/ic_shoucang_pre.png':'../../../../static/images/ic_shoucang.png'"
                            />
                            <p style="font-size:14px;">收藏</p>
                        </button>
                        <button style="display:block;width:80%;" class="addshop paye_btn_pd tx_w j_gm_submi" @click.prevent="addShopcart">加入进货单</button>
                    </footer>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
// import {GetQueryString} from '../../../utils';
export default {
  data(){
    return{
      goods_list: [],
      allLoaded: true,
      clickBuy: false, //是否点击购买按钮
      selectItem: {},
      selectSpec: {}, //默认规格
      purchaseQit: 0,
      shopcartAmount: 0.00,
      query: { 
        // barcode: $('input[name=barcode]').val()||undefined, 
        goods_name: undefined, 
        pager: { currentPage: 1, pageSize: 10 } },
      showLoading: false,
      Minus: false,
      search_val: '',
      sp:'',
      minPayMoney:0,
      isCollection:false,
      goods_id:'',
      goodinfos:[],
      salesgoodsid:'',
      qwer:[],
      minNum:'',
      isshowkucun:localStorage.getItem('isShowkucun'),
      keywords:'',//搜索商品
      his_list:[],//搜索历史数据
    }
  },
  methods:{
    //关闭遮罩
    closeSearch: function() {
        var zzc = document.getElementById('container');
        zzc.style.cssText = "transform:translateX(100%);"
        var header = document.getElementById('tbHeader');
        header.style.cssText = "opacity:1;"
        this.keywords = ''//关闭搜索遮罩时候,清空搜索痕迹
    },
    //遮罩层搜索商品
      searchGoods:function(){
        this.query.pager.currentPage = 1;
        this.goods_list = []
        this.loadMore();
        this.query.goods_name = this.keywords;
        if(this.keywords == ''){
          this.$toast("请输入商品名称!")
          return;
        }
        var zzc = document.getElementById('container');
        zzc.style.cssText = "transform:translateX(100%);"
        var header = document.getElementById('tbHeader');
        header.style.cssText = "opacity:1;"
        this.his_list.unshift(this.keywords) //将新增的搜索数据加到数据的最前面
        if(this.his_list.length > 10){
          this.his_list.pop() //当记录大于10的时候删除数组的最后一个元素
        }
        localStorage.setItem('his_list',JSON.stringify(this.his_list))
        this.$router.push(`/shop/home/search_goods_list/${this.keywords}`)//跳转到查询商品展示页面
        this.search_val = this.keywords;
      },
      //点击历史搜索商品
      searchx:function(x){
        // this.loadMore();
        this.query.goods_name = x; 
        this.query.pager.currentPage = 1;
        this.api.getSearchGoods(this.query).then((response) => {
            if ((response.data && response.data.length == 0) || this.query.pager.pageSize > response.data.length) {
                //加载完毕
                this.allLoaded = true;
            } else {
                this.allLoaded = false;
            }
            this.goods_list = []
            response.data.forEach((item,index) =>{
                item.detail_url = 'shop/detail/goods_id=' + item.goods_id+'&goods_sales_info_id=' + item.goods_sales_info_id;
                item.sales_info_detail.forEach((value,index)=>{
                    if(item.goods_sales_info_id == value.goods_sales_info_id){
                    item.priceNow=value.sales_price_desc
                    item.danwei = value.specific_name
                    }
                })
                this.goods_list.push(item);
            });
            //获取购物车金额
            this.getShopcartAmount();
            //   console.log(this.goods_list)
        })
          this.showLoading = false;
          
        //防止多个请求返回顺序不一致,a,b,c请求,c先返回，但是页码还未更新,导致数据重复
        this.query.pager.currentPage = this.query.pager.currentPage + 1; 
              
        var zzc = document.getElementById('container');
        zzc.style.cssText = "transform:translateX(100%);"
        var header = document.getElementById('tbHeader');
        header.style.cssText = "opacity:1;"
        this.keywords = x;
        this.$router.push(`/shop/home/search_goods_list/${this.keywords}`)//跳转到查询商品页面  通过keywords跳 
        this.search_val = x; 
      },
       //点击清除历史记录
      clearHis: function() {
          this.his_list = []
          localStorage.setItem('his_list', '')
      },
    //点击回到搜索
    gotoSearchInput: function() {       
      var zzc = document.getElementById('container');
      zzc.style.cssText = "transform:translateX(0px);"
      var header = document.getElementById('tbHeader');
      header.style.cssText = "opacity:0.1;"
      this.search_val = ''
    },
    //点击启动扫描
    scanbarcode: function() {
        // app.scan();
    },
    // 重置搜索结果
    resetSearch: function() {
        this.showLoading = true;
        this.allLoaded = true;
        //清空之前的数据
        this.goods_list = [];
        this.query.pager.currentPage = 1;
    },
    //顶部刷新
    reload: function() {
        this.resetSearch();
        this.loadMore();
        this.$refs.loadmore.onTopLoaded();
    },
    //加载更多
    loadMore: function() {
      console.log(0)
      this.query.goods_name = this.keywords;
      this.api.getSearchGoods(this.query).then((response) => {
        this.$refs.loadmore.onBottomLoaded();
          if ((response.data && response.data.length == 0) || this.query.pager.pageSize > response.data.length) {
              //加载完毕
              this.allLoaded = true;
          } else {
              this.allLoaded = false;
          }
          response.data.forEach((item,index) =>{
              item.detail_url = 'shop/detail/goods_id=' + item.goods_id+'&goods_sales_info_id=' + item.goods_sales_info_id;
              item.sales_info_detail.forEach((value,index)=>{
                  if(item.goods_sales_info_id == value.goods_sales_info_id){
                  item.priceNow=value.sales_price_desc
                  item.danwei = value.specific_name
                  }
              })
              this.goods_list.push(item);
          });
          //获取购物车金额
          this.getShopcartAmount();
        //   console.log(this.goods_list)
      })
          this.showLoading = false;
          
        //防止多个请求返回顺序不一致,a,b,c请求,c先返回，但是页码还未更新,导致数据重复
        this.query.pager.currentPage = this.query.pager.currentPage + 1;
    },
    //获取购物车数据
    getShopcartAmount:function(amount){
      // shopcart.getShopcartAmount({}).then(function(response) {
      //     this.shopcartAmount = response.data.shopcart_amount;
      // });
    },
    //点击购物车图标购买
    buy: function(item) {
        console.log(item)
        this.clickBuy = true;
        this.isCollection = false
        this.selectItem = item;
        this.selectSpecAll = item.sales_info_detail;
        this.sp = item.sales_info_detail[0].package_specific.split("/")[item.sales_info_detail[0].package_specific.split("/").length - 1]
        //购买数量
        this.selectSpecAll.forEach((value,index) => {
            if(value.goods_sales_info_id == item.goods_sales_info_id){
                this.purchaseQit = value.min_purchased
                this.goodsId = item.goods_id;
                this.selectSpec = value
                this.minNum = value.min_purchased
                this.salesgoodsid = value.goods_sales_info_id
                this.sp = value.package_specific.split("/")[item.sales_info_detail[0].package_specific.split("/").length - 1]
            }
        })
        this.selectItem.detail_url = 'shop/detail/goods_id=' + item.goods_id+ '&goods_sales_info_id=' + item.goods_sales_info_id;
        this.api.yzCollection({
            goodsid: this.selectItem.goods_id
        }).then( (res) => {
            this.isCollection = res.data
        })
    },
    //侧滑页
    hideSlider: function () {
        this.clickBuy = false;
    },
    //最小购买数量
    minus: function () {
        if (this.purchaseQit - 1 == 0) {
            this.$toast("购买数量不能为0!");
            this.Minus = true;
            return
        }
        //必须满足最小购买量
        if (this.purchaseQit > this.minNum) {
            this.purchaseQit = this.purchaseQit - 1;
            this.Minus = false;
            return;
        } else {
            this.$toast("购买数量不能少于" + this.minNum);
            this.Minus = true;
        }
    },
    //最大购买数量
    plus: function () {
        if (this.purchaseQit + 1 > 999999) {
            this.$toast("购买数量不能大于999999!");
            return
        }
        this.purchaseQit = this.purchaseQit + 1;
        this.Minus = false;
    },
    //切换tab
    changeSpec: function (newSpec) {
        this.minNum = newSpec.min_purchased;
        this.selectSpec = newSpec;
        this.purchaseQit = newSpec.min_purchased;
        this.sp = newSpec.package_specific.split("/")[newSpec.package_specific.split("/").length - 1]
    },
    //手动修改商品数量
    modifyNum: function () {
        this.$messagebox.prompt('修改购买数量').then( ({
            value,
            action
        }) => {
            if (action) {
                if (parseInt(value) > 999999) {
                    this.$toast("购买数量不能大于999999");
                    this.purchaseQit = 999999
                    return
                }
                if (parseInt(value) >= this.minNum) {
                    this.purchaseQit = parseInt(value);
                    this.Minus = false;
                } else {
                    this.$toast("购买数量不能少于" + this.purchaseQit);
                    this.purchaseQit = this.minNum
                    return
                    this.Minus = true;
                }
            }
        })
    },
    //添加到购物车
    addShopcart: function () {
        var request_data = {
            goods_sales_info_id: this.selectSpec.goods_sales_info_id,
            goods_qit: this.purchaseQit
        };
        this.api.addShopCart(request_data).then( (response)=> {
            //更新购物车显示
            this.shopcartAmount = response.data.shopcart_amount;
            // app.updateShopcartText(this.formatCartMoney());
            // Toast({
            //     message: '加入进货单成功!',
            //     iconClass: 'icon icon-success'
            // });
            this.$toast('加入进货单成功!')
            this.clickBuy = false;
        });
    },
    //修改商品收藏状态
    modifyGoodsCollection: function () {
        if (this.isCollection) {
            this.api.delGoodsCollection({
                goodsIds: [this.selectItem.goods_id]
            }).then( ()=> {
                this.isCollection = false
            })
        } else {
            this.api.addGoodsCollection({
                goodsid: this.selectItem.goods_id
            }).then( ()=> {
                this.isCollection = true
                this.$toast('收藏成功!')
            })
        }
    },
  },
  created() {
    
  },
  mounted() {
    var list = localStorage.getItem('his_list')
    this.his_list = list ? JSON.parse(list) : []
    this.search_val = decodeURI(location.href.split('/')[1])
    console.log(location.href)
    // if(location.href.indexOf('goods_name')>-1){
    //     this.query.goods_name = decodeURI(location.href.split('=')[1])
    // }
  },
  components:{

  }
}
</script>

<style lang="less" scoped>
*{
    margin: 0;
    padding: 0;
}
#searchGoodsListContainer{
  height: 100%;
  //头部样式
  .header {
    width: 100%;
    min-width: 320px;
    max-width: 768px;
    margin: 0 auto;
    height: 100px;
    line-height: 100px;
    background: linear-gradient(to left, #1e90ff, #4fe4fa);
    color: #333;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-box;
    display: -o-box;
    display: box;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    -webkit-box-orient: horizontal;
    -moz-box-orient: horizontal;
    -ms-box-orient: horizontal;
    -o-box-orient: horizontal;
    box-orient: horizontal;
    .back {
      width: 100px;
      height: 100px;
      display: block;
      background: url(../../../common/images/ic_leftW.png) no-repeat center center;
      background-size: 20%;
    }
    .val {
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      -ms-box-flex: 1;
      -o-box-flex: 1;
      box-flex: 1;
      background: #fff;
      border-radius: 5px;
      height: 70px;
      padding: 0 10px;
      overflow: hidden;
      line-height: 70px;
      margin-top: 12px;
      display: flex;
      align-items: center;
      color: #666;
      position: relative;
    }
    .sousuo{
      width:30px;
      height: 30px;
      position: absolute;
      bottom: 20px;
      left: 20px;
    }
  }
}
.input {
    display: inline-block;
    height: 40px;
    // width:100%;
    background: #B4B2B2;
    line-height: 40px;
    padding: 2px 5px;
    color: #fff;
    margin-left: 50px;
    margin-right: 10px;
}
.close_icon {
    display: inline-block;
    width: 40px;
    height: 40px;
    background: url(../../../common/images/ic_delete.png) no-repeat center;
    background-size: cover;
}
.search {
    width: 100px;
    height: 100px;
    display: block;
    line-height: 100px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    background: url(../../../common/images/scan.png) no-repeat center center;
    background-size: 60%;
}
//主体部分
#content {
    background-color: #eee;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -ms-box-flex: 1;
    -o-box-flex: 1;
    box-flex: 1;
    width: 100%;
    min-width: 320px;
    max-width: 768px;
    margin: 0 auto;
    position: relative;
    top: 100px;
    height: 100%;
    bottom: 0;
    left: 0;
    right: 0;
}
// 上拉加载和下拉加载
.mint-loadmore {
    overflow: initial;
}
.mint-loadmore-bottom {
    margin-bottom: -50px;
    text-align: center;
    height: 50px;
    line-height: 50px;
}
.mint-loadmore-bottom, .mint-loadmore-top {
    text-align: center;
    height: 50px;
    line-height: 50px;
}
.mint-loadmore-top {
    margin-top: -50px;
}
.mint-loadmore-text {
    vertical-align: middle;
}
// .sp{
//     position: realtive;
//     width: 100%;
//     top:50px;
// }
.sp-list {
    position: relative;
    width: 100%;
    top:0px;
    border-bottom: 10px solid #f6f6f6;
}
.sp dl {
    padding: 10px;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-box;
    display: -o-box;
    display: box;
    background: #fff;
    position: relative;
    -webkit-box-orient: horizontal;
    -moz-box-orient: horizontal;
    -ms-box-orient: horizontal;
    -o-box-orient: horizontal;
    box-orient: horizontal;
}
.sp dl dt.active {
    position: relative;
    width: 160px;
    height: 160px;
    margin-top: 5px;
    text-align: center;
    border: 1px solid #eee;
    overflow: hidden;
    margin-right: 10px;
}
.sp dl dt {
    position: relative;
    width: 160px;
    height: 160px;
    text-align: center;
    border: 1px solid #eee;
    overflow: hidden;
    margin-right: 10px;
    img{
      width: 90%;
      border: none;
      display: inline-block;
      vertical-align: top;
      height: 100%;
    }
}
.sp_em {
    width: 70%;
    height: 70%;
    color: #fff;
    line-height: 50px;
    text-align: center;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    top: 8px;
    left: 12px;
    background: rgba(0, 0, 0, .3);
}
.hide {
    display: none!important;
}
.sp dl dd, .right_main dl dd {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -ms-box-flex: 1;
    -o-box-flex: 1;
    box-flex: 1;
}
.sp dl dd .title {
    width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // line-height: 50px;
    font-weight: bold;
    color: #20233d;
}
.company {
    // margin-top: 3px;
}
.sp dl dd .company a {
    color: #1e90ff;
}
.price-add {
    position: absolute;
    bottom: 0;
    width:71%;
    height: 50%;
}
.asp {
    display: block;
    position:absolute;
    bottom: 6px;
    left:0;
    color: #999;
}
.sp dl dd .price {
    color: #ff6754;
    font-weight: bold;
    // line-height: 80px;
}
.a_r_bt {
    position: absolute;
    right: 10px;
    bottom: 23px;
    margin-top: -25px;
    border-radius: 4px;
    overflow: hidden;
}
.a_r_bt li {
    display: inline-block;
    width: 40px;
    height: 40px;
    background: url(../../../common/images/icon-car.png) no-repeat center center;
    background-size: 100% 100%;
}
//加载更多
.l-noData {
    height: 80px;
    line-height: 80px;
    margin: 0 auto;
    position: relative;
    top:0px;
    background: #fff;
    .l_nomore {
        width: 100%;
        position: absolute;
        top: 0;
        text-align: center;
        margin-bottom: 20px;
        span {
            border-radius: 6px;
            color: #999;
            padding: 5px 10px;
        }
    }   
}

//没搜索到商品
.null {
    padding-top: 35%;
    text-align: center;
    width: 100%;
    height: 100%;
    background: #fff;
    img{
      width: 300px;
      border: none;
      display: inline-block;
      vertical-align: top;
      height: 100%;
    }
}
//悬浮购物车图标
.shopcar {
    width: 120px;
    height: 120px;
    position: fixed;
    bottom: 120px;
    left: 60px;
    background: url(../../../common/images/img_car.png) no-repeat center center;
    z-index: 20;
    background-size: 100%;
}
// 侧滑样式
//热销推荐侧滑页样式
.slider.activ {
    right: 0;
}
.slider {
    width: 80%;
    height: 100%;
    position: fixed;
    right: -100%;
    background: #fff;
    top: 0;
    bottom: 0;
    z-index: 105;
    transition: all .2s linear;
    -webkit-transition: all .2s linear;
    border-left: 1px solid #eee;
    z-index: 999;
    color: #464646;
    font-size: 15px;
}
.activ .s_flap {
    width: 25.5%;
    height: 100%;
    position: absolute;
    left: -25.5%;
    background: rgba(0, 0, 0, .2);
    display: block;
}
.right_main {
    width: 100%;
}
.right_main dl {
    padding: 20px;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-box;
    display: -o-box;
    display: box;
    min-height: 100px;
    background: #fff;
    position: relative;
    -webkit-box-orient: horizontal;
    -moz-box-orient: horizontal;
    -ms-box-orient: horizontal;
    -o-box-orient: horizontal;
    box-orient: horizontal;
    border-bottom: 1px solid #eee;
}
.bord_n {
    border: none!important;
}
.right_main dl dt.active {
    position: relative;
    width: 150px;
    height: 150px;
    border: 1px solid #eee;
    padding: 5px;
    text-align: center;
    overflow: hidden;
    margin-right: 10px;
}
.right_main dl dt img {
    width: 100%;
    height: 100%;
}
.right_main dl dd {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -ms-box-flex: 1;
    -o-box-flex: 1;
    box-flex: 1;
}
.right_main dl dd .title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
    // line-height: 20px;
    color: #333;
    font-size: 26px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    max-height: 50px;
}
.tit_inne {
    margin-right: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    display: inline-block;
}
.right_main dl dd .price {
    color: #ff6754;
    font-weight: bold;
    line-height: 20px;
}
.q-g {
    font-size: 24px;
    padding: 10px 10px;
    overflow: scroll;
    position: absolute;
    bottom: 30px;
    top: 250px;
    width: 100%;
}
.g_title {
    font-size:28px;
    padding-bottom: 8px;
}
.g_conte {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
}
.g_conte span.activ {
    background: #1e90ff;
    color: #fff;
}
.g_conte span {
    width: 45%;
    line-height: 24px;
    white-space: pre-wrap;
    height: auto;
    padding: 8px;
    text-align: center;
    margin: 5px;
    display: inline-block;
    border-radius: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 24px;
    margin-right: 10px;
    background: #ccc;
}
.gm_num {
    height: 40px;
    line-height: 40px;
    font-size: 28px;
    width: 56%;
    white-space: nowrap;
    margin-top: 50px;
}
.tx_12 {
    font-size: 22px;
}
.ml5 {
    margin-left: 5px;
}
.rr {
    color: #ff6754;
}
.a_r {
    display: flex;
    top:20px;
    right: 20px;
    left:2px;
    height: 50px;
    border: 1px solid #ccc;
    border-radius: 6px;
    overflow: hidden;
    width: 300px;
}
.a_r li:nth-child(1), .a_r_btn li:nth-child(1) {
    border-right: 1px solid #ccc!important;
    background: url(../../../common/images/r_ole.png) no-repeat center center;
    background-size: 60%;
}
.a_r li:nth-child(2), .a_r_btn li:nth-child(2) {
    flex: 1;
    display: flex;
    justify-content: center;
}
.a_r li:nth-child(3), .a_r_btn li:nth-child(3) {
    border-left: 1px solid #ccc!important;
    background: url(../../../common/images/a_ddic.png) no-repeat center center;
    background-size: 60%;
}
.a_r li, .a_r_btn li {
    display: inline-block;
    width: 50px;
    height: 45px;
    overflow: hidden;
    position: relative;
    float: left;
}
.a_r li .buyNum, .a_r_btn li .buyNum {
    height: 90%;
    width: 100%;
    line-height: 50px;
    color: #000000;
    background: #fff;
    font-size: 22px;
    text-align: center;
    border: none;
    outline: none;
    position: absolute;
    left: 0;
    top: 0;
}
.sub_b {
    width: 100%;
    position: absolute;
    bottom: 0;
}
.detail_footer {
    width: 100%;
    margin: 0 auto;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100px;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-box;
    display: -o-box;
    display: box;
    -webkit-box-orient: horizontal;
    -moz-box-orient: horizontal;
    -ms-box-orient: horizontal;
    -o-box-orient: horizontal;
    box-orient: horizontal;
    background: #fff;
    border-top: 1px solid #eee;
}
.shoucang {
    border: none;
    background: #fff;
    display: flex;//弹性盒子
    align-items: center;//居中对齐弹性盒的各项
    justify-content: center;//项目位于容器的中心
    flex-direction: column;//灵活的项目将垂直显示，正如一个列一样
    width: 20%;
    box-sizing: border-box;
    padding: 5px 0;
    font-size: 14px;
    outline: none;
    img{
       width: 50%;
       border: none;
       display: inline-block;
       vertical-align: top;
       height: 50%; 
    }
}
.detail_footer .addshop {
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: linear-gradient(to left, #1e90ff, #4fe4fa);
    border: none;
    font-size: 28px;
    color: #fff;
}
//搜索框样式
#container {
    display: none;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-box;
    display: -o-box;
    display: box;
    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    -ms-box-orient: vertical;
    -o-box-orient: vertical;
    box-orient: vertical;
    overflow: hidden;
    min-width: 320px;
    max-width: 768px;
    margin: 0 auto;
    transform: translateX(100%);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 999999;
    transform: translateX(100%);
    transition: all .3s;
    background: #000;
    opacity: 0.8;
}
.search_bg {
  display: none;
    background: #000;
    opacity: 0.8;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
}
.searchHeader{
  width: 100%;
  height: 120px;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-box;
  display: -o-box;
  -webkit-box-orient: horizontal;
  border-bottom: 1px solid #eee;
  position: relative;
  .back {
      width: 97px;
      height: 80px;
      margin-top: 15px;
      display: inline-block;
      background: url(../../../common/images/back.png) no-repeat center center;
      background-size: 20%;
  }
}
.zzSearhVal {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -ms-box-flex: 1;
    -o-box-flex: 1;
    box-flex: 1;
    color: #666;
    height: 70px;
    background: #f3f3f3;
    border-radius: 10px;
    margin-top: 20px;
    line-height: 100px;
    padding-left: 15px;
    position: relative;
    input{
      display: block;
      width: 70%;
      height: 50px;
      line-height: 80px;
      margin-top: 10px;
      margin-left: 75px;
      border: none;
      background: none;
      outline: none;
      font-size: 28px;
      text-align: center;
    }
    .sousuo{
      width:30px;
      height: 30px;
      position: absolute;
      bottom: 20px;
      left: 20px;
    }
    .saomiao{
      width:50px;
      height: 50px;
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
}
.search1 {
    width: 95px;
    height: 80px;
    line-height: 115px;
    text-align: center;
    display: inline-block;
    font-size: 28px;
    color: #1e90ff;
}
.content {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -ms-box-flex: 1;
    -o-box-flex: 1;
    box-flex: 1;
    overflow: auto;
}
.hot-search {
    color: #999;
}
.hot-search .title {
    line-height: 80px;
    text-indent: 30px;
    font-size: 28px;
    color: #fff;
}
.hot-search .clear {
    width: 300px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 5px;
    margin: 10px auto;
}
</style>
