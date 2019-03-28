<template>
<!--23143ef83d12c0e61a8a6861cd0d5d480b1 -->
  <div id="homeContainer" v-cloak>
    <header-top></header-top>
    <!-- 搜索栏 -->
    <div id="container" >
      <div class="search_bg"></div>
       <!--头部-->
      <header class="header">
          <a href="javascript:;" class="back search_back" @click="closeSearch"></a>
          <p class="val">
              <img class="sousuo" src="@/common/images/sousuo.png" alt="">
              <input  @keyup.enter="searchGoods"  v-model.trim="keywords" placeholder="商品名称/品牌" class="search_ipt">
              <img class="saomiao" src="@/common/images/ic_scan.png" alt="">
          </p>
          <a href="javascript:;" v-on:click.prevent="searchGoods" class="search">搜索</a>
      </header>
      <!--头部-->

      <!--主体-->
      <section class="content">
          <div class="hot-search">
              <h4 class="title">搜索历史</h4>
              <div class="his-list" style="margin-left:15px;">
                  <p class="p_list" style="color:#fff;border-bottom:1px solid #fff;height:30px;line-height:30px;" v-for="(x,index) in his_list" :key="index" v-text="x" @click="searchx(x)"></p>
              </div>
              <p class="clear" id="clear" @click="clearHis">清空搜索历史</p>
          </div>
      </section>
    </div>

    <!-- 轮播图部分 -->
    <mt-swipe :auto="3000">
      <mt-swipe-item v-for="(item,index) in lunbotuList" :key="index">
        <img :src="item.photoUrl" alt="" @click="gotoDetail(item.refId)">
      </mt-swipe-item>
    </mt-swipe>
    

    <!-- 分类导航栏 -->
    <div class="fl border_bottom" style="position:relative;">
        <div class="fl-menu">
            <dl v-for="(tag,index) in tags" :key="index">
                <router-link :to="{path:'/shop/base/category/'+index}">
                    <dt v-bind:style="{'background-image':'url('+tag.img+')'}"></dt>
                    <dd v-text="tag.desc" style="l"></dd>
                </router-link>
            </dl>
            <dl>
                <router-link :to="{path:'/shop/home/promotion'}">
                    <dt class="proImg"></dt>
                    <dd v-text="'促销活动'"></dd>
                </router-link>
            </dl>
        </div>
    </div>
    
    <!--全网优惠  -->
    <div id="youhuiBox" @click="showOrderDesc=true">
      <img src="../../../common/images/img_youhui.png" style="height:8vw;">
      <ul class="manzeng">
          <li v-text="pList[pIdx]?pList[pIdx].promotion_type_name:''" style="font-size: 12px;"></li>
      </ul>
      <div class="arow">
          <img src="@/common/images/arrow-right.png" alt="">
      </div>
    </div>

    <!-- 优惠说明 -->
    <div class="yhsm" v-bind:class="{active:showOrderDesc}">
        <div class="yhsm_b" @click.prevent="showOrderDesc=false"></div>
        <!-- 使用active控制滑出 ↓-->
        <div class="yhsm_c" v-bind:class="{active:showOrderDesc}">
            <h5 style="height:50px;line-height:50px;" class="yhsm_title">全网优惠说明
                <i @click.prevent="showOrderDesc=false" style="font-size:28px;float:right;margin-right:20px;">×</i>
            </h5>
            <div class="yhsm_con" style="padding:0;">
                <div v-for="(item,index) in pList" :key="index" style="border-bottom:1px solid #eee;padding:15px 25px">
                    <p style="font-size: 14px;color:#444343;" v-text="item.promotion_type_name"></p>
                    <p style="color:#666;font-size:12px;position:relative;" v-text="item.promotiona_detail"></p>
                </div>
                <br>
                <br>
                <br>
            </div>
            <a href="javascript:;" class="yhsm_btn" @click.prevent="showOrderDesc=false">确定</a>
        </div>
    </div>





    <!-- 促销推荐 -->
    <div v-show='promotionRecommendList.length > 0'  id="promotionRec">
      <div class="tit bl" style="border: 0px;">
        - 促销推荐 -
        <span class="tit_link f9" @click="gotoPro">更多促销
        <img style="vertical-align: center;" src="@/common/images/ic_more.png" class="youhui_icon"></span>
      </div>
      <div class="swiper-container cx_swiper" v-if="promotionRecommendList.length>0">
          <div class="swiper-wrapper">
              <div class="swiper-slide s_pic" @click="gotoProDetail(item.promotionId,item.promotionType)" style="width:150px;height:148px;" v-for="(item,index) in promotionRecommendList" :key="index">
                  <p style="text-align:center;font-size:14px;" v-text="item.promotionRuleDesc"></p>
                  <div class="img_div">
                      <img class="left" style="width:53%;height:80px;" :src="item.recommendGoodsVOs[0].goodsImgUrl">
                      <div class="right">
                          <img style="width:40px;height:40px;" :src="item.recommendGoodsVOs.length>1?item.recommendGoodsVOs[1].goodsImgUrl:item.recommendGoodsVOs[0].goodsImgUrl">
                          <img style="width:40px;height:40px;" :src="item.recommendGoodsVOs.length>2?item.recommendGoodsVOs[2].goodsImgUrl:(item.recommendGoodsVOs.length>1?item.recommendGoodsVOs[1].goodsImgUrl:item.recommendGoodsVOs[0].goodsImgUrl)">
                      </div>
                  </div>
                  <p class="bl" v-text="'‘'+item.promotionDesc+'’'"></p>
              </div>
              <div class="swiper-slide moreSlide" style="width:150px;height:148px;" v-if="promotionRecommendList.length>2" @click="gotoPro">
                  <span>查看更多</span>
                  <span>view more</span>
                  <img style="width:12px;height:16px;" src="@/common/images/ic_more_blue.png" />
              </div>
          </div>
      </div>
    </div>







    <!--热销推荐 -->
    <div v-bind:class="[promotionRecommendList.length > 0 ? 'border_bottom' : 'border_bottom20', 'sp pos_rel']">

        <div class="tit rr">
            - 热销商品 -
            <router-link tag="span" class="tit_link f9" :to="{path:'/shop/base/category'}">
              <!-- 更多 -->
                <!-- <img class="youhui_icon" src="@/common/images/ic_more.png" /> -->
            </router-link>
        </div>

        <mt-loadmore :bottom-all-loaded="allLoaded" ref="loadmore">
            <div class="sp-list" v-show="goods_list.length > 0">
                <dl class="j_goods_item" v-for="(goods,index) in goods_list" :key='index'>
                    <router-link :to="{path:'/shop/detail',query:{goods_id:goods.goods_id}}">
                      <dt class="i_mg active">
                          <img :src="goods.photo_url" class="photo">
                      </dt>
                    </router-link>

                    <dd>
                        <p class="title" v-text="goods.goods_name"></p>
                        <p class="company" v-if="isshowkucun === 'Y'">
                            <a href="javascript:;">
                            <span style="font-size:10px;color:#999">可销售：{{goods.sales_info_detail[0].showStockCount?         goods.sales_info_detail[0].showStockCount + goods.sales_info_detail[0].specific_name:0}}</span>
                            </a>
                        </p>
                        <p class="company" v-if="goods.sales_info_detail.length > 1"></p>
                        
                          <p class="price-add">
                            <i class="price" style="color:red;font-size:10px;font-style:normal">￥
                                <span v-text="goods.priceNow" ></span>
                                <span style="font-size:10px;color:#666;font-style:normal"         v-if="goods.sales_info_detail[0].advice_sales_price != null">
                                 (建议零售价:￥{{goods.sales_info_detail[0].advice_sales_price|formatMoney}}/{{goods.sales_info_detail[0].specific_name +")"}}</span>
                            </i>
                          </p>

                         <ul class="a_r_bt">
                              <li class="a_dd_bt j_addBt" @click="buy(goods)"></li>
                         </ul>

                          
                    </dd>
                </dl>
            </div>
        </mt-loadmore>
        <!-- 加载中icon -->
        <span class="loadIcon" v-if="showLoading">加载中</span>
        <!-- 加载中icon end -->
        <!-- 加载更多 -->
        <div class="l-noData" style="height:50px;margin:0 auto;position:relative;top:0;background-color:#fff;" v-if="allLoaded && !showLoading">
            <div class="l_nomore" style="width:100%;position:absolute;top:15px;text-align:center;margin-bottom: 10px;">
                <span style="border-radius:6px;color:#999;">正在加载中...</span>
            </div>
        </div>
    </div>
    <!-- 热销推荐点击购物车展示侧滑页 -->
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
                        <span class="salesScale" v-for="(item,index) in selectItem.sales_info_detail" :key="index" v-if="index<2" v-bind:class="{activ:item.goods_sales_info_id==selectSpec.goods_sales_info_id}"
                            v-on:click="changeSpec(item)" v-text="item.package_specific"></span>
                    </p>
                    <p class="g_conte j_gConte">
                        <span class="salesScale" v-for="(item,index) in selectItem.sales_info_detail" :key="index"  v-if="index>=2&&index<4" v-bind:class="{activ:item.goods_sales_info_id==selectSpec.goods_sales_info_id}"
                            v-on:click="changeSpec(item)" v-text="item.package_specific"></span>
                    </p>
                    <p class="g_conte j_gConte">
                        <span class="salesScale" v-for="(item,index) in selectItem.sales_info_detail" :key="index" v-if="index>=4" v-bind:class="{activ:item.goods_sales_info_id==selectSpec.goods_sales_info_id}"
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
                        <span style="position:absolute;width:100px;bottom: 3px;left: 160px;">{{selectSpec.specific_name}}</span>
                    </ul>
                </div>
            </div>
            <!-- 规格 end -->
            <!-- 起订量 -->
            <div class="sub_b">
                <!-- 起订量 end -->
                <footer class="detail_footer">
                    <!-- <button class="shoucang" @click.prevent="modifyGoodsCollection">
                        <img style="margin:0 auto;" :src="isCollection?'../../../../static/images/ic_shoucang_pre.png':'../../../../static/images/ic_shoucang.png'"
                        />
                        <p style="font-size:14px;">收藏</p>
                    </button> -->
                    <button style="display:block;width:100%;" class="addshop paye_btn_pd tx_w j_gm_submi" @click.prevent="addShopcart">加入进货单</button>
                </footer>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { swiper, swiperSlide } from 'vue-awesome-swiper'//按需导入轮播图组件
import { Loadmore } from 'mint-ui';
import headerTop from '@/base/header/header'
import Bus from '@/store/bus.js'
  export default {
    data() {
      return {
        lunbotuList:[], //保存轮播图的数组
        promotionRecommendList: [],//促销推荐数组
        goods_list:[],//热销推荐数组
        pList:[],//优惠列表
        pIdx: 0,
        showOrderDesc: false,
        allLoaded: true,
        showLoading:true,
        isshowkucun:'',
        tags: {},//分类数据
        query: {
          pager: {
              currentPage: 1,
              pageSize: 10
          }
        },
        keywords:'',//搜索商品
        his_list:[],//搜索历史数据
        isCollection:false,
        clickBuy: false, //是否点击购买按钮
        selectItem: {},
        selectSpec: {}, //默认规格
        sp: '',
        purchaseQit: 0,
        purchaseQid:'',
        minNum:'',
        Minus: false,
        shopcartAmount: 0.00,
      };
    },
    filters:{
      formatMoney(val) {
        if(!isNaN(val)) {
          return val.toFixed(2);
        }
      }
    },
    created() {
      this.getLunbotu();
      this.promotionRecList();
    },

    destroyed(){
        Bus.$off('toSearch');
    },

    mounted(){
      var list = localStorage.getItem('his_list')
      this.his_list = list ? JSON.parse(list) : []
      this.isShowkucun();
      this.promotionInfoList();
      this.loadMore();
      this.homePageTagData();
      // this.closeSearch();//关闭搜索遮罩方法

     Bus.$on('toSearch', (e) => {
           this.openSearch();
         })
    },
    methods:{
      openSearch:function() {
          var zzc = document.getElementById('container');
          zzc.style.cssText = "transform:translateX(0px);"
          var header = document.getElementById('headerContainer');
          header.style.cssText = "opacity:0.1;"
      },
      gotoDetail(id) {
        this.$router.push({path:'/shop/detail',query:{goods_id:id}})
      },
        isShowkucun:function(){
            this.api.isShowkucun({}).then( (response)=> {
                // console.log(response.data)
                this.isshowkucun = response.data.isStockOpen;
                localStorage.setItem('isShowkucun',response.data.isStockOpen);
                console.log(this.isshowkucun)
            });
        },
      //关闭遮罩
      closeSearch: function() {
          var zzc = document.getElementById('container');
          zzc.style.cssText = "transform:translateX(100%);"
          var header = document.getElementById('headerContainer');
          header.style.cssText = "opacity:1;"
          this.keywords = ''//关闭搜索遮罩时候,清空搜索痕迹
      },
      //遮罩层搜索商品
      searchGoods:function(){
        this.api.getSearchGoods({goods_name:this.keywords,pager:this.query.pager}).then(res=>{

        })
        if(this.keywords == ''){
          this.$toast("请输入商品名称!")
          return;
        }
        var zzc = document.getElementById('container');
        zzc.style.cssText = "transform:translateX(100%);"
        var header = document.getElementById('headerContainer');
        header.style.cssText = "opacity:1;"
        this.his_list.unshift(this.keywords) //将新增的搜索数据加到数据的最前面
        if(this.his_list.length > 10){
          this.his_list.pop() //当记录大于10的时候删除数组的最后一个元素
        }
        localStorage.setItem('his_list',JSON.stringify(this.his_list))
        this.$router.push(`/shop/home/search_goods_list/${this.keywords}`)//跳转到查询商品展示页面
      },
      //点击历史搜索商品
      searchx:function(x){
        var zzc = document.getElementById('container');
        zzc.style.cssText = "transform:translateX(100%);"
        this.keywords = x;
        this.$router.push(`/shop/home/search_goods_list/${this.keywords}`)//跳转到查询商品页面  通过keywords跳  
      },
      //点击清除历史记录
      clearHis: function() {
          this.his_list = []
          localStorage.setItem('his_list', '')
      },
      //获取轮播图data
      getLunbotu(){
          this.api.lunbotu({}).then(result =>{
              console.log(result.data);
              this.lunbotuList = result.data; 
          });
      },
      //获取分类数据
      homePageTagData(){
        this.api.getHomePageTag({}).then(result=>{
            this.tags = []
            result.data.forEach((item,index)=>{
              item.img = "static/" + item.tag_code + ".png";
              if (item.tag_code == 'hot') {
                item.desc = '热销商品'
                this.tags[0] = item
              }
              if(item.tag_code == 'recommend'){
                item.desc = '精品推荐'
                this.tags[1] = item
              }
              if(item.tag_code == 'new'){
                item.desc = '新品上架'
                this.tags[2] = item
              }
            })
        })
      },
      //获取促销商品数据
      promotionRecList(){
         this.api.getPromotionRecList({}).then(result =>{
              consle.log(result);
              this.promotionRecommendList = result.data.promotionRecommendList;
              sessionStorage.setItem("isHavaPromotion",this.promotionRecommendList.length > 0)
          });
      },
      //获取首页全网优惠
      promotionInfoList(){
         this.api.getPromotionInfoList({}).then(result =>{
           console.log(result);
              this.pList = result.data; 
              setInterval(function () {
                  if (this.pIdx < result.data.length - 1) {
                      this.pIdx = this.pIdx + 1
                  } else {
                      this.pIdx = 0
                  }
              }, 5600)
          });
      },
      //获取热销推荐数据
      loadMore:function(){
        this.api.getHomeRecommendGoods(this.query).then(result =>{ 
          this.$refs.loadmore.onBottomLoaded();
            if ((result.data && result.data.length == 0) || this.query.pager.pageSize > result.data.length) {
              //加载完毕
              this.allLoaded = true;
              
            } else {
              this.allLoaded = false;
            }
            result.data.forEach((item,index)=> {
              item.detail_url = '/h5/kxdh/goods/gotoGoodsDetail.do?goods_id=' + item.goods_id+'&goods_sales_info_id=' + item.goods_sales_info_id;
              item.sales_info_detail.forEach((value,index)=>{
                  if(item.goods_sales_info_id == value.goods_sales_info_id){
                    item.priceNow=value.sales_price_desc
                    item.danwei = value.specific_name
                  }
              })
              this.goods_list.push(item);
          });
          this.showLoading = false;
        })
        //防止多个请求返回顺序不一致,a,b,c请求,c先返回，但是页码还未更新,导致数据重复
        this.query.pager.currentPage = this.query.pager.currentPage + 1;
      },
      reload: function () {
          this.resetSearch();
          this.loadMore();
          this.$refs.loadmore.onTopLoaded();
      },
      resetSearch: function () {
          this.showLoading = true;
          this.allLoaded = true;
          //清空之前的数据
          this.goods_list = [];
          this.query.pager.currentPage = 1;
      },
      //点击跳转促销页面
      gotoPro: function () {
          this.$router.push('/shop/home/promotion')
      },
      //跳转到分类
      gotoCategory: function (tag) {
          if (tag.tag_code == 'promotion') {
              //促销跳转
              this.$router.push('')
          } else if (!tag) {
              this.$router.push('')
          } else {
              this.$router.push('')
          }
      },
      //点击热销推荐购物车图标跳转购买页面
      buy:function(item){
          this.clickBuy = true;
          this.isCollection = false;
          this.selectItem = item;
          this.selectSpecALL = item.sales_info_detail;
          this.sp = item.sales_info_detail[0].package_specific.split("/")[item.sales_info_detail[0].package_specific.split("/").length - 1]
          //购买数量
          this.selectSpecALL.forEach((val)=>{
              if (val.goods_sales_info_id == item.goods_sales_info_id) {
                  this.purchaseQit = val.min_purchased;
                  this.purchaseQid = val.min_purchased;
                  this.goodsId = item.goods_id;
                  this.salesprice = val.sales_price_desc;
                  this.selectSpec = val;
                  this.min_Num = val.min_purchased;
                  this.sp = val.package_specific.split('/')[item.sales_info_detail[0].package_specific.split("/").length - 1]
              }
          })
          this.selectItem.detail_url = '/h5/kxdh/goods/gotoGoodsDetail.do?goods_id=' + item.goods_id + '&goods_sales_info_id=' + item.goods_sales_info_id;
          this.api.yzCollection({goodsid:this.selectItem.goods_id}).then((res)=>{
              this.isCollection = res.data;
          })
      },
      hideSlider: function () {
        this.clickBuy = false;
      },
      changeSpec: function (newSpec) {
        this.minNum = newSpec.min_purchased;
        this.selectSpec = newSpec;
        this.purchaseQit = newSpec.min_purchased;
        this.sp = newSpec.package_specific.split("/")[newSpec.package_specific.split("/").length - 1]
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
        //添加到购物车
        addShopcart: function () {
            var request_data = {
                goods_sales_info_id: this.selectSpec.goods_sales_info_id,
                goods_qit: this.purchaseQit
            };
            this.api.addShopCart(request_data).then( (response)=> {
                if(response.callStatus == 'SUCCESS') {
                  //更新购物车显示
                  this.shopcartAmount = response.data.shopcart_amount;
                  // app.updateShopcartText(this.formatCartMoney());
                  // Toast({
                  //     message: '加入进货单成功!',
                  //     iconClass: 'icon icon-success'
                  // });
                  this.$toast('加入进货单成功!')
                  this.clickBuy = false;
                  
                  this.bus(response.data)
                } else {
                  this.$toast(response.message)
                }
            });
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

        bus(num) {
          console.log(num)
          Bus.$emit('getAmount', num)
        },

        gotoProDetail(id,type) {
          if(type == 'ZHCX') {
            this.$router.push({
              path:`/shop/home/zh_promotion_detail/${id}`
            })
          } else {
            path:`/shop/home/dp_promotion_detail/${id}`
          }
        }
    },
    components:{
      swiper,
      'header-top':headerTop
    }
  }
</script>

<style lang="less" scoped>
*{
  // font-family: "微软雅黑";
  margin:0;
  padding: 0;
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
    z-index: 11;
    transform: translateX(100%);
    transition: all .3s;
    background: #000;
    opacity: 0.8;
}
#container .search_bg {
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
#container .header{
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
#container .val {
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
#container .search {
    width: 95px;
    height: 80px;
    line-height: 115px;
    text-align: center;
    display: inline-block;
    font-size: 28px;
    color: #1e90ff;
}
#container .content {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -ms-box-flex: 1;
    -o-box-flex: 1;
    box-flex: 1;
    overflow: auto;
}
#container .hot-search {
    color: #999;
}
#container .hot-search .title {
    line-height: 80px;
    text-indent: 30px;
    font-size: 28px;
    color: #fff;
}
#container .hot-search .clear {
    width: 300px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 5px;
    margin: 10px auto;
}

