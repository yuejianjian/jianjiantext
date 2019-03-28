<template>
    <div class="category">
        <header-top ref="headerChild"></header-top>
        <div class="content">
            <ul class="base">

                <li class="attribute" v-bind:class="{activeStyle:star}" @click.stop="requestFun('')"  ref="10">
                    <img v-if="star" src="../../../common/images/ic_all_select.png">
                    <img v-if="!star" src="../../../common/images/ic_all.png"> 全部商品
                </li>

                <li v-for="(item,index) in categoryContent" :key="index" @click.stop="requestFun(item,index)">
                    <a href="javascript:void(0);"  class="backgroundA" v-bind:class="{activeStyle:item.type}">{{item.category_name}}</a>
                    <ul v-show="item.show">
                        <li class="childStyle" v-bind:class="{activeStyle:child.type}" v-for="(child,index) in item.children_category_list" :key="index" v-text="child.category_name" @click.stop="requestFun(child,index)"></li>
                    </ul>
                </li>

            </ul>
        </div>
        <div class="content_right">
            <ul>
                <li :class="{selectStyle:selectNum=='1'}" @click="selectTapFun(1)">默认</li>
                <li :class="{selectStyle:selectNum=='2'}" v-show='false' @click="selectTapFun(2)">促销</li>
                <li :class="{selectStyle:selectNum=='3'}" @click="selectTapFun(3)">价格
                    <img v-show="down" src="../../../common/images/ic_high2low.png">
                    <img v-show="downStyle" src="../../../common/images/ic_high2low-blue.png">
                    <img v-show="up" src="../../../common/images/ic_-low2high-blue.png">
                </li>
                <li @click="filterShow()">筛选
                    <img src="../../../common/images/ic_filter.png">
                </li>
            </ul>
            <div class="windowBox" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <p class="textShow" v-show="textShow">已经全部加载完毕</p>
                <mt-loadmore :autoFill="false" :top-method="loadTop" @top-status-change="handleTopChange" @translate-change="translateChange" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" @bottom-status-change="handleBottomChange">
                    <div class="list" v-for="(item,index) in categoryDetails" :key="index">
                        <router-link :to="{path:`/shop/detail`,query:{goods_id:item.goods_id}}">
                            <div class="imgBox">
                                <img class="categoryImg" :src="item.photo_url" :onerror="errorLoge">
                            </div>
                            <div class="textBox">
                                <p class="categoryName" v-cloak>{{item.goods_name}}</p>
                                <div class="details">
                                    <p style="color:#999;font-size:10px" v-if="isShowKucun == 'Y'">可销售：
                                        <span v-cloak>{{item.sales_info_detail[0].showStockCountType}}</span>
                                    </p>
                                </div>
                                 <div style="margin-top:8px;">
                                      <span v-cloak style="color:#FF6754;font-size:12px;font-weight: bold;">￥{{item.sales_info_detail[0].sales_price_desc}}</span>
                                        <span v-show="item.sales_info_detail[0].advice_sales_price" v-cloak style="color: #999;font-size:8px;">(建议零售价:￥{{item.sales_info_detail[0].advice_sales_price}}/{{item.sales_info_detail[0].specific_name}})  
                                        </span>
                                  </div>
                            </div>
                        </router-link>
                        <img @click.stop.prevent="listShowFun(item)" class="logo" src="../../../common/images/icon-car.png">
                    </div>
                    <div slot="top" class="mint-loadmore-top">
                        <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                        <span v-show="topStatus === 'loading'">
                            <!-- <mt-spinner type="snake"></mt-spinner>  -->
                        </span>
                    </div>
                    <div slot="bottom" class="mint-loadmore-bottom">
                        <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                        <span v-show="bottomStatus === 'loading'">
                            <!-- <mt-spinner type="snake"></mt-spinner> -->
                            <span v-show="flg">加载中...</span>
                            <span v-show="!flg">暂无更多数据</span>
                        </span>
                    </div>
                </mt-loadmore>


            </div>
        </div>
        <div id="screen">
            <div id="specification" v-show="specificationShow">
                <div class="stance" @click="isShowFun()"></div>
                <div class="spec_content">
                    <p class="dismember">商品品牌</p>
                    <div class="tapListScreen">
                        <div class="item" :class="{activeStyle:text.type}" v-for="(text,index) in ScreenDetails" @click="choiceFun(text)" :key="index">
                            <p v-cloak v-text="text.brandName"></p>
                        </div>
                    </div>
                    <div class="joinedScreen">
                        <div class="left" @click="removeFun()">清空</div>
                        <div class="right" @click="screenFun()">确定</div>
                    </div>
                </div>
            </div>
        </div>
        <Specification @up="hideSpec" v-if="isShow" v-bind:messageData="itemData"></Specification>
    </div>
</template>
<script>
import Bus from '@/store/bus.js'
import Specification from "@/base/specification/specification";
import { MessageBox } from "mint-ui";
import { Indicator } from 'mint-ui';
import { Toast } from 'mint-ui';
import headerTop from '@/base/header/header'
export default {
    data() {
        return {
            enterIndex: this.$route.params.index,
            star: true, //初始背景
            isShow: false,
            categoryContent: [],
            categoryDetails: [], //商品列表
            ScreenDetails: [], //品牌列表
            wrapperHeight: 0,
            itemData: [], //传值
            screenList: [], //品牌筛选值
            specificationShow: false,
            search_goods_name: headerTop.keywords,
            isHavaPromotion: sessionStorage.getItem('isHavaPromotion'),
            // canClickScreen:false, //整个页面是否能购点击 
            dataList: {
                pager: {
                    currentPage: 1,
                    pageSize: 10
                }
            },
            dataScreen: {
                category_id: ""
            },
            errorLoge:
                'this.src="' +
                require("../../../common/images/onerror.png") +
                '"',
            bottomStatus: "",
            wrapperHeight: 0,
            topStatus: "",
            translate: 0,
            moveTranslate: 0,
            allLoaded: false,
            flg: true,
            imgShow: false,
            textShow: false,
            selectNum: 1,
            up: false,
            down: true,
            downStyle: false,
            isShowKucun:''
        };
    },
    components: {
        Specification: Specification,
        'header-top':headerTop
    },
    // filters:{
    //   formatMoney(val) {
    //     if(!isNaN(val)) {
    //       return val.toFixed(2);
    //     }
    //   }
    // },

    destroyed(){
        Bus.$off('toSearch');
    },

    methods: {
        hideSpec(msg) {
            this.isShow = msg.isShow;
        },
        
        //左侧
        categoryContentFun() {
            this.api.categoryFun({}).then(res => {
                this.addTypeFun(res.data);
                this.categoryContent = res.data;


                 //返回左边的后开始加载右边的 右边商品列表
                 var index = this.enterIndex;
                 if(index < 4){
                    res.data[index].type = false;
                    this.star = false;
                    this.requestFun(res.data[index],index);
                 }else{
                    this.star = true;
                    this.detailsContentFun();
                 }
            });
        },
        //品牌筛选
        getBrandListFun() {
            this.api.getBrandList(this.dataScreen).then(res => {
                res.data.forEach(val => {
                    if (this.screenList == val.id) {
                        val.type = true;
                    } else {
                        val.type = false;
                    }
                });
                this.ScreenDetails = res.data;
            });
        },

        //右侧
        detailsContentFun(num) {
            Indicator.open({
                text: '加载中...',
                 spinnerType: 'fading-circle'
            });
            //进行搜索 
            if(this.$refs.headerChild.keywords != "" && 
               this.$refs.headerChild.keywords != undefined &&
               this.$refs.headerChild.keywords != null ){
                this.dataList.goods_name = this.$refs.headerChild.keywords;
            }else{
                delete this.dataList.goods_name;
            }
            this.api.detailsFun(this.dataList).then(res => {
                if (res.callStatus == "SUCCESS") {
                    if (num == 1) {
                        this.categoryDetails = [];
                    }
                    this.imgShow = false;
                    if (res.data.length == 0) {
                        this.flg = false;
                    }
                    this.categoryDetails = this.categoryDetails.concat(
                        res.data
                    );
        
                    if (this.categoryDetails.length == 0) {
                        this.textShow = true;
                        Toast({
                         message: '该分类暂时没有商品',
                         position: 'bottom',
                         duration: '1500'
                        });
                    } else {
                        this.textShow = false;
                    }
                    this.$refs.loadmore.onBottomLoaded();
                }
                Indicator.close();
            });
        },

        requestFun(val, i) {
            delete this.dataList.brand_ids;
            this.dataList.pager.currentPage = 1;
            this.flg = true;
            if (val == "") {
                var markType = 1;
                this.star = true;
                this.imgShow = true;
                this.categoryDetails = [];
                delete this.dataScreen.tag_id;
                this.dataScreen.category_id = val.id;
                this.addTypeFun(this.categoryContent);
                delete this.dataList.category_id;
                delete this.dataList.tag_id;
                this.detailsContentFun(markType);
                this.getBrandListFun();
            } else {
                var markType = 1;
                this.imgShow = true;
                this.categoryDetails = [];
                this.addTypeFun(this.categoryContent);
                val.type = true;
                this.star = false;
                val.show = true;
                if (val.children_category_list) {
                } else {
                    this.categoryContent[i].show = true;
                }
                if (val.category_type == "TAG") {
                    delete this.dataList.category_id;
                    delete this.dataScreen.category_id;
                    this.dataList.tag_id = val.id;
                    this.dataScreen.tag_id = val.id;
                } else {
                    delete this.dataList.tag_id;
                    delete this.dataScreen.tag_id;
                    this.dataList.category_id = val.id;
                    this.dataScreen.category_id = val.id;
                }
                this.detailsContentFun(markType);
                this.getBrandListFun();
            }
        },
        addTypeFun(data) {
            data.forEach(val => {
                val.type = false;
                // val.show = false;
                if (val.children_category_list.length > 0) {
                    val.children_category_list.forEach(conten => {
                        conten.type = false;
                    });
                }
            });
        },

        //顶部查询
        selectTapFun(val) {
            var markType = 1;
            this.imgShow = true;
            this.categoryDetails = [];
            if (val !== 3) {
                //排序其他
                this.down = true;
                this.downStyle = false;
                this.up = false;
                if (val == 1) {
                    delete this.dataList.orderBy;
                    delete this.dataList.isPromotionGoods;
                    this.detailsContentFun(markType);
                }
                if (val == 2) {
                    delete this.dataList.orderBy;
                    this.dataList.isPromotionGoods = "Y";
                    this.detailsContentFun(markType);
                }
            }
            if (val == 3 && this.selectNum !== 3) {
                //排序向下
                this.down = false;
                this.downStyle = true;
                this.up = false;
                delete this.dataList.isPromotionGoods;
                this.dataList.orderBy = "price";
                this.detailsContentFun(markType);
            }
            if (this.selectNum == 3 && val == 3) {
                //排序向上
                this.down = false;
                this.downStyle = !this.downStyle;
                this.up = !this.up;
                delete this.dataList.isPromotionGoods;
                this.dataList.orderBy = "price desc";
                this.detailsContentFun(markType);
            }
            this.selectNum = val;
        },
        loadBottom() {
            if (this.flg) {
                this.dataList.pager.currentPage =
                    this.dataList.pager.currentPage + 1;
                this.detailsContentFun();
            }
            // this.allLoaded = true; // 若数据已全部获取完毕
            // this.$refs.loadmore.onBottomLoaded();
        },
        handleBottomChange(status) {
            this.bottomStatus = status;
        },
        handleTopChange(status) {
            this.moveTranslate = 1;
            this.topStatus = status;
        },
        translateChange(translate) {
            const translateNum = +translate;
            this.translate = translateNum.toFixed(2);
            this.moveTranslate = (1 + translateNum / 70).toFixed(2);
        },
        loadTop() {
            this.$refs.loadmore.onTopLoaded();
        },
        //弹框
        listShowFun(item) {
            this.itemData = [];
            this.itemData = item;
            console.log(this.itemData);
            this.isShow = true;
        },
        isShowFun() {
            this.specificationShow = false;
        },
        choiceFun(val) {
            val.type = !val.type;
            if (val.type) {
                this.screenList.push(val.id);
            } else {
                this.screenList.splice(this.screenList.indexOf(val.id), 1);
            }
            console.log(this.screenList);
        },
        filterShow() {
            this.specificationShow = true;
            // this.getBrandListFun();
        },
        removeFun() {
            this.screenList = [];
            this.imgShow = true;
            this.specificationShow = false;
            this.ScreenDetails.forEach(val => {
                val.type = false;
            });
            this.categoryDetails = [];
            delete this.dataList.brand_ids;
            this.detailsContentFun();
        },
        screenFun() {
            this.specificationShow = false;
            this.imgShow = true;
            this.categoryDetails = [];
            this.dataList.brand_ids = this.screenList;
            this.detailsContentFun();
        },
    },

    
    mounted() {
        this.wrapperHeight =
            document.documentElement.clientHeight -
            this.$refs.wrapper.getBoundingClientRect().top -
            this.$refs.wrapper.getBoundingClientRect().bottom + 45;
        this.categoryContentFun();
        this.getBrandListFun();
        this.isShowKucun = localStorage.getItem('isShowkucun')
        console.log(this.isShowKucun);

        Bus.$on('toSearch', (e) => {
            this.detailsContentFun(1);
         })

    }
};
</script>







<style>
.category {
    position: relative;
    height: 100%;
    overflow: hidden;
}
.category .content {
    position: absolute;
    top: 100px;
    left: 0;
    bottom: 0;
    padding-bottom: 197px;
    overflow-y: auto;
    overflow-x: hidden;
}
.category .content ul {
    background: #F6F6F6;
}
.category .content li {
    width: 178px;
    min-height: 130px;
    text-align: center;
    line-height: 130px;
    /* border-bottom: 0.5px solid #eaeaea; */
    /* border-right: 0.5px solid #eaeaea; */
}
.activeStyle {
    background: linear-gradient(to left, #1e90ff, #4fe4fa);
    color: #fff;
}
.spec_content .tapListScreen .activeStyle {
    background: #1e90ff;
    color: #ffffff;
}
.base li a {
    width: 178px;
    height: 130px;
    display: block;
    /* text-decoration:none; */
    color: #666666;
}
.base li a.activeStyle {
    color: #ffffff;
}
.category .content .base .childStyle.activeStyle {
    background: linear-gradient(to left, #1e90ff, #4fe4fa);
    color: #ffffff;
}
.category .content .base .childStyle {
    background: #F6FCFF;
    line-height: 130px;
}
.category .content li img {
    width: 44px;
    position: absolute;
    left: 67px;
    top: 37px;
}
.category .content .attribute {
    /* background: linear-gradient(to left, #1e90ff, #4fe4fa); */
    height: 160px;
    line-height: 160px;
    padding-top: 37px;
    /* color: #ffffff; */
}
/* 右边显示区域 */
.content_right {
    width: 572px;
    position: absolute;
    top: 100px;
    right: 0;
    bottom: 0;
    /* padding-bottom: 185px; */
}
.content_right ul {
    width: 572px;
    background: #f4f4f4;
    height: 89px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    right: 0;
    top: 0;
}
.content_right li {
    width: 25%;
    text-align: center;
    align-items: center;
}
.content_right li:nth-child(3) img {
    width: 24px;
    height: 12px;
    position: relative;
    top: -5px;
}
.content_right li:nth-child(4) img {
    width: 27px;
    position: relative;
    top: 5px;
}
.content_right .windowBox {
    width: 100%;
    background: #ffffff;
    /* height: 100%; */
    margin-top: 89px;
    /* margin-bottom: 97px; */
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 24px;
}
.content_right .selectStyle {
    color: #1e90ff;
}
.windowBox .list {
    width: 100%;
    /* height: 195px; */
    padding: 8px 10px;
    display: flex;
    border-bottom: 0.1px solid #F6F6F6;
}

.windowBox .list .imgBox,
.textBox {
    /* position: relative; */
    display: inline-block;
    width: 75%;
}
.windowBox .list .imgBox {
    width: 120px;
    height: 120px;
    margin-right: 20px;
}
.list .imgBox .categoryImg {
    width: 100%;
    height: 100%;
}
.windowBox .list .logo {
    width: 50px;
    height: 50px;
    margin-top: 80px;
}
.list .textBox .details p {
    /* position: absolute; */
    /* bottom: 0; */
    display: inline-block;
    /* display: flex; */
}
.textBox .categoryName {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-wrap: break-word;
    color: #444343;
    /* onerror="../../../common/images/onerror.png" */
}
.page-loadmore-wrapper {
    overflow: scroll;
}
.sp-list {
    padding-bottom: 100px;
}
.mint-loadmore-top span {
    display: inline-block;
    vertical-align: middle;
}
.mint-loadmore-top span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
}
.page-loadmore .mint-spinner {
    display: inline-block;
    vertical-align: middle;
}
.page-loadmore-desc {
    text-align: center;
    color: #666;
    padding-bottom: 5px;
}
.page-loadmore-desc:last-of-type,
.page-loadmore-listitem {
    border-bottom: 1px solid #eee;
}
.page-loadmore-listitem {
    height: 50px;
    line-height: 50px;
    text-align: center;
}
.page-loadmore-listitem:first-child {
    border-top: 1px solid #eee;
}
.page-loadmore-wrapper {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
.mint-loadmore-bottom span {
    display: inline-block;
    -webkit-transition: 0.2s linear;
    transition: 0.2s linear;
    vertical-align: middle;
}
.mint-loadmore-bottom span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
}
.logoImgBox {
    width: 100%;
    text-align: center;
    padding-top: 80px;
}
.logoImgBox img {
    width: 100px;
}
.textShow {
    text-align: center;
}
#specification {
    width: 100%;
    height: 100%;
    background: 0rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
#specification .stance {
    width: 20%;
    height: 100%;
}
#specification .spec_content {
    width: 80%;
    height: 100%;
    padding: 30px 30px 0 30px;
    background: #ffffff;
}
.dismember {
    margin-bottom: 40px;
    display: inline-block;
}
.tapListScreen .backgroundStyle {
    background: #1e90ff;
    color: #ffffff;
}
.tapListScreen .item {
    width: 170px;
    height: 100px;
    background: #f0f0f0;
    text-align: center;
    /* line-height: 60px; */
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
}
.tapListScreen p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-wrap: break-word;
}
.tapListScreen {
    width: 100%;
    max-height: 1000px;
    overflow: hidden;
    overflow: scroll;
    /* overflow-y: hidden; */
    display: flex;
    /* align-items: center; */
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 30px;
}
.joinedScreen {
    width: 80%;
    height: 98px;
    text-align: center;
    line-height: 98px;
    color: #ffffff;
    position: absolute;
    right: 0;
    bottom: 0;
    border-top: 0.5px solid #d2d2d2;
    /* background: linear-gradient(to left, #1e90ff, #4fe4fa); */
}
.joinedScreen .left {
    float: left;
    width: 50%;
    height: 98px;
    text-align: center;
    line-height: 98px;
    color: #666666;
}
.joinedScreen .right {
    float: right;
    width: 50%;
    height: 98px;
    text-align: center;
    line-height: 98px;
    background: linear-gradient(to left, #1e90ff, #4fe4fa);
}
.windowBox .list a {
    display: inherit;
    width: 100%;
}
</style>