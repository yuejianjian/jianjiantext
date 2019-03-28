<template>
    <div id="detailContent" v-if="detailList">
        <div class="backtrack" @click="goBack">
            <img src="../../../common/images/ic_leftW.png">
        </div>
        <mt-swipe :auto="4000">
            <mt-swipe-item v-if="detailList.photo_list.length>0" v-for="(item,index) in detailList.photo_list" :key="index">
                <img style="width:100%;height:auto;
                           background-attachment: fixed;
                           background-size: cover;" :src="item">
            </mt-swipe-item>
        </mt-swipe>





        <div class="centre">
            <div class="information1">
                <!-- <p class="sales_price_desc">{{detailList.promotion_desc}}</p> -->
                <p class="sales_price_desc">
                    <b>¥<span v-text="detailList.sales_info_detail[sum].sales_price_desc"></span></b>
                </p>
                <p class="advice_sales_price">建议零售价:￥
                    <span>{{detailList.sales_info_detail[sum].advice_sales_price}}</span>
                    <span>/{{detailList.sales_info_detail[sum].specific_name}}</span>
                </p>
            </div>

             <p v-text="detailList.goods_name" class="goods_name"></p>
             <p class="specifica">销售规格
                <span class="qd">（起订量:
                    <span class="qdSum">{{detailList.sales_info_detail[sum].min_purchased+detailList.sales_info_detail[sum].specific_name}}</span>）</span>
                <span class="kc" v-show="isShowKucun == 'Y'&&detailList.sales_info_detail[0].showStockCount">可销售：{{detailList.sales_info_detail[sum].showStockCount+detailList.sales_info_detail[sum].specific_name}}</span>
            </p>
        </div>

        <!-- 规格 -->
        <div class="specification">
            <div class="specificaList">
                <div class="item" :class="{styleColor:list.type}" v-for="(list,index) in detailList.sales_info_detail" :key="index" @click="tapFun(list,index)">{{list.package_specific}}</div>
            </div>
        </div>



        <!-- 组合 -->
        <div class="swiper-container cx_swiper" v-if="zhcxListConten.length>0">
            <p class="name">优惠组合
                <!-- <span class="right1">共{{zhcxListConten.length}}款 ></span> -->
            </p>
            <div class="swiper-wrapper">
                <div class="swiper-slide s_pic" style="width:150px;height:148px;" v-for="(item,index) in zhcxListConten" :key="index">
                    <p style="text-align:center;font-size:14px;" v-text="item.promotionRuleDesc"></p>
                    <div class="img_div">
                        <img class="left" style="width:53%;height:80px;" :src="item.recommendGoodsVOs[0].goodsImgUrl">
                        <div class="right">
                            <img style="width:40px;height:40px;" :src="item.recommendGoodsVOs.length>1?item.recommendGoodsVOs[1].goodsImgUrl:item.recommendGoodsVOs[0].goodsImgUrl">
                            <img style="width:40px;height:40px;" :src="item.recommendGoodsVOs.length>2?item.recommendGoodsVOs[2].goodsImgUrl:(item.recommendGoodsVOs.length>1?item.recommendGoodsVOs[1].goodsImgUrl:item.recommendGoodsVOs[0].goodsImgUrl)">
                        </div>
                    </div>
                    <!-- <p class="bl" v-text="'‘'+item.promotionDesc+'’'"></p> -->
                </div>
            </div>
        </div>
        <!-- 单品 -->
        <div class="dp_swiper" v-if="dpcxListConten.length>0">
            <p class="name">商品优惠：
                <span class="right1" @click.prevent="showOrderDesc=true">优惠说明 ></span>
            </p>
            <p class="name">
                <span class="mz">{{dpcxListConten[0].promotionRuleDesc}}</span>
                <span class="sm">{{dpcxListConten[0].promotionName}}</span>
            </p>
        </div>

        <div class="parameters">
            <p class="name">商品参数</p>
            <div class="list_p">
                <p>品牌:
                    <span class="right1">{{detailList.brand_name}}</span>
                </p>
                <p v-show="isShowKucun == 'Y'&&detailList.sales_info_detail[0].showStockCount">可销售:
                    <span class="right1">{{detailList.sales_info_detail[sum].showStockCount+detailList.sales_info_detail[sum].specific_name}}</span>
                </p>
                <p>起订量:
                    <span class="right1">{{detailList.sales_info_detail[sum].min_purchased+detailList.sales_info_detail[sum].specific_name}}</span>
                </p>
                <p>条形码:
                    <span class="right1">{{detailList.sales_info_detail[sum].barcode}}</span>
                </p>
                <p>退换货:
                    <span class="right1">{{detailList.returnPolicy_desc}}</span>
                </p>
            </div>
        </div>

        <!-- 优惠说明 -->
        <div class="yhsm" v-bind:class="{active:showOrderDesc}">
            <div class="yhsm_b" @click.prevent="showOrderDesc=false"></div>
            <!-- 使用active控制滑出 ↓-->
            <div class="yhsm_c" v-bind:class="{active:showOrderDesc}">
                <h5 style="height:50px;line-height:50px;" class="yhsm_title">促销详情
                    <i @click.prevent="showOrderDesc=false" style="font-size:28px;float:right;margin-right:20px;">×</i>
                </h5>
                <div class="yhsm_con" style="padding:0;">
                    <div style="border-bottom:1px solid #eee;padding:15px 25px">
                        <p style="font-size: 14px;color:#444343;">
                            <span class="mz" v-if="dpcxListConten.length>0" v-text="dpcxListConten[0].promotionRuleDesc"></span>
                            <span class="right1" style="color:#ff6754;">查看购买
                                <span> ></span>
                            </span>
                        </p>
                        <p v-if="dpcxListConten.length>0" style="color:#666;font-size:12px;position:relative;" v-text="dpcxListConten[0].promotionName"></p>
                    </div>
                    <br>
                    <br>
                    <br>
                </div>
                <p class="yhsm_btn" @click.prevent="showOrderDesc=false">确定</p>
            </div>
        </div>


        <!-- 加入进货单 -->
        <div class="jhd" v-show="showOrderDescjhd">
            <div class="clickArea" @click.prevent="showOrderDescjhd=false"></div>
            <!-- 使用active控制滑出 -->
            <div class="yhsm_c">
                

                <div class="centre" >
                    <div class="imgBox" style="margin-bottom: 5px;">
                        <img :src="detailList.photo_list[0]">
                    </div>
                    <div class="information2">
                        <p v-text="detailList.goods_name" class="goods_name" style="margin-left:5px;"></p>
                        <p style="color:#1e90ff" v-show="isShowKucun == 'Y'&&detailList.sales_info_detail[0].showStockCount">可销售:
                            <span v-text="detailList.sales_info_detail[sum].showStockCount+detailList.sales_info_detail[sum].specific_name"></span>
                        </p>
                        <p class="advice_sales_price">
                            <span>订购数量（起订量:{{detailList.sales_info_detail[sum].min_purchased+detailList.sales_info_detail[sum].specific_name}}）</span>
                        </p>
                    </div>
                </div>

                <div class="ordered">
                     <div class="guige">
                          <div class="item" :class="{styleColor:list.type}" v-for="(list,index) in detailList.sales_info_detail" :key="index" @click="tapFun(list,index)">{{list.package_specific}}</div>
                     </div>

                </div> 

                <div class="ordered">
                        <p class="sales_price_desc">
                            <b>￥<span v-text="detailList.sales_info_detail[sum].sales_price_desc"></span>
                            </b>
                        </p>
                        <p class="advice_sales_price">零售价:￥
                            <span>{{detailList.sales_info_detail[sum].advice_sales_price}}</span>
                            <span>/{{detailList.sales_info_detail[sum].specific_name}}</span>
                        </p>
                    <div class="input_Num">
                        <div class="minus" @click="minusFun()">-</div>
                        <div class="inputNum"><input type="text" v-model="valText"></div>
                        <div class="added" @click="addedFun()">+</div>
                    </div>
                </div>
                <p class="yhsm_btn" @click="addshoppingFun()">确定</p>
            </div>
        </div>


        <div class="tabBottom">
            <!-- <router-link class="home" tag="div" to="/shop/base/home">首页</router-link> -->
            <router-link class="shop" tag="div" to="/shop/base/shoppingCar">进货单</router-link>
            <div class="tapShoppingCar" @click="addshoppingCar()">
                加入进货单
            </div>
        </div>

    </div>
