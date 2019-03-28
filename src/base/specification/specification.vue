<template>
    <div id="specification">
        <div class="stance" @click="isShowFun()"></div>
        <div class="spec_content">
            <div class="list">
                <div class="imgBox">
                    <img class="categoryImg" :src="messageData.photo_url" :onerror="errorLoge">
                </div>
                <div class="textBox">
                    <p class="categoryName" v-cloak>{{messageData.goods_name}}</p>
                    <div class="details">
                        <p style="color:#1E90FF">可销售：
                            <span v-cloak style="color:#929292" v-cloak>{{messageData.sales_info_detail[position].showStockCountType}}</span>
                        </p>
                        </br>
                        <p v-cloak style="color:#FF6754">￥
                            <span>{{messageData.sales_info_detail[position].sales_price_desc}}</span>
                        </p>
                        <!-- <img class="logo" src="../../common/images/ic_jinhuodan.png"> -->
                    </div>
                </div>
            </div>
            <p class="dismember">销售规格</p>
            <div class="tapList">
                <div class="item" v-for="(item,index) in messageData.sales_info_detail" :class="{backgroundStyle:position==index}" :key="index" @click="choiceFun(index)">
                    <p v-cloak>{{item.package_specific}}</p>
                </div>
            </div>
            <p class="dismember">订购数量</p>
            <span>（起订量:{{messageData.sales_info_detail[position].min_purchased}} {{messageData.sales_info_detail[position].specific_name}}）</span>
            <div class="input_Num">
                <div class="minus" @click="minusFun()">-</div>
                <div class="inputNum"><input type="text" v-model="sum" @click="inpuOpenFun()"></div>
                <div class="added" @click="addedFun()">+</div>
                <span class="specification">{{messageData.sales_info_detail[position].specific_name}}</span>
            </div>
            <div class="joined" @click="addShopFun()">
                加入进货单
            </div>
        </div>
    </div>
</template>
<script>
import { MessageBox } from "mint-ui";
import Bus from '@/store/bus.js'
export default {
    props: ["messageData"],
    data() {
        return {
            sum: 0,
            position: 0,
            errorLoge:
                'this.src="' + require("../../common/images/onerror.png") + '"'
        };
    },
    methods: {
        minusFun() {
            if (
                this.sum <=
                this.messageData.sales_info_detail[this.position].min_purchased
            ) {
                this.$toast(
                    "最小起订数量" +
                        this.messageData.sales_info_detail[this.position]
                            .min_purchased
                );
                return false;
            }
            this.sum = this.sum - 1;
        },
        addedFun() {
            this.sum = this.sum + 1;
        },
        inpuOpenFun() {
            MessageBox.prompt("", "", {
                message: "修改购买数量",
                inputValue: this.sum,
                inputType: "Number"
            }).then(({ value, action }) => {
                var write = Number(value);
                // if (write == 0 || write < 0) {
                //     this.sum = this.sum;
                // } else {
                //     this.sum = write;
                // }
                if(write<this.messageData.sales_info_detail[this.position].min_purchased){
                this.sum=this.messageData.sales_info_detail[this.position].min_purchased;
                }else{
                this.sum=write;
                }
            });
        },
        isShowFun() {
            this.isShow = false;
            this.position = 0;
            this.$emit("up", {
                isShow: this.isShow
            });
        },
        addShopFun() {
            let listData = {
                goods_qit: this.sum,
                goods_sales_info_id: this.messageData.sales_info_detail[
                    this.position
                ].goods_sales_info_id
            };
            this.api.addShopCart(listData).then(res => {
                if (res.callStatus == "SUCCESS") {
                    this.isShowFun();
                    this.$toast({
                        message: "加入进货单成功",
                        iconClass: "icon icon-success"
                    });
                    this.bus(res.data)
                }else{
                    this.$toast(res.message)
                }
            });
        },
        choiceFun(val) {
            this.position = val;
            this.sum = this.messageData.sales_info_detail[val].min_purchased;
            console.log(this.mark);
        },
        bus(num) {
          console.log(num)
          Bus.$emit('getAmount', num)
        }
    },
    mounted() {
        this.sum = this.messageData.sales_info_detail[this.position].min_purchased;
    }
};
</script>
<style>
#specification {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
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
.spec_content .list {
    width: 100%;
    height: 227px;
    /* padding: 40px 20px; */
    display: flex;
    border-bottom: 0.5px solid #eeeeee;
    margin-bottom: 50px;
}
.spec_content .list .textBox {
    display: inline-block;
    width: 60%;
}
.spec_content .list .imgBox {
    width: 175px;
    height: 175px;
    margin-right: 20px;
}
.list .imgBox .categoryImg {
    width: 100%;
    height: 100%;
}
.list .textBox .logo {
    width: 50px;
    /* height: 50px; */
    float: right;
}
.list .textBox .details p {
    display: inline-block;
    /* display: flex; */
}
.tapList {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 30px;
}
.tapList .item {
    width: 250px;
    height: 60px;
    background: #f0f0f0;
    text-align: center;
    line-height: 60px;
    border-radius: 8px;
    margin-bottom: 20px;
}
.dismember {
    margin-bottom: 40px;
    display: inline-block;
}
.input_Num {
    width: 392px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.input_Num .inputNum {
    width: 262px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
}
.input_Num .inputNum input {
    width: 100%;
    text-align: center;
}
.input_Num .minus,
.added {
    width: 65px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border: 1px solid #ccc;
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
.specification {
    margin-left: 20px;
}
.joined {
    width: 80%;
    height: 98px;
    text-align: center;
    line-height: 98px;
    color: #ffffff;
    position: absolute;
    right: 0;
    bottom: 0;
    background: linear-gradient(to left, #1e90ff, #4fe4fa);
}
.tapList .backgroundStyle {
    background: #1e90ff;
    color: #ffffff;
}
</style>


