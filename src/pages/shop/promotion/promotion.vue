<template>
    <div id="j_container">
        <!--头部-->
      <div style="position:fixed;top:0;height:113px;left:0;right:0;z-index:9999;">
          <header id="headerN">
              <a href="javascript:history.go(-1);" class="backN"></a>
              <span style="font-size:14px;">促销优惠</span>
              <a href="javascript:;" class="gotoShopcar" @click="gotoShopcar"></a>
              <em class="shopCarNum" ></em>
          </header>
          <!-- 头部 end -->
          <div class="d_sub d_tit">
              <span style="margin: 0 30px;" class="sub" v-bind:class="{cur:promotion_type == 'DPCX'}"  @click="changeProtionType('DPCX')">
                <img  v-if="promotion_type == 'DPCX'" src="../../../common/images/ic_select.png"/>
                <span style="font-size:14px;" v-bind:class="{active:promotion_type == 'DPCX'}">单品促销</span>
              </span>
              <span style="margin: 0 30px;" class="sub"  v-bind:class="{cur:promotion_type == 'ZHCX'}" @click="changeProtionType('ZHCX')">
                <img  v-if="promotion_type == 'ZHCX'" src="../../../common/images/ic_select.png" />
                <span style="font-size:14px;" v-bind:class="{active:promotion_type == 'ZHCX'}">组合促销 <i class="icon-caret-down"></i></span>
              </span>
          </div>
          <div class="d_sub sub_tit" >
              <span class="sub" v-bind:class="{cur:filter_tag == 'MAIZENG'}" @click="filter_tag='MAIZENG'">
                <a href="#" class="activ">满赠</a>
              </span>
              <span class="sub" v-bind:class="{cur:filter_tag == 'MAIJIAN'}" @click="filter_tag='MAIJIAN'">
                <a href="#" class="activ">满减 </a>
              </span>
              <span class="sub" v-bind:class="{cur:filter_tag == 'MANZENG'}" @click="filter_tag='MANZENG'">
                <a href="#" class="activ">每满赠</a>
              </span>
              <span class="sub" v-bind:class="{cur:filter_tag == 'MANJIAN'}" @click="filter_tag='MANJIAN'">
                <a href="#" class="activ">每满减</a>
              </span>
          </div>
      </div>
      <!--主体-->
      <section>
          <div id="DPMZ" style="height:130px;"></div>

          <!-- 组合促销列表 -->
          <div class="zhsp" v-if="promotion_type == 'ZHCX'"  style="overflow: hidden;margin-top: 41px;">

             <div class="empty" v-if="showEmpty">
                  <img src="@/common/images/empty.png" class="img-empty">
             </div>

              <h2 v-if="promotion_list_map.MZ.length>0">组合满赠</h2>
              <div :id="promotion_list_map.MZ.length==idx+1?'DPMJ':''" :class="{bb0:promotion_list_map.MZ.length==idx+1}" v-show="promotion_list_map.MZ.length >0" v-for="(promotion,idx) in promotion_list_map.MZ" :key="promotion.id" class="sp-list bg_f">
                  <!-- 组合满赠 -->
                  <div class="old_order p5 pos_rel mb0 pb0">
                      <span class="order_num"><span class="dpmzSpan"  v-text="promotion.promotionName"></span>  </span>
                      <p class="order_list tp3" @click.prevent="showDescDialog(promotion.promotionName,promotion.promotionDesc)">
                        <span class="">促销说明</span>
                        <img src="../../../common/images/goto.png">
                      </p>
                  </div>
                  <div style="height:140px;position:relative;">
                      <div @click.prevent="gotoPromotionDetail(promotion.id)" style="background:url('static/img_xiangqing.png') no-repeat center;background-size:cover;position:absolute;top:13px;right:0;width:97px;height:108px;z-index: 9;"></div>
                  </div>
                  <div style="height:120px;position:absolute;top:43px;left:0;right:88px;overflow-x:auto;overflow-y: hidden;">
                      <div style="height:120px;" :style="{width:promotion.goodsSalesInfoDetailVOForPromotionList&&promotion.goodsSalesInfoDetailVOForPromotionList.length>0?(promotion.goodsSalesInfoDetailVOForPromotionList.length*130)+'px':'100%'}">
                          <div class="i_mg active" style="float: left;height:120px;margin-right:10px;" v-for="goods in promotion.goodsSalesInfoDetailVOForPromotionList" :key="goods.goods_id">
                              <img @click="gotoGoodDeatil(goods.goods_id,goods.specificationId)"  :src="goods.photo_url" onerror="this.src='static/404.png'" class="photo" style="width: 108px;height: 108px;position:relative;top:13px;">
                          </div>
                      </div>
                  </div>
                  <!-- 组合满赠 -->
              </div>
              <h2 v-if="promotion_list_map.MJ.length>0">组合满减</h2>
              <div :id="promotion_list_map.MJ.length==idx+1?'DPMMZ':''" :class="{bb0:promotion_list_map.MJ.length==idx+1}" v-show="promotion_list_map.MJ.length >0" 
                  v-for="(promotion,idx) in promotion_list_map.MJ" :key="promotion.id" class="sp-list bg_f">
                  <!-- 组合满减 -->
                  <div class="old_order p5 pos_rel mb0 pb0">
                      <span class="order_num"><span class="dpmzSpan" v-text="promotion.promotionName"></span> </span>
                      <p class="order_list tp3" @click.prevent="showDescDialog(promotion.promotionName,promotion.promotionDesc)">
                        <span class="">促销说明</span>
                        <img src="../../../common/images/goto.png">
                      </p>
                  </div>
                  <div style="height:140px;position:relative;">
              
                      <div @click.prevent="gotoPromotionDetail(promotion.id)" style="background:url('static/img_xiangqing.png') no-repeat center;background-size:cover;position:absolute;top:13px;right:0;width:97px;height:108px;z-index: 9;"></div>
                  </div>
                  <div style="height:120px;position:absolute;top:43px;left:0;right:88px;overflow-x:auto;overflow-y: hidden;">
                      <div style="height:120px;" :style="{width:promotion.goodsSalesInfoDetailVOForPromotionList&&promotion.goodsSalesInfoDetailVOForPromotionList.length>0?(promotion.goodsSalesInfoDetailVOForPromotionList.length*130)+'px':'100%'}">
                          <div class="i_mg active" style="float: left;height:120px;margin-right:10px;" v-for="goods in promotion.goodsSalesInfoDetailVOForPromotionList" :key="goods.goods_id">
                              <img :src="goods.photo_url" @click="gotoGoodDeatil(goods.goods_id,goods.specificationId)" onerror="this.src='static/404.png'" class="photo" style="width: 108px;height: 108px;position:relative;top:13px;">
                          </div>
                      </div>
                  </div>
                  <!-- 组合满减 -->
              </div>
              <h2 v-if="promotion_list_map.MMZ.length>0">组合每满赠</h2>
              <div class="sp-list bg_f" :id="promotion_list_map.MMZ.length==idx+1?'DPMMJ':''" :class="{bb0:promotion_list_map.MMZ.length==idx+1}" v-show="promotion_list_map.MMZ.length >0" v-for="(promotion,idx) in promotion_list_map.MMZ" :key="promotion.id">
                  <!-- 组合每满赠 -->
                  <div :id="promotion_list_map.MMZ.length==idx+1?'DPMMJ':''" :class="{bb0:promotion_list_map.MMZ.length==idx+1}" v-show="promotion_list_map.MMZ.length >0" v-for="(promotion,idx) in promotion_list_map.MMZ" :key="promotion.id" class="old_order p5 pos_rel mb0 pb0">
                      <span class="order_num"><span class="dpmzSpan" v-text="promotion.promotionName"></span>   </span>
                      <p class="order_list tp3" @click.prevent="showDescDialog(promotion.promotionName,promotion.promotionDesc)">
                        <span class="">促销说明</span>
                        <img src="../../../common/images/goto.png">
                      </p>
                  </div>
                  <div style="height:140px;position:relative;">
                      <div @click.prevent="gotoPromotionDetail(promotion.id)" style="background:url('static/img_xiangqing.png') no-repeat center;background-size:cover;position:absolute;top:13px;right:0;width:97px;height:108px;z-index: 9;"></div>
                  </div>
                  <div style="height:120px;position:absolute;top:43px;left:0;right:88px;overflow-x:auto;overflow-y: hidden;">
                      <div style="height:120px;" :style="{width:promotion.goodsSalesInfoDetailVOForPromotionList&&promotion.goodsSalesInfoDetailVOForPromotionList.length>0?(promotion.goodsSalesInfoDetailVOForPromotionList.length*130)+'px':'100%'}">
                          <div class="i_mg active" style="float: left;height:120px;margin-right:10px;"
                          v-for="goods in promotion.goodsSalesInfoDetailVOForPromotionList" :key="goods.goods_id">
                              <img  :src="goods.photo_url" @click="gotoGoodDeatil(goods.goods_id,goods.specificationId)" onerror="this.src='static/404.png'" class="photo" style="width: 108px;height: 108px;position:relative;top:13px;">
                          </div>
                      </div>
                  </div>
                  <!-- 组合每满赠 -->
              </div>
              <h2 v-if="promotion_list_map.MMJ.length>0">组合每满减</h2>
              <div class="sp-list bg_f" v-show="promotion_list_map.MMJ.length >0" :class="{bb0:promotion_list_map.MMJ.length==idx+1}" v-for="(promotion,idx) in promotion_list_map.MMJ" :key="promotion.id">
                  <!-- 组合每满减 -->
                  <div class="old_order p5 pos_rel mb0 pb0">
                      <span class="order_num"><span class="dpmzSpan" v-text="promotion.promotionName"></span>   </span>
                      <p class="order_list tp3" @click.prevent="showDescDialog(promotion.promotionName,promotion.promotionDesc)">
                        <span class="">促销说明</span>
                        <img src="../../../common/images/goto.png">
                      </p>
                  </div>
                  <div style="height:140px;position:relative;">
                      <div @click.prevent="gotoPromotionDetail(promotion.id)" style="background:url('static/img_xiangqing.png') no-repeat center;background-size:cover;position:absolute;top:13px;right:0;width:97px;height:108px;z-index: 9;"></div>
                  </div>
                  <div style="height:120px;position:absolute;top:43px;left:0;right:88px;overflow-x:auto;overflow-y: hidden;">
                      <div style="height:120px;" :style="{width:promotion.goodsSalesInfoDetailVOForPromotionList&&promotion.goodsSalesInfoDetailVOForPromotionList.length>0?(promotion.goodsSalesInfoDetailVOForPromotionList.length*130)+'px':'100%'}">
                          <div class="i_mg active" style="float: left;height:120px;margin-right:10px;" v-for="goods in promotion.goodsSalesInfoDetailVOForPromotionList" :key="goods.goods_id">
                              <img  :src="goods.photo_url" @click="gotoGoodDeatil(goods.goods_id,goods.specificationId)" onerror="this.src='static/404.png'" class="photo" style="width: 108px;height: 108px;position:relative;top:13px;">
                          </div>
                      </div>
                  </div>
                  <!-- 组合每满减 -->
              </div>
              <!-- 加载更多 -->
              <div class="l-noData" v-if="allLoaded" style="margin-bottom:30px;">
                  <div class="l_nomore"><span>正在加载中...</span></div>
              </div>
          </div>
          <!-- 组合促销列表 end -->

          <!-- 单品列表 -->
          <div class="sp" v-if="promotion_type == 'DPCX'" style="overflow:hidden;margin-top:40px;">  
            <div class="empty" v-if="showEmpty">
                  <img src="../../../common/images/empty.png" class="img-empty">
             </div>

              <h2 v-if="promotion_list_map.MZ.length>0">单品满赠</h2>
              <div :id="promotion_list_map.MZ.length==idx+1?'DPMJ':''" :class="{bb0:promotion_list_map.MZ.length==idx+1}"
                            v-show="promotion_list_map.MZ.length >0" v-for="(promotion,idx) in promotion_list_map.MZ" :key="promotion.id" class="sp-list bg_f">
                  <!-- 单品赠 -->
                  <div class="old_order p5 pos_rel mb0 pb0">
                      <span class="order_num"><span class="dpmzSpan" v-text="promotion.promotionName"></span>  </span>
                      <p class="order_list tp3" >
                        <span class="" @click.prevent="showDescDialog(promotion.promotionName,promotion.promotionDesc)">促销说明</span>
                        <img src="../../../common/images/goto.png">
                      </p>
                  </div>
                  <dl >                         
                      <a href="#">    
                          <dt class="i_mg active">
                              <img :src="promotion.goodsImg" onerror="this.src='static/404.png'" class="photo">                                        
                          </dt>
                      </a>
                      <dd>
                          <p class="title">
                              <span class="tit_inne" v-text="promotion.goodsName"></span>
                          </p>
                          <p class="G-g">可销售：<span>{{promotion.showStockCountType?promotion.showStockCountType:0}}</span></p>
                          <p class="price-add" style="top:20px;">
                              <span class="price"><span v-text="promotion.sellPrice"></span>元/{{promotion.specificName}}</span>
                          </p>
                          <ul class="a_r_bt">
                              <li class="a_dd_bt j_add" @click.stop="gotoDppromotionDetail(promotion.promotionId)"></li>
                          </ul>
                      </dd>
                  </dl>
                  <!-- 单品赠 -->
              </div>
              <h2 v-if="promotion_list_map.MJ.length>0">单品满减</h2>
              <div :id="promotion_list_map.MJ.length==idx+1?'DPMMZ':''" :class="{bb0:promotion_list_map.MJ.length==idx+1}" 
               v-show="promotion_list_map.MJ.length >0" v-for="(promotion,idx) in promotion_list_map.MJ" :key="promotion.id" class="sp-list bg_f">
                  <!-- 单品赠 -->
                  <div class="old_order p5 pos_rel mb0 pb0">
                      <span class="order_num"><span class="dpmzSpan" v-text="promotion.promotionName"></span>   </span>
                      <p class="order_list tp3">
                        <span class="" @click.prevent="showDescDialog(promotion.promotionName,promotion.promotionDesc)">促销说明</span>
                        <img src="../../../common/images/goto.png">
                      </p>
                  </div>
                  <dl>
                      <a href="#" >
                          <dt class="i_mg active">
                              <img :src="promotion.goodsImg" onerror="this.src='static/404.png'" class="photo">
                          </dt>
                      </a>
                      <dd>
                          <p class="title">
                              <span class="tit_inne"  v-text="promotion.goodsName"></span>
                          </p>
                          <p class="G-g">可销售：<span>{{promotion.showStockCountType?promotion.showStockCountType:0}}</span></p>
                          <p class="price-add" style="top:20px;">
                              <span class="price"><span v-text="promotion.sellPrice"></span>元/{{promotion.specificName}}</span>
                          </p>
                          <ul class="a_r_bt">
                              <li class="a_dd_bt j_add" @click.stop="gotoDppromotionDetail(promotion.promotionId)"></li>
                          </ul>
                      </dd>
                  </dl>
                  <!-- 单品赠 -->
              </div>
              <h2 v-if="promotion_list_map.MMZ.length>0">单品每满赠</h2>
              <div :id="promotion_list_map.MMZ.length==idx+1?'DPMMJ':''" :class="{bb0:promotion_list_map.MMZ.length==idx+1}" class="sp-list bg_f"
              v-show="promotion_list_map.MMZ.length >0" v-for="(promotion,idx) in promotion_list_map.MMZ" :key="promotion.id">
                  <!-- 单品赠 -->
                  <div class="old_order p5 pos_rel mb0 pb0"  style="border-bottom: 1px solid #eee;background-color:#fff;">
                      <span class="order_num"><span class="dpmzSpan" v-text="promotion.promotionName"></span>  </span>
                      <p class="order_list tp3"  @click.prevent="showDescDialog(promotion.promotionName,promotion.promotionDesc)">
                        <span class="">促销说明</span>
                        <img src="../../../common/images/goto.png">
                      </p>
                  </div>
                  <dl >
                      <a href="#">
                          <dt class="i_mg active">
                              <img :src="promotion.goodsImg" onerror="this.src='static/404.png'" class="photo">
                          </dt>
                      </a>
                      <dd>
                          <p class="title">
                              <span class="tit_inne" v-text="promotion.goodsName"></span>
                          </p>
                          <p class="G-g">可销售：<span>{{promotion.showStockCountType?promotion.showStockCountType:0}}</span></p>
                          <p class="price-add" style="top:20px;">
                              <span class="price">
                                <span v-text="promotion.sellPrice"></span>元/{{promotion.specificName}}
                              </span>
                          </p>
                          <ul class="a_r_bt">
                              <li class="a_dd_bt j_add" @click.stop="gotoDppromotionDetail(promotion.promotionId)"></li>
                          </ul>
                      </dd>
                  </dl>
                  <!-- 单品赠 -->
              </div>
              <h2 v-if="promotion_list_map.MMJ.length>0">单品每满减</h2>
              <div class="sp-list bg_f" v-show="promotion_list_map.MMJ.length >0" :class="{bb0:promotion_list_map.MMJ.length==idx+1}" 
                  v-for="(promotion,idx) in promotion_list_map.MMJ" :key="promotion.id">
                  <!-- 单品赠 -->
                  <div class="old_order p5 pos_rel mb0 pb0">
                      <span class="order_num"><span class="dpmzSpan" v-text="promotion.promotionName"></span>    </span>
                      <p class="order_list tp3" @click.prevent="showDescDialog(promotion.promotionName,promotion.promotionDesc)">
                        <span class="t_bl">促销说明</span>
                        <img src="../../../common/images/goto.png">
                      </p>
                  </div>
                  <dl >
                      <a href="#">
                          <dt class="i_mg active">
                              <img :src="promotion.goodsImg" onerror="this.src='static/404.png'" class="photo">                              
                          </dt>
                      </a>
                      <dd>
                          <p class="title">
                              <span class="tit_inne" v-text="promotion.goodsName"></span>
                          </p>
                          <p class="G-g">可销售：<span>{{promotion.showStockCountType?promotion.showStockCountType:0}}</span></p>
                          <p class="price-add" style="top:20px;">
                              <i class="price"><span v-text="promotion.sellPrice"></span>元/{{promotion.specificName}}</i>
                          </p>
                          <ul class="a_r_bt">
                              <li class="a_dd_bt j_add" @click.stop="gotoDppromotionDetail(promotion.promotionId)"></li>
                          </ul>
                      </dd>
                  </dl>
                  <!-- 单品赠 -->
              </div>
              <!-- </mt-loadmore> -->
              <!-- 加载更多 -->
              <div class="l-noData" v-if="allLoaded" style="margin-bottom:30px;">
                  <div class="l_nomore"><span>正在加载中...</span></div>
              </div>
          </div>
          <!-- 单品列表 end -->
      </section>
      <!-- 促销说明弹窗 -->
      <div class="yhsm" v-bind:class="{active:showPromotionDesc}">
        <div class="yhsm_b" @click.prevent="closePromotionDesc"></div>
        <!-- 使用active控制滑出 -->
        <div class="yhsm_c" v-bind:class="{active:showPromotionDesc}">
            <h5 class="yhsm_title">促销说明<i @click.prevent="closePromotionDesc">×</i></h5>
            <div class="yhsm_con" style="border-bottom: 1px solid rgb(238, 238, 238); padding: 15px 20px;">
                <p style="font-size: 14px; color: rgb(68, 67, 67);" v-text="promotionName"></p>
                <p style="color: rgb(102, 102, 102); font-size: 12px; position: relative;" v-text="promotion_desc_text"></p>
            </div>
            <br> <br> <br>
            <a href="javascript:;" class="yhsm_btn" @click.prevent="closePromotionDesc">确定</a>
        </div>
      </div>
    </div>