</template>
<script>
import { Swipe, SwipeItem } from "mint-ui";
export default {
    data() {
        return {
            detailList: null,
            sum: 0,
            zhcxListConten: [],
            dpcxListConten: [],
            showOrderDesc: false,
            showOrderDescjhd: false,
            valText: "",
            isShowKucun:localStorage.getItem('isShowkucun')
            // valText:detailList.sales_info_detail[sum].min_purchased,
        };
    },
    methods: {
        getGoodsDetailFun() {
            this.api
                .getGoodsDetail({ goods_id: this.$route.query.goods_id })
                .then(res => {
                    if (res.callStatus == "SUCCESS") {
                        for (
                            let i = 0;
                            i < res.data.sales_info_detail.length;
                            i++
                        ) {
                            if (i == 0) {
                                res.data.sales_info_detail[i].type = true;
                            } else {
                                res.data.sales_info_detail[i].type = false;
                            }
                        }
                        this.detailList = res.data;
                        console.log(this.detailList);
                    }
                });
        },
        tapFun(val, index) {
            this.detailList.sales_info_detail.forEach(conten => {
                conten.type = false;
            });
            val.type = true;
            this.sum = index;
        },
        //组合商品
        getPromotionListByGoodIdFun() {
            this.api
                .getPromotionListByGoodId({
                    goods_id: this.$route.query.goods_id
                })
                .then(res => {
                    if (res.callStatus == "SUCCESS") {
                        this.zhcxListConten = res.data.zhcxList;
                        this.dpcxListConten = res.data.dpcxList;
                    }
                });
        },
        //-
        minusFun() {
            if (
                this.valText <=
                this.detailList.sales_info_detail[this.sum].min_purchased
            ) {
                this.$toast(
                    "最小起订数量" +
                        this.detailList.sales_info_detail[this.sum]
                            .min_purchased
                );
                return false;
            } else {
                this.valText = Number(this.valText) - 1;
            }
        },
        //+
        addedFun() {
            if (
                this.valText >=
                this.detailList.sales_info_detail[this.sum].showStockCount
            ) {
                this.$toast(
                    "可销售数量" +
                        this.detailList.sales_info_detail[this.sum]
                            .showStockCount
                );
                return false;
            } else {
                this.valText = Number(this.valText) + 1;
            }
        },
        //添加前的展示
        addshoppingCar() {
            this.showOrderDescjhd = true;
            this.valText = this.detailList.sales_info_detail[
                this.sum
            ].min_purchased;
            console.log(this.valText);
        },
        //添加
        addshoppingFun() {
            this.api
                .addShopCart({
                    goods_qit: this.valText,
                    goods_sales_info_id: this.detailList.sales_info_detail[
                        this.sum
                    ].id
                })
                .then(res => {
                    if (res.callStatus == "SUCCESS") {
                        this.$toast('加入成功');
                        this.showOrderDescjhd = false;
                    } else {
                        this.$toast(res.message);
                    }
                });
        },
        goBack() {
            this.$router.back(-1);
        }
    },
    mounted() {
        this.getGoodsDetailFun();
        this.getPromotionListByGoodIdFun();
    }
};
</script>
<style lang="less" scoped>
#detailContent .mint-swipe {
    width: 100%;
    height: 550px;
    // background: red;
}
#detailContent .centre {
    width: 100%;
    padding: 20px;
    background: #fff;
}
#detailContent .goods_name {
    font-size: 32px;
    margin-top: 5px;
    color: #333333;
}
#detailContent .sales_price_desc {
    font-size: 26px;
    color: #ff6754;
}
#detailContent .advice_sales_price {
    font-size: 22px;
    margin-left: 10px;
    color: #999999;
}
#detailContent .information1 {
    // text-align: center;
    display: flex;
    // align-items: center;
}

