<template>
    <div id="zh_container">
        <input type="hidden" value="${param.promotionId}" id="promotionId">
        <!-- 头部 -->
        <header id="headerN">
            <a href="javascript:;" @click="goBack" class="backN"></a>
            <span style="font-size:14px;">优惠单品</span>
            <a href="javascript:;" class="gotoShopcar" @click="gotoShopcar"></a>
            <em class="shopCarNum"></em>
        </header>
        <!-- 主体部分 -->
        <section class="j_section section_hide" style="display: block; transform-origin: 0px 0px 0px; opacity: 1; transform: scale(1, 1);">
            <!-- 单品促销列表 -->
            <div class="list">
                <div class="p_msg" @click="showDescDialog">
                    <p class="p_title bl">
                        <img src="../../../common/images/ic_youhuiqujian.png" />优惠区间(共{{promotion_detail.promotionConditionList?promotion_detail.promotionConditionList.length:0}}个)</p>
                    <p style="position:relative;top:-2px;width:90%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" 
                    v-text="promotion_detail.promotionConditionList?'最高享受区间'+promotion_detail.promotionConditionList[0].promotion_type_name+promotion_detail.promotionConditionList[0].promotiona_detail:''"></p>
                </div>
                <div style="height:10px;"></div>
                <!-- 单品促销主商品 -->
                
                <!-- 主商品数量固定 -->
                <div class="main_shop">
                    <dl>
                        <dl class="d-l">
                            <dt class="i_mg">
                                <a href='javascript:;' @click.prevent="gotoGoodsDetail(promotion_detail.goodsId,promotion_detail.specificationId)" >
                                    <img :src="promotion_detail.goodsImg" onerror="this.src='/images/404.png'">
                                </a>
                            </dt>
                            <dd style="float:left">
                                <h5 class="dity" v-text="promotion_detail.goodsName"></h5>
                                <p class="g-g" style="color: #1e90ff;">可销售:
                                    <span>{{promotion_detail.showStockCountType}}</span>
                                </p>
                                <p class="price-add">
                                    <span class="tx_ye">￥</span>
                                    <span class="price tx_ye">{{promotion_detail.sellPrice | formatMoney}}</span>
                                    <span class="tx_ye">元/{{promotion_detail.specificName}}</span>
                                </p>
                            </dd>
                            <ul class="a_r" style="width:150px;position:absolute;bottom:10px;">
                                <li class="add" @click.prevent="minusBuyQit(promotion_detail)"></li>
                                <li class="input" style="background:#fff;">
                                    <span style="color: #000;line-height: 26px;" class="text" v-text="update_data.composite_count" @click.stop.prevent="modifyBuyQit(promotion_detail)"></span>
                                </li>
                                <li class="a_dd" @click.prevent="plusBuyQit(promotion_detail)"></li>
                            </ul>
                        </dl>

                    </dl>
                    <!-- 赠品区域 -->
                    <dl v-if="promotion_detail.promotionRule=='MZ'||promotion_detail.promotionRule=='MMZ'" v-for="(promotion_condition,idx) in promotion_detail.giftGoodsList" :key="promotion_condition.id">
                        <!-- 固定赠品 -->
                        <div v-if="promotion_condition.dpGiftGoodsList&&promotion_condition.dpGiftGoodsList.length>0&&promotion_condition.giftGoodsNum==promotion_condition.dpGiftGoodsList.length">
                            <span class="cx_msg_info" v-text="promotion_condition.dpGiftGoodsListTitle"></span>
                            <dl class="d-l" v-for="promotion_gift in promotion_condition.dpGiftGoodsList" :key="promotion_gift.id">
                                <div class="cec">
                                    <div class="weui-cell__hd tx_qt activ" style="width:26px;">
                                        <span class="iconfont icon-yuandui tx_bl" style="color:#fff;background:#fff;"></span>
                                    </div>
                                </div>
                                <dt class="i_mg">
                                    <a href='javascript:;'>
                                        <img :src="promotion_gift.photo_url" onerror="this.src='/images/404.png'">
                                    </a>

                                </dt>
                                <dd>
                                    <h5 class="dity">
                                        <span class="tx_bl">【赠品】</span>{{promotion_gift.goods_name}}</h5>
                                    <p class="price-add">
                                        <span class="price tx_ye">
                                            <b>{{promotion_gift.specific_name}}</b>
                                        </span>
                                    </p>
                                    <span class="number">×
                                        <span v-text="promotion_gift.gift_qit"></span>
                                    </span>
                                </dd>
                            </dl>
                        </div>
                        <!-- 任选赠品 -->
                        <div class="main_shop" v-if="promotion_condition.dpGiftGoodsList&&promotion_condition.dpGiftGoodsList.length>0&&promotion_condition.giftGoodsNum!=promotion_condition.dpGiftGoodsList.length">
                            <span class="cx_msg_info" v-text="promotion_condition.dpGiftGoodsListTitle"></span>
                            <dl class="dl" v-for="promotion_gift in promotion_condition.dpGiftGoodsList" :key="promotion_gift.id">
                                <dl class="d-l">
                                    <div class="cec">
                                        <div class="weui-cell__hd tx_qt activ">
                                            <input type="checkbox" class="weui-check">
                                            <span class="iconfont icon-yuan1 tx_cc" v-if="!promotion_gift.is_checked" @click="clickGift(promotion_gift,idx,true)"></span>
                                            <span class="iconfont icon-yuandui tx_bl" v-if="promotion_gift.is_checked" @click="clickGift(promotion_gift,idx,false)"></span>
                                        </div>
                                    </div>
                                    <dt class="i_mg">
                                        <a href='javascript:;'>
                                            <img :src="promotion_gift.photo_url" onerror="this.src='/images/404.png'">
                                        </a>
                                    </dt>
                                    <dd>
                                        <h5 class="dity">
                                            <span class="bl">【赠品】 </span>
                                            <span v-text="promotion_gift.goods_name"></span>
                                        </h5>
                                        <p class="price-add">
                                            <span class="price tx_ye" v-text="promotion_gift.specific_name"></span>
                                        </p>
                                        <span class="number">X
                                            <i v-text="promotion_gift.gift_qit"></i>
                                        </span>
                                    </dd>
                                </dl>
                            </dl>
                        </div>
                    </dl>
                    <!-- 赠品区域 -->
                    <!-- 金额减扣区域 -->
                    <div class="p_old_order">
                        <p class="">
                            <span class="order_num">
                                <span class="">促销价格:</span>
                                <span class="rr" style="font-size:16px;font-weight:900;">￥</span>
                                <span class="rr" style="font-size:16px;font-weight:900;">{{promotion_detail.promotionPayPrice | formatMoney}}</span>
                                <span class="rr" v-if="promotion_detail.nextCondition" style="font-size:9px;" v-text="'('+promotion_detail.nextCondition+')'"></span>
                            </span>
                        </p>
                        <p class="p_pdd">
                            <span class="" style="margin-right:15px;">
                                <span class="">优惠:</span>
                                <span>{{promotion_detail.promotiondisCountPrice | formatMoney}}</span>
                            </span>
                            <span href="#" class="">
                                <span class="">原价:</span>
                                <span style="text-decoration: line-through;">{{promotion_detail.promotionSumPrice| formatMoney}}</span>
                            </span>
                        </p>
                    </div>
                    <!-- 金额减扣区域 -->
                </div>             
            </div>
            <!-- 组合促销列表 end -->
            <a href="#" class="addCar mt20" @click.prevent="addShopcart">加入进货单</a>
        </section>
        <!-- 优惠说明  active控制显隐-->
        <div class="yhsm" v-bind:class="{active:showPromotionDesc}">
            <div class="yhsm_b" @click.prevent="closePromotionDesc"></div>
            <!-- 使用active控制滑出 -->
            <div class="yhsm_c" v-bind:class="{active:showPromotionDesc}">
                <h5 class="yhsm_title">优惠区间
                    <span @click.prevent="closePromotionDesc">×</span>
                </h5>
                <div class="yhsm_con">
                    <p class="msg_item" v-for="item in promotion_detail.promotionConditionList" :key="item.id">
                        <em style="font-weight:900;font-size:16px;display:block;" v-text="item.promotion_type_name"></em>
                        <span v-text="item.promotiona_detail"></span>
                    </p>
                    <br>
                    <br>
                    <br>
                </div>
                <a href="javascript:;" class="yhsm_btn" @click.prevent="closePromotionDesc">确定</a>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from "mint-ui";
    export default{
        data() {
            return {
                shopcartAmount: 0.00,
                allLoaded: true,
                showPromotionDesc: false,
                promotion_detail: {
                    gysDpPromotionConditions: []
                },
                update_data: {
                    composite_count: 1,
                    appZhPromotionGoodsVOs: [],
                    appZhPromotionGiftItemVOs: []
                },
                promotionGoodsVOList: [],
                addFlag: true,
                goodinfos:[],
                checked_list: [],
                isshowkucun:localStorage.getItem('isShowkucun')
            }
        },
        filters:{
          formatMoney(val) {
            if(!isNaN(val)) {
              return val.toFixed(2);
            }
          }
        },
        methods:{
            //是否下架
            isOffline: function () {
                return this.promotion_detail.promotionStatus != 'UNDERWAY';
            },
            //跳转商品详情
            gotoGoodsDetail:function(){
                this.$router.push('')
            },
            //点击显示
            showDescDialog: function () {   
                this.showPromotionDesc = true;
                this.promotion_desc_text = this.promotion_detail.promotionDesc;
            },
            //减少数量按钮
            minusBuyQit: function (goods) {
                if (this.isOffline()) {
                    return;
                }
                if (Number(this.update_data.composite_count) - 1 == 0) return
                if (Number(this.update_data.composite_count) - 1 < goods.minQit && goods.minQit != 0) {
                    this.$toast("最小允许购买量" + goods.minQit);
                    return;
                }
                if (this.update_data.composite_count > 0) {
                    this.update_data.composite_count = Number(this.update_data.composite_count) - 1;
                    this.updateNum();
                }
            },
            //增加数量按钮
            plusBuyQit: function (goods) {
                if (this.isOffline()) {
                    return;
                }
                if (Number(this.update_data.composite_count) + 1  > 999999) {
                    this.$toast("购买数量不能大于999999");
                    return
                }
                if (Number(this.update_data.composite_count) + 1 > goods.maxQit && goods.maxQit != 0) {
                    this.$toast("最大允许购买量" + goods.maxQit);
                    return;
                }
                this.update_data.composite_count = Number(this.update_data.composite_count) + 1;
                this.updateNum();
            },
            //手动输入数量
            modifyBuyQit: function (goods) {
                if (this.isOffline()) {
                    return;
                }
                this.$messagebox.prompt('修改购买数量').then(({
                    value,
                    action
                })=> {
                    if (!value) return
                    if (action) {
                        if (parseInt(value) > 999999) {
                            this.$toast("购买数量不能大于999999");
                            return
                        }                       
                        this.update_data.composite_count = value === '' ? this.update_data.composite_count : parseInt(value)

                        if(this.update_data.composite_count < 0) {
                            this.update_data.composite_count = 1
                        }

                        if (this.update_data.composite_count < goods.minQit && goods.minQit!=0) {
                            this.$toast("最小允许购买量" + goods.minQit);
                            this.update_data.composite_count = goods.minQit
                        }
                        if (this.update_data.composite_count > goods.maxQit&& goods.maxQit!=0) {
                            this.$toast("最大允许购买量" + goods.maxQit);
                            this.update_data.composite_count = goods.maxQit
                        }
                        this.updateNum();
                    }
                })
            },
            //点击关闭
            closePromotionDesc:function(){
                this.showPromotionDesc = false;
            },
            //获取后台详情数据
            updateNum:function(){
                this.$indicator.open({
                    text:'加载中...',
                    spinnerType:'fading-circle'
                });
                this.api.getDppromotionDetail({
                    promotionId:this.$route.params.id,
                    promotionQit:Number(this.update_data.composite_count),
                    // promotionGoodsVOList: this.zhType == 'RYZH' ? this.promotionGoodsVOList : undefined
                }).then((response)=>{
                    this.addFlag = true;
                    //把默认选择的赠品选中
                    if (response.data.giftGoodsList) {
                        this.checked_list = []
                        response.data.giftGoodsList.forEach((item, index)=> {
                            if (item.giftGoodsNum) {
                                this.checked_list.push(item.giftGoodsNum)
                                item.dpGiftGoodsList.forEach((val, idx)=> {
                                    val.is_checked = idx < item.giftGoodsNum ? true : false
                                })
                            } else {
                                this.checked_list.push(0)
                            }
                        })
                    }
                    this.promotion_detail = response.data;
                    this.$indicator.close();
                })
                
            },
            // 加入到购物车
            addShopcart: function () {
                if (this.isOffline()) {
                    return;
                }
                var request_data = {
                    promotionId:this.$route.params.id,
                    qit: 1,
                    promotionType: 'DPCX',
                    gysBuyerPromotionShopcartItems: [{
                        itemQit: Number(this.update_data.composite_count)
                    }]
                };
                if (this.checked_list.length > 0) {
                    request_data.conditionAndGiftList = []
                    this.checked_list.forEach((val, idx)=> {
                        var ajax_item_list = []
                        var ajax_item = {
                            promotionConditionId: this.promotion_detail.giftGoodsList[idx].promotionConditionId,
                            goodsSalesInfoId: ajax_item_list
                        }
                        this.promotion_detail.giftGoodsList[idx].dpGiftGoodsList.forEach((good) => {
                            if (good.is_checked) {
                                ajax_item_list.push(good.goods_sales_info_id)
                            }
                        })
                        request_data.conditionAndGiftList.push(ajax_item)
                    })
                }
                this.$indicator.open({
                    text: '加载中...',
                    spinnerType: 'fading-circle'
                });
                // this.formatGifts();
                this.api.addPromotionShopCart(request_data).then( (response) => {
                    this.$indicator.close();
                    this.$toast('加入进货单成功')
                    this.$indicator.close();
                    setTimeout(() => {
                        window.history.go(-1)
                    }, 1000)       
                })
            },
            goBack() {
              this.$router.back(-1)
            },
            gotoShopcar() {
              this.$router.push('/shop/base/shoppingCar')
            }
        },
        mounted() {
            
        },
        created() {
           this.updateNum();
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
// 头部样式
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
// section部分样式
.list{
    position: relative;
    margin-bottom: 25px;
}
.p_msg {
    height: 120px;
    background: #fff url(../../../common/images/goto.png) no-repeat;
    background-position: 96% center;
    background-size: 15px;
    box-sizing: border-box;
    padding-left: 20px;
    font-size: 24px;
    color: #666;
}
.p_title {
    display: flex;
    align-items: center;
    height: 80px;
    font-size: 24px;
    position: relative;
    top: 3px;
}
.bl {
    color: #1e90ff;
}
.p_msg img {
    height: initial;
    margin-right: 20px;
    width: 30px;
    border: none;
    display: inline-block;
    vertical-align: top;
}
.main_shop .d-l {
    position: relative;
    padding-left: 20px;
    height: 180px;
    background: #fff;
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    display: -webkit-box;
}
.main_shop .d-l dt {
    width: 140px;
    height: 140px;
    overflow: hidden;
    position: relative;
    margin-right: 10px;
}
.main_shop .d-l dt img {
    width: 100%;
}
.main_shop .d-l dd {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -ms-box-flex: 1;
    -o-box-flex: 1;
    box-flex: 1;
    position: relative;
    margin-left: 15px;
}
.main_shop .d-l dd .dity {
    width: 400px;
    overflow: hidden;//溢出隐藏
    text-overflow: ellipsis;//省略号
    white-space: nowrap;//强制不换行
    line-height: 30px;
    position: relative;
}
h5{
    padding-top: 5px;
    font-size: 26px;
    font-weight: normal;
}
.price-add {
    position: absolute;
    top: 100px;
}
.tx_ye {
    font-size: 25px;
    color: #ff6754!important;
}
// 数量加减
.a_r {
    display: flex;
}
.a_r {
    right: 20px;
    height: 50px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    width: 200px;
}
.a_r li:nth-child(1), .a_r_btn li:nth-child(1) {
    border-right: 1px solid #ccc!important;
    background: url(../../../common/images/r_ole.png) no-repeat center center;
    background-size: 60%;
}
.a_r li {
    text-align: center;
    line-height: 50px;
}
.a_r li, .a_r_btn li {
    display: inline-block;
    width: 50px;
    height: 50px;
    overflow: hidden;
    position: relative;
    float: left;
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
.j_container .input {
    display: inline-block;
    height: 30px;
    background: #fff;
    line-height: 16px;
    padding: 2px 5px;
    color: #fff;
    margin: 0 5px;
}
.input .text {
    flex: 1;
}
.p_old_order {
    width: 100%;
    line-height: 60px;
    border-bottom: 1px solid #eee;
    position: relative;
    font-size: 28px;
    color: #666;
    font-weight: normal;
    padding: 15px 25px;
    background: #fff;
    text-align: right;
}
.order_num {
    color: #666;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    white-space: nowrap;
}
.rr {
    color: #ff6754;
}
.p_pdd {
    text-align: right;
    color: #999;
    font-size: 22px;
}
.addCar {
    width: 95%;
    margin: 0 auto;
    display: block;
    font-size: 28px;
    background: #1e90ff;
    padding: 15px 0;
    color: #fff;
    text-align: center;
    border-radius: 15px;
    margin-top: 15px;
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
.yhsm_title span {
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
.msg_item {
    box-sizing: border-box;
    width: 100%;
    border-radius: 60px;
    margin: 0 auto;
    padding: 5px 40px;
    background: linear-gradient(to left, #1e90ff, #00afff);
    color: #fff;
    margin-top: 20px;
    font-size: 12px;
    box-shadow: 0 5px 5px #96CAFD;
}
.msg_item span {
    display: block;
    width: 100%;
    word-break: break-all;
    line-height: 40px;
    font-size: 24px;
}
</style>