#homeContainer{
  [v-cloak]{ display:none}//解决插值表达是的闪烁的问题
  position: absolute;
  top: 100px;
  width: 100%;
  height: 375px;
  background-color: #fff;
  .mint-swipe {
    height: 375px;
    .mint-swipe-item {
      font-size: 26px;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}


// 中间导航栏样式
.fl {
    height: 150px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #fff;
}

.fl .fl-menu {
    position:absolute;
    top:0;
    width: 100%;
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
    margin-top: 10px;
}
.fl .fl-menu dl {
    margin-top:20px;
    width: 25%;
    text-align: center;
}
.fl .fl-menu dl dt {
    width: 60px;
    height: 60px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin: 0 auto;
}
.proImg{
    background-image:url(../../../common/images/promotion.png)
}

.fl .fl-menu dl dd {
    line-height: 50px;
    color: #666;
}

//全网优惠
  //定义li的动画
  @keyframes rotateWord {
    0% {
        opacity: 1;
    }
    6% {
        opacity: 0;
        transform: translateY(-3px);
    }
    7% {
        opacity: 0;
        transform: translateY(0px);
    }
    10% {
        opacity: 0;
        transform: translateY(3px);
    }
    15% {
        opacity: 1;
        transform: translateY(0px);
    }
    100% {
        opacity: 1;
    }
}
#youhuiBox{
  position: relative;
  width: 100%;
  padding-left: 27px;
  margin-top: 2.667vw;
  background-color:#fff;
//   border-bottom: 1px solid #eee;

  .manzeng{
    position: absolute;
    height: 90px;
    width: 200px;
    display: inline-block;
    li{
      display: inline-block;
      line-height: 90px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #666;
      animation: rotateWord 5s linear infinite 0s;
      animation-delay: 1s;  
    }
  }
  .arow{
    display: none;
    position: absolute;
    top: 30%;
    right: 5%;
    img{
      width: 20px;
    }
  }
}
//优惠说明
.yhsm.active {
    display: block;
    z-index: 9999;
}
.yhsm {
    width: 100%;
    height: 100%;
    max-width: 768px;
    margin: 0 auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: none;
    z-index: 10;
    .yhsm_b {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .6);
  }
}
.yhsm_c.active {
    bottom: 0;
}
.yhsm_c {
    width: 100%;
    background: #fff;
    position: fixed;
    left: 0;
    z-index: 3;
    transition: all .3s linear;
    -webkit-transition: all .3s linear;
    .yhsm_title {
      height: 50px;
      color: #666;
      line-height: 50px;
      text-align: center;
      font-size: 28px;
      border-bottom: 1px solid #eee;
      font-weight: normal;
      .yhsm_title i {
        text-align: center;
        font-size: 24px;
        font-style: normal;
    }
  }
  .yhsm_con {
    width: 100%;
    padding: 0 20px 20px 20px;
    line-height: 50px;
    min-height: 350px;
    max-height: 600px;
    overflow-y: auto;
  }
}
.yhsm_btn {
    width: 100%;
    height: 90px;
    background: linear-gradient(to left, #1e90ff, #4fe4fa);
    color: #fff;
    font-size: 30px;
    text-align: center;
    line-height: 90px;
    display: block;
}

//促销推荐
#promotionRec{
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 310px;
  margin-top: 2.667vw;
  background-color:#fff;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  .tit{
    height: 80px;
    text-align: center;
    line-height: 80px;
    font-size: 30px;
    background: #fff;
    color: #1e90ff;
    .tit_link {
      position: absolute;
      right: 24px;
      top: 0;
      font-size: 24px;  
    }
    .f9 {
      color: #999;
    }
    img{
      margin-top: 15px;
      margin-left: 5px;
      height: 24px;
      margin-right: 12px;
    }
  }
}
//中间滚动区域
.cx_swiper {
  padding: 10px;
  background: #fff;
  padding-top: 0;
  }