#detailContent .information2 {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
}


.specification {
    width: 100%;
    margin-top: 10px;
    padding-left: 10px;
    background: #fff;
}

.specifica {
    font-size: 22px;
    margin-top: 5px;
}
.specifica .qd {
    font-size: 24px;
}
.specifica .qd .qdSum {
    color: #ff6754;
}
.specifica .kc {
    font-size: 26px;
    float: right;
    color: #1e90ff;
}

.specificaList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.specificaList .item {
    width: 180px;
    height: 50px;
    text-align: center;
    padding: 0 20px;
    background: #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 50px;
    margin-right: 20px;
}

.specificaList .item.styleColor {
    background: #1e90ff;
    color: #fff;
}


.guige{
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
    align-content: center;
}

.guige .item {
    min-width: 100px;
    margin-right: 20px;
    padding: 0 20px;
    background: #fff;
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
    align-content: center;
}

.guige .item.styleColor {
    color: red;
    border-bottom:1px solid red;
}

.parameters {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 98px;
}
.parameters .name {
    height: 110px;
    line-height: 110px;
    text-align: center;
    background: #fff;
}
.list_p {
    width: 100%;
    background: #ffffff;
}
.list_p .right1 {
    float: right;
}
.right1 {
    float: right;
}
.list_p p {
    height: 70px;
    line-height: 70px;
    padding: 0 24px;
}
.list_p p:nth-of-type(odd) {
    background: #ffffff;
}


/////////////////////////////////////////////////
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
    margin-top: 10px;
    .name {
        text-align: center;
        height: 97px;
        color: #ff6754;
        line-height: 97px;
    }
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
.cx_swiper .swiper-slide > p:nth-of-type(1) {
    line-height: 36px;
    color: #666;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: 20px;
    padding-bottom: 10px;
}
.cx_swiper .swiper-slide > p:nth-of-type(2) {
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
.right {
    position: absolute;
    float: right;
    height: 80px;
    width: 40px;
    display: inline-block;
    img {
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
    img {
        border: none;
        display: inline-block;
        vertical-align: top;
    }
}
//单品促销
.dp_swiper {
    width: 100%;
    background: #fff;
    height: 200px;
    margin-top: 20px;
    .name {
        padding: 0 20px;
        height: 97px;
        line-height: 97px;
        border-bottom: 0.5px solid #eaeaea;
    }
    .mz {
        color: #ff6754;
        border: 0.5px solid #ff6754;
        margin-right: 20px;
        padding: 5px 15px;
        border-radius: 8px;
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
        background: rgba(0, 0, 0, 0.6);
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
    transition: all 0.3s linear;
    -webkit-transition: all 0.3s linear;
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
        .mz {
            color: #ff6754;
            border: 0.5px solid #ff6754;
            margin-right: 20px;
            padding: 5px 15px;
            border-radius: 8px;
        }
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
.tabBottom {
    width: 100%;
    height: 98px;
    background: #fff;
    border-top: 0.5px solid #eee;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100;
}
.tabBottom .home {
    width: 20%;
    height: 98px;
    background: url("../../../common/images/home.png") no-repeat center top;
    background-position:50% 12px;
    float: left;
    text-align: center;
    padding-top: 50px;
    border-right: 0.5px solid #eee;
}
.tabBottom .shop {
    width: 50%;
    height: 98px;
    background-color:#BCBCBC;
    color: #ffffff;
     text-align: center;
    float: left;
    line-height: 98px;
    border-right: 0.5px solid #eee;
}

.tabBottom .tapShoppingCar {
    width: 50%;
    height: 98px;
    background-color: #1E90FF;
    float: right;
    text-align: center;
    line-height: 98px;
    color: #ffffff;
}
.jhd {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
}
.jhd .yhsm_btn {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
}
.jhd .yhsm_c {
    background: #ffffff;
    width: 100%;
    height: 475px;
    position: fixed;
    bottom: 0;
    left: 0;
}
.ordered {
    display:flex;
    flex-direction: row;
    width: 100%;
    line-height: 60px;
    padding: 10px 20px;
    border-top: 0.5px solid #eee;
    justify-content: space-between;
}
.input_Num {
    width: 25%;
    height: 48px;
    float: right;
    margin-top: 10px;
    margin-left: 10px;
    // display: flex;
    // align-items: center;
  
}
.input_Num .inputNum {
    width: 40%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    float: left;
}
.input_Num .inputNum input {
    width: 100%;
    text-align: center;
}
.input_Num .minus,
.added {
    width: 30%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border: 1px solid #ccc;
    float: left;
}
.input_Num .minus {
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    font-size: 48px;
}
.input_Num .added {
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    font-size: 48px;
    color: red;
}
.clickArea {
    width: 100%;
    height: 600px;
    position: fixed;
    bottom: 475px;
    left: 0;
}
.centre .imgBox {
    width: 150px;
    height: 150px;
    float: left;
}
.centre .imgBox img {
    width: 100%;
    height: 100%;
}
.backtrack {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 60px;
    height: 60px;
    background: rgba(0, 0, 0, 0.6);
    z-index: 888;
    text-align: center;
    border-radius: 30px;
    line-height: 60px;
    vertical-align: middle;
}
.backtrack img {
    width: 50%;
    height: 50%;
}
</style>