</template>

<script>
    import { Toast } from "mint-ui";//提示
  export default {
    data() {
      return {
        showEmpty:false,
        promotion:[],
        promotion_list_map: { MZ: [], MJ: [], MMZ: [], MMJ: [] },
        filter_tag: 'MAIZENG',
        promotion_type: 'DPCX',
        allLoaded: true,//加载数据
        shopcartAmount: 0.00,
        promotion_desc_text: '',
        showPromotionDesc: false,
        promotionName:'',
        query: { pager: { currentPage: 1, pageSize: 10 } },
      }
    },
    methods:{
        //点击促销说明显示弹窗
        showDescDialog:function(promotionName,promotionDesc){
            this.showPromotionDesc = true;
            this.promotion_desc_text = promotionName;
            this.promotionName = promotionName;
        },
        closePromotionDesc: function () {
            this.showPromotionDesc = false;
        },
        //点击促销详情图片跳转到详情页面
        gotoPromotionDetail:function(promotionId){
            this.$router.push(`/shop/home/zh_promotion_detail/${promotionId}`)
        },
        gotoDppromotionDetail:function(promotionId){
            this.$router.push(`/shop/home/dp_promotion_detail/${promotionId}`)
        },
        //格式化价格
        formatMoney:function(money,withSign){
            // var formattedValue;
            // value = Number(money);
            // if(isNaN(money)){
            //     formattedValue = "非法数字";
            // }else{
            //     formattedValue = formattedValue.toFixed(2);
            // }if (withSign) {
            //     formattedValue = "￥" + formattedValue;
            // }
            // return formattedValue;
        },
        //单品促销,组合促销tab按钮
        changeProtionType:function(type){
            this.filter_tag = 'MAIZENG'
            this.promotion_type = type;
            this.reload();
        },
        resetSearch: function () {
            this.showLoading = true;
            this.allLoaded = true;
            //清空之前的数据
            this.zh_promotion_list = [];
            this.query.pager.currentPage = 1;
        },
        //获取购物车数据
        getShopcartAmount: function () {
            
        },
        //加载数据
        reload:function(){
            this.resetSearch();
            this.promotion_list_map = { MZ: [], MJ : [], MMZ : [], MMJ : []}
            this.loadMore();
        },
        //处理请求的数据
        handleResponse:function(res){
            console.log(res)
            if ((res.data && res.data.length == 0) || this.query.pager.pageSize > res.data.length) {
                //加载完毕
                this.allLoaded = true;
            }else{
                this.allLoaded = false;
            }
            this.promotion_list_map = res.data;
            if(this.promotion_list_map.MZ.length > 0 || this.promotion_list_map.MJ.length > 0 || this.promotion_list_map.MMZ.length > 0 || this.promotion_list_map.MMJ.length >0){
                this.showEmpty = false;
            }else{
                this.showEmpty = true;
            }


            //获取购物车金额
            this.getShopcartAmount();
        },
        //加载更多
        loadMore:function(){
            this.query.promotion_sub_type = this.filter_tag;
            this.query.promotion_type = this.promotion_type;
            this.$indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            if(this.query.promotion_type == 'DPCX'){
                this.api.getDppromotion(this.query).then((res)=>{
                    this.handleResponse(res)
                    this.$indicator.close();
                })    
            }else{
                this.api.getZhpromotion(this.query).then((res)=>{
                    this.handleResponse(res)
                    this.$indicator.close();
                })         
            }
        },
        gotoShopcar() {
          this.$router.push('/shop/base/shoppingCar')
        }
    },
    created() {
     
    },
    mounted:function(){
        this.loadMore();
    },
  }
</script>

<style lang="less" scoped>
  *{
    margin: 0;
    padding: 0;
  }
  #j_container {
    height: 100%;
  }
  #headerN {
    width: 100%;
    height: 100px;
    line-height: 100px;
    position: relative;
    background: linear-gradient(to left, #1e90ff, #4fe4fa);
    text-align: center;
    font-size: 20px;
    color: #fff;
    position: relative;
}
.backN {
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 100px;
    position: absolute;
    top: 10px;
    left: 0;
    background: url(../../../common/images/ic_leftW.png) no-repeat center center;
    background-size: 20%;
}
.gotoShopcar {
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 100px;
    position: absolute;
    top: 10px;
    right: 0;
    background: url(../../../common/images/shopcar_white.png) no-repeat center center;
    background-size: 50%;
}
.d_sub {
    z-index: 10;
    width: 100%;
    height: 120px;
    min-width: 320px;
    max-width: 768px;
    margin: 0 auto;
    display: -webkit-box;
    background: #fff;
    -webkit-box-orient: horizontal;
    border-bottom: 1px solid #eee;
}
.d_tit .sub {
    margin: 0px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      margin-right:10px;
      border: none;
      display: inline-block;
      vertical-align: top;
      height: 100%;
    }
}
.d_tit .cur {
    border-bottom: 3px solid #1e90ff;
}
.d_sub .cur {
    color: #1e90ff;
}
.d_sub .sub {
    -webkit-box-flex: 1;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
}
.d_sub .cur .active {
    height: 100%;
}
.d_sub .active {
    font-size: 20px;
}
.sub_tit .sub {
    display: flex;
    display: block;
}
.d_sub .cur {
    color: #1e90ff;
}
.d_sub .cur a.activ {
    border-radius: 4px;
    color: #1e90ff;
}
.sub_tit .sub a {
    flex: 1;
    line-height: 120px;
    font-size: 28px;
}
.d_sub a.activ {
    border-radius: 4px;
    color: #666;
}
//列表section部分
section {
    height: 100%;
    overflow: scroll;
    // padding-bottom: 130px;
    h2{
      line-height: 60px;
      font-size: 28px;
      text-align: center;
      height: 60px;
      color: #666;
      letter-spacing: 3px;
  }
}

.sp-list {
    position: relative;
    border-bottom: 1px solid #f6f6f6;
    .old_order {
      border-bottom: 1px solid #eee;
      line-height: 32px;
      font-size: 13px;
      width: 100%;
  }
}
.bg_f {
    background-color: #fff!important;
}
.pos_rel {
    position: relative;
}

.pb0 {
    padding-bottom: 0px;
}
.mb0 {
    margin-bottom: 0px!important;
}
.p5 {
    padding: 5px;
}
.order_num {
    color: #666;
    width: 100%;
    height: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    white-space: nowrap;
}
.dpmzSpan{
    font-size:26px;
    color:#666;
    line-height: 70px;
}
.old_order span i {
    margin-left: 10px;
    /* color: #e21a13; */
}
.order_list {
    padding-right: 10px;
    position: absolute;
    right: 10px;
    color: #666;
    font-size: 24px;
    display: flex;
    align-items: center;
}
.order_list img {
    height: 20px;
    margin-left: 10px;
    border: none;
    display: inline-block;
    vertical-align: top;
}
.tp3 {
    top: 25px;
}
.sp dl{
    padding: 10px;
    display: -webkit-box;
    background: #fff;
    position: relative;
    -webkit-box-orient: horizontal;
}
.sp dl dt.active {
    position: relative;
    width: 150px;
    height: 150px;
    margin-top: 10px;
    text-align: center;
    border: 1px solid #eee;
    overflow: hidden;
    margin-right: 10px;
}
.sp dl dt img {
    width: 90%;
    height: 100%;
}

.nono {
    width: 100%;
    height: 100%;
}

.sp dl dd {
  -webkit-box-flex: 1;
  margin-left:15px;
}
.sp dl dd .title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 50px;
    font-weight: bold;
    color: #20233d;
}
.sp dl dd .G-g {
    color: #1e90ff;
    line-height: 30px;
}
.price-add {
  position: absolute;
}
.sp dl dd .price {
    color: #ff6754;
    font-weight: bold;
    line-height: 220px;
}
.a_r_bt {
    position: absolute;
    right: 10px;
    bottom: 23px;
    margin-top: -25px;
    border-radius: 4px;
    overflow: hidden;
}

.empty {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 88px;
		background: #F6F6F6;
		text-align: center;
		z-index: 9;
    }
    .empty .img-empty {
		margin-top: 450px;
		width: 138px;
	}

ul {
    list-style: none;
}
.a_r_bt li {
    display: inline-block;
    width: 45px;
    height: 36px;
    background: url(../../../common/images/icon-car.png) no-repeat center center;
    background-size: 100% 100%;
}
.bb0 {
    border-bottom: 0!important;
}
.bg_f {
    background-color: #fff!important;
}
//促销说明弹窗
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
}
.yhsm.active {
    display: block;
    z-index: 10000000;
}
.yhsm_b {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
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
}
.yhsm_c .yhsm_title {
    line-height: 100px;
    height: 100px;
    color: #666;
    text-align: center;
    font-size: 26px;
    border-bottom: 1px solid #eee;
}
.yhsm_title i {
    text-align: center;
    font-size: 52px;
    position: absolute;
    right: 20px;
    top: 0px;
}
.yhsm_c .yhsm_con {
    width: 100%;
    padding: 0 20px 20px 20px;
    line-height: 50px;
    min-height: 350px;
    max-height: 600px;
    overflow-y: auto;
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
// 加载更多

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
</style>