.swiper-container {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }
.swiper-wrapper {
  transition-duration: 0ms;
  transform: translate3d(0px, 0px, 0px);
  overflow-x: auto;
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  box-sizing: content-box;
  .swiper-slide {
    margin-left: 12px;
    flex-shrink: 0;
    position: relative;
    width: 150px;
    height: 148px;
    padding: 0 10px;
    border: 1px solid #f1f1f1;
    .img_div {
      position: relative;
      width: 100%;
      height: 80px;
    }
  }
}
.cx_swiper .swiper-slide > p:nth-of-type(1){
  line-height: 36px;
  color:#666;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-top: 20px;
  padding-bottom: 10px;
}
.cx_swiper .swiper-slide > p:nth-of-type(2){
  line-height: 34px;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-top: 5px;
}
.bl {
    font-size: 24px;
    color: #1e90ff;
}      
.moreSlide {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    color: #1e90ff;
    position: relative;
    font-size: 14px;
    padding: 65px 0!important;
    img {
      position: absolute;
      width: 12px;
      height: 16px;
      right: 15px;
      top: 45%;
    }
    span:nth-of-type(1) {
      padding-top: 60px;
      font-size: 28px;
      border-bottom: 1px solid #1e90ff;
    }
    span:nth-of-type(2) {
      padding-bottom: 60px;
      padding-top: 10px;
      font-size: 28px;
    }
}
.right{
  position: absolute;
  float: right;
  height: 80px;
  width: 40px;
  display: inline-block;
  img{
    width: 40px;
    height: 40px;
    margin-bottom: 1px;
    float: left;
    border: none;
    display: inline-block;
    vertical-align: top;
  }
}
.left {
  width: 80px;
  height: 80px;
  margin-right: 8px;
  float: left;
  display: inline-block;
  img{
    border: none;
    display: inline-block;
    vertical-align: top;
  }
}



//热销推荐样式
// 标题
// .border_bottom {
//   position:relative;
//   top:100px;
//   border-bottom: 1px solid #eee;
// }

// .border_bottom20 {
//   position:relative;
//   top:20px;
//   border-bottom: 1px solid #eee;
// }



.sp{

  dl{
    box-shadow: 0 8px 8px 0 rgba(0,0,0,0.1);
    transition: 0.3s;
    border-radius: 5px;

    padding: 20px;
    margin:20px;
    display: -webkit-box;
    height: 190px;
    background: #fff;
    position: relative;
    -webkit-box-orient: horizontal;

    dt{
      display: flex;
      display: -webkit-flex;
      position: relative;
      width:170px;
      height: 150px;
      overflow: hidden;
      img{
        width: 150px;
        border: none;
        display: inline-block;
        vertical-align: center;
        height: 150px;
      }
    }
    dd > .title{
        margin-right: 150px;
        color: #121212;
        font-size: 24px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden; 
      }
    
    dd >.company{
      margin-top: 3px;
      a{
        color: #1e90ff;
        span{
          font-size: 13px;
        }
      }
    }


    dd >.price-add{
      position: absolute;
      margin-right: 55px;
      .price{
        color: #ff6754;
        font-size: 26px;
        font-style: normal;
        span{
          font-size: 26px;
        }
      }
    }
  }
}

.a_r_bt {
    position: absolute;
    right: 20px;
    bottom: 35px;
    // margin-top: -250px;
    border-radius: 4px;
    overflow: hidden;
    list-style: none;
    li{
      margin-bottom:-10px;
      display: inline-block;
      width: 50px;
      height: 50px;
      background: url(../../../common/images/icon-car.png) no-repeat center center;
      background-size: 50px 50px;
    }
}

.pos_rel {
    background: #F7F7F7;
    position: relative;
    .rr{
      color:#000;
      font-size: 30px;
    }
    .tit{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 30px;
    font-weight: bold;
    padding-top: 25px;
    background: #F7F7F7;
    .tit_link {
        position: absolute;
        right: 40px;
        top: 0;
        font-size: 24px;
        color: #999;
        img {
          margin-top: 15px;
          margin-left: 5px;
          height: 24px;
          display: inline-block;
          margin-right: 12px;
          vertical-align: center;
        }
      }
    }
}
// 商品列表
.mint-loadmore {
    overflow: hidden;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.mint-loadmore-content {
  transform: translate3d(0px, 0px, 0px);
}
.mint-loadmore-top {
    margin-top: -50px;
    text-align: center;
    height: 50px;
    line-height: 50px;
}
.mint-loadmore-text {
    vertical-align: middle;
    box-sizing: border-box;
}
.loadIcon {
    width: 80px;
    height: 80px;
    z-index: 10000000;
    margin-left: -20px;
    text-indent: -9999px;
    position: absolute;
    top: 90px;
    left: 50%;
    background: url(../../../common/images/a-loading01.gif) no-repeat center;
    background-size: 80%;
}
.l-noData {
    height: 40px;
    margin: 0 auto;
    position: relative;
    bottom: 0;
}

.l_nomore {
    width: 100%;
    position: absolute;
    top: 30px;
    text-align: center;
    margin-bottom: 10px;
}
.l_nomore span {
    border-radius: 6px;
    color: #999;
    padding: 10px 20px;
}
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
    padding: 10px;
    text-align: center;
    overflow: hidden;
    margin-right: 10px;
}
.right_main dl dt img {
    width: 90%;
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
    /* text-overflow: ellipsis; */
    /* white-space: nowrap; */
    line-height: 30px;
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

.price-add {
    position: absolute;
    bottom: 20px;
    // top: 145px!important;
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
    height: 50px;
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
</style>