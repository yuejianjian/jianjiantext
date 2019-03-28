<template>
	<div id="shoppingCar">
		<div class="header">
			进货单
			<span v-if="!showEmpty" @click="goEdit">{{editMode?'完成':'编辑'}}</span>
		</div>

		<div class="c-item flex-item gys-tit">
			<div class="radio-wrap" @click="checkAll">
				<span v-show="!editMode" :class="{'border':shopcartData.is_all_check == 'N'}"><img v-show="shopcartData.is_all_check == 'Y'" src="@/common/images/icon-radio.png" alt=""></span>
				<span v-show="editMode" :class="{'border':!shopcartData.editAllCheck}">
					<img v-show="shopcartData.editAllCheck" src="@/common/images/icon-radio.png" alt="">
				</span>
			</div>
			<p>{{shopcartData.gys_name}}</p>
		</div>

		<!-- 主商品列表 -->
		<ul class="main-goods">
			<li :class="{'over':item.msg}" class="c-item flex-item main-goods-item" v-for="(item,index) in shopcartData.shopcart_goods_list">
				<div class="radio-wrap" @click="checkItem(item,index)" v-if="item.msg == null">
					<span v-show="!editMode" :class="{'border':item.checkStatus == 'UNCHECK'}"><img v-show="item.checkStatus == 'CHECK'" src="@/common/images/icon-radio.png" alt=""></span>
					<span v-show="editMode" :class="{'border':!item.editCheck}">
						<img v-show="item.editCheck" src="@/common/images/icon-radio.png" alt="">
					</span>
				</div>
				<img :src="item.photo_url||'../../static/404.png'" alt="">
				<div class="text-detail">
					<p class="goods_name line-clamp2">{{item.goods_name}}</p>
					<p class="stock_count">可销售：{{item.showStockCountType}}</p>
					<p class="sales_price">￥{{item.sales_price|formatMoney}}/{{item.specific_name}}</p>
					<div class="add-mod flex-item" v-if="item.msg == null">
						<span class="btn-minus" @click="minus(item)"></span>
						<span class="qit" @click="modifyQit(item)">{{item.goods_qit}}</span>
						<span class="btn-plus" @click="plus(item)"></span>
					</div>
					<p class="showMsg" v-if="item.msg">{{item.msg}}</p>
				</div>
			</li>
		</ul>


		<!-- 单品商品列表 -->
		<ul class="zh-goods">
			<li class="zh-goods-itme" v-for="(item,index) in shopcartData.dp_shopcart_list">
				<div class="flex-item title">
					<div class="radio-wrap" @click="checkZhItem(item,index)">
						<span v-show="!editMode" :class="{'border':item.check_status == 'UNCHECK'}"><img v-show="item.check_status == 'CHECK'" src="@/common/images/icon-radio.png" alt=""></span>
						<span v-show="editMode" :class="{'border':!item.editCheck}">
							<img v-show="item.editCheck" src="@/common/images/icon-radio.png" alt="">
						</span>
					</div>
					<p>
						<span>{{getDpDesc(item.promotionRule)}}</span>{{item.promotionName}}
					</p>
					<img src="@/common/images/arrow-right.png" alt="" class="arrow">
				</div>

				<!-- 单品商品区 -->
				<div class="goods flex-item">
					<img :src="item.photo_url||'../../static/404.png'" alt="">
					<div class="text-detail">
						<p class="goods_name line-clamp2">{{item.goodsName}}</p>
						<p class="stock_count">可销售：{{item.showStockCount}}</p>
						<p class="sales_price">￥{{item.sellPrice|formatMoney}}/{{item.specificName}}</p>
						<div class="add-mod flex-item">
							<span class="btn-minus" @click="dpMinus(item)"></span>
							<span class="qit" @click="dpModifyNum(item)">{{item.promotionQit}}</span>
							<span class="btn-plus" @click="dpPlus(item)"></span>
						</div>
					</div>
				</div>

				<!-- 赠品区 -->
				<div class="gifts" v-if="!editMode" v-for="gift in item.giftGoodsList">
					<p>{{gift.dpGiftGoodsListTitle}}</p>
					<div class="flex-item gift-item" v-for="giftItem in gift.dpGiftGoodsList">
						<div class="radio-wrap" @click="zhCheckGift(item,giftItem,gift)">
							<span v-show="!editMode" :class="{'border':giftItem.check_status == 'UNCHECK'}"><img v-show="giftItem.check_status == 'CHECK'" src="@/common/images/icon-radio.png" alt=""></span>
							<span v-show="editMode" :class="{'border':!giftItem.editCheck}">
								<img v-show="giftItem.editCheck" src="@/common/images/icon-radio.png" alt="">
							</span>
						</div>
						<img :src="giftItem.photo_url||'../../static/404.png'" alt="">
						<div class="text-detail">
							<p class="goods_name line-clamp2">{{giftItem.goods_name}}</p>
							<p class="stock_count">可销售：{{giftItem.showStockCountType}}</p>
							<p class="sales_price">￥0.00/{{giftItem.specific_name}}</p>
						</div>
					</div>
				</div>

				<!-- <div class="zh-goods-amount c-item">
					<div class="payPrice">促销价格：<span>￥{{item.promotionPayPrice|formatMoney}}</span></div>
					<div class="sumPrice">原价：<span>￥{{item.promotionSumPrice|formatMoney}}</span>优惠：{{item.promotiondisCountPrice|formatMoney}}</div>
					<div class="add-mod flex-item" v-if="item.zhPromotionType == 'GDZH'">
						<span class="btn-minus" @click="dpMinus(item)"></span>
						<span class="qit" @click="dpModifyNum(item)">{{item.promotionQit}}</span>
						<span class="btn-plus" @click="dpPlus(item)"></span>
					</div>
				</div> -->
			</li>
		</ul>



		<!-- 组合商品列表 -->
		<ul class="zh-goods" v-if="zh_shopcart_list.length>0">
			<li class="zh-goods-itme" v-for="(item,index) in zh_shopcart_list">
				<div class="flex-item title">
					<div class="radio-wrap" @click="checkZhItem(item,index)">
						<span v-show="!editMode" :class="{'border':item.check_status == 'UNCHECK'}"><img v-show="item.check_status == 'CHECK'" src="@/common/images/icon-radio.png" alt=""></span>
						<span v-show="editMode" :class="{'border':!item.editCheck}">
							<img v-show="item.editCheck" src="@/common/images/icon-radio.png" alt="">
						</span>
					</div>
					<p>
						<span>{{getZhDesc(item.promotionRule)}}</span>{{item.promotionName}}
					</p>
					<img src="@/common/images/arrow-right.png" alt="" class="arrow">
				</div>

				<!-- 组合商品区 -->
				<div class="goods flex-item" v-for="childItem in item.zhPromotionGoodsList
">
					<img :src="childItem.photo_url||'../../static/404.png'" alt="">
					<div class="text-detail">
						<p class="goods_name line-clamp2">{{childItem.goods_name}}</p>
						<p class="stock_count">可销售：{{childItem.showStockCountType}}</p>
						<p class="sales_price">￥{{childItem.sales_price|formatMoney}}/{{childItem.specific_name}}</p>
						<div class="add-mod flex-item" v-if="item.zhPromotionType == 'RYZH'">
							<span class="btn-minus" @click="ryzhMinus(item,childItem)"></span>
							<span class="qit" @click="ryzhModifyNum(item,childItem)">{{childItem.goods_qit}}</span>
							<span class="btn-plus" @click="ryzhPlus(item,childItem)"></span>
						</div>
					</div>
				</div>

				<!-- 赠品区 -->
				<div class="gifts" v-if="!editMode" v-for="gift in item.giftGoodsList">
					<p>{{gift.dpGiftGoodsListTitle}}</p>
					<div class="flex-item gift-item" v-for="giftItem in gift.dpGiftGoodsList">
						<div class="radio-wrap" @click="zhCheckGift(item,giftItem,gift)">
							<span v-show="!editMode" :class="{'border':giftItem.check_status == 'UNCHECK'}"><img v-show="giftItem.check_status == 'CHECK'" src="@/common/images/icon-radio.png" alt=""></span>
							<span v-show="editMode" :class="{'border':!giftItem.editCheck}">
								<img v-show="giftItem.editCheck" src="@/common/images/icon-radio.png" alt="">
							</span>
						</div>
						<img :src="giftItem.photo_url||'../../static/404.png'" alt="">
						<div class="text-detail">
							<p class="goods_name line-clamp2">{{giftItem.goods_name}}</p>
							<p class="stock_count">可销售：{{giftItem.showStockCountType}}</p>
							<p class="sales_price">￥0.00/{{giftItem.specific_name}}</p>
						</div>
					</div>
				</div>

				<div class="zh-goods-amount c-item">
					<div class="payPrice">促销价格：<span>￥{{item.promotionPayPrice|formatMoney}}</span></div>
					<div class="sumPrice">原价：<span>￥{{item.promotionSumPrice|formatMoney}}</span>优惠：{{item.promotiondisCountPrice|formatMoney}}</div>
					<div class="add-mod flex-item" v-if="item.zhPromotionType == 'GDZH'">
						<span class="btn-minus" @click="gdzhMinus(item)"></span>
						<span class="qit" @click="gdzhModifyNum(item)">{{item.promotionQit}}</span>
						<span class="btn-plus" @click="gdzhPlus(item)"></span>
					</div>
				</div>
			</li>
		</ul>

		<!-- 订单赠品 -->
		<div class="order-gift" v-if="!editMode">
			<div class="goods flex-item" v-for="item in shopcartData.gift_list">
				<img :src="item.photo_url||'../../static/404.png'" alt="">
				<div class="text-detail">
					<p class="goods_name line-clamp2"><span>【订单赠品】</span>{{item.gift_name}}</p>
					<p class="stock_count">可销售：{{item.showStockCount}}</p>
					<p class="sales_price flex-item"><span>￥{{item.sales_price|formatMoney}}</span><span class="gift_qit">x{{item.gift_qit}}</span></p>
				</div>
			</div>
		</div>
		






		<!-- 底部结算 -->
		<div class="amessage" v-show="!is_allowed_settlement" >
			<span>{{shopcartData.alert_message}}</span>
		</div>
		<div class="wrap-settle flex-item">
			<div class="radio-wrap" @click="checkAll">
				<span v-show="!editMode" :class="{'border':shopcartData.is_all_check == 'N'}"><img v-show="shopcartData.is_all_check == 'Y'" src="@/common/images/icon-radio.png" alt=""></span>
				<span v-show="editMode" :class="{'border':!shopcartData.editAllCheck}">
					<img v-show="shopcartData.editAllCheck" src="@/common/images/icon-radio.png" alt="">
				</span>
				全选
			</div>
			<div class="amount" v-show="!editMode">
				<div class="pay_amount">应付款：￥{{shopcartData.pay_amount|formatMoney}}</div>
				<div class="sum_goods_amount">合计：￥{{shopcartData.sum_goods_amount|formatMoney}} 优惠：￥{{shopcartData.discount_amount|formatMoney}}</div>
			</div>
			<div class="settle" v-bind:class="{submit1: is_allowed_settlement,submit2: !is_allowed_settlement }">
				<a href="javascript:;" v-show="!editMode"  @click="gotoConfirm">结算</a>
				<a href="javascript:;" v-show="editMode"   @click="deteleItem">删除</a>
			</div>
		</div>

		<!-- 空空如也 -->
		<div class="empty" v-if="showEmpty">
			<img src="@/common/images/empty.png" alt="" class="img-empty">
			<p>您的进货单是空的，快去采购新商品吧</p>
			<img src="@/common/images/go-shopping.png" alt="" class="go-shopping" @click="gotoHome">
		</div>
	</div>
</template>

<script>
	import Bus from '@/store/bus.js'
	export default {
		data() {
			return {
				editMode:false,
				shopcartData:{
					shopcart_goods_list:[],
				},
				showEmpty:false,

				zh_shopcart_list:[
					{
						giftGoodsList:[]
					}
				]
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
			this.getShopCartList();
		},

   computed: {
		is_allowed_settlement: function () {
			return this.shopcartData.is_allowed_settlement == "Y";
		}

	 },

		methods:{
			bus(num) {
        Bus.$emit('getAmount', num)
			},
			busReq() {
        Bus.$emit('getAmountReq',null)
			},
			getShopCartList() {  //获取购物车在数据
        this.api.queryShopCartList({}).then(res=> {
          if(res.callStatus == 'SUCCESS') {
            res.data.editAllCheck = false
            res.data.shopcart_goods_list.forEach(item=>{
            	item.editCheck = false
            })
            res.data.gift_list.forEach(item=>{
            	item.editCheck = false
            })
            this.shopcartData = res.data
            if(this.shopcartData.shopcart_goods_list.length == 0 &&this.shopcartData.dp_shopcart_list
.length == 0&&this.shopcartData.zh_shopcart_list
.length == 0) {
            	this.showEmpty = true
            }

            res.data.zh_shopcart_list.forEach(item=>{
            	item.editCheck = false
            })
            this.zh_shopcart_list = res.data.zh_shopcart_list
            this.bus(res.data.sum_goods_amount)
          }
        })
      },
      goEdit() {
      	this.editMode = !this.editMode
			},
			

     	checkItem(item,index) { //选中/取消某个商品
     		if(this.editMode) { //编辑模式
     			this.shopcartData.shopcart_goods_list[index].editCheck = !this.shopcartData.shopcart_goods_list[index].editCheck
     			this.shopcartData.shopcart_goods_list.push({})
     			this.shopcartData.shopcart_goods_list.pop()
     			let n = 0;
			    this.shopcartData.shopcart_goods_list.forEach((val,idx) => {
			      if(val.editCheck) {
			        n++;
			      }
			    })
			    if(n == this.shopcartData.shopcart_goods_list.length) {
			      this.shopcartData.editAllCheck = true;
			    } else {
			      this.shopcartData.editAllCheck = false;
			    }
     		} else {  //正常模式
     			let checkStatus = '';
     			if(item.checkStatus == 'UNCHECK') {
     				checkStatus = 'CHECK'
     			} else {
     				checkStatus = 'UNCHECK'
     			}
     			this.api.updateShopCart({
     				shopcart_item_list:[{id:item.id,qit:item.goods_qit}],
     				update_shopcart_type:checkStatus,
     			}).then(res=> {
	          if(res.callStatus == 'SUCCESS') {
							this.shopcartData = res.data
							this.busReq()
	          }
	        })
     		}
			 },
			 
			 
     	checkZhItem(item,index) {  //组合条目选中/取消
     		console.log(item.check_status)
     		if(this.editMode) { //编辑模式
     			this.zh_shopcart_list[index].editCheck = !this.zh_shopcart_list[index].editCheck
     			this.zh_shopcart_list.push({})
     			this.zh_shopcart_list.pop()

     			this.shopcartData.dp_shopcart_list[index].editCheck = !this.shopcartData.dp_shopcart_list[index].editCheck
     			this.shopcartData.dp_shopcart_list.push({})
     			this.shopcartData.dp_shopcart_list.pop()
     		} else {
     			let checkStatus = '';
	   			if(item.check_status == 'UNCHECK') {
	   				checkStatus = 'ZH_CHECK'
	   			} else {
	   				checkStatus = 'ZH_UNCHECK'
	   			}
	   			this.api.updateShopCart({
	   				zh_shopcart_id_list:[item.id],
	   				update_shopcart_type:checkStatus,
	   			}).then(res=> {
	          if(res.callStatus == 'SUCCESS') {
	            this.shopcartData = res.data
							this.zh_shopcart_list = res.data.zh_shopcart_list
							this.busReq()
	          }
	        })
     		}
			 },
			 
     	checkAll() {  //全选
     		if(this.editMode) {  //编辑模式
     			this.shopcartData.editAllCheck = !this.shopcartData.editAllCheck
     			// this.shopcartData = Object.assign({}, this.shopcartData)
     			this.shopcartData.shopcart_goods_list.forEach((val,idx) => {
			      val.editCheck = this.shopcartData.editAllCheck
			    })
			    this.zh_shopcart_list.forEach((val,idx) => {
			      val.editCheck = this.shopcartData.editAllCheck
			    })
     		} else {  //正常模式
     			let checkStatus = '';
     			if(this.shopcartData.is_all_check == 'N') {
     				checkStatus = 'ALLCHECK'
     			} else {
     				checkStatus = 'ALLUNCHECK'
     			}
     			this.api.updateShopCart({
     				update_shopcart_type:checkStatus
     			}).then(res=> {
	          if(res.callStatus == 'SUCCESS') {
	            this.shopcartData = res.data
							this.zh_shopcart_list = res.data.zh_shopcart_list
							this.busReq()
	          }
	        })
     		}
			 },
			 
     	deteleItem() {//删除主商品
     		let shopcart_item_list = [];
     		this.shopcartData.shopcart_goods_list.forEach(item=> {
     			if(item.editCheck) {
     				shopcart_item_list.push({id:item.id,qit:item.goods_qit})
     			}
     		})
     		let zh_shopcart_id_list = []
     		this.zh_shopcart_list.forEach(item=> {
     			if(item.editCheck) {
     				zh_shopcart_id_list.push(item.id)
     			}
     		})

     		this.api.updateShopCart({
   				shopcart_item_list:shopcart_item_list,
   				update_shopcart_type:'DELETE',
   				zh_shopcart_id_list:zh_shopcart_id_list
   			}).then(res=> {
          if(res.callStatus == 'SUCCESS') {
            this.shopcartData = res.data
						this.zh_shopcart_list = res.data.zh_shopcart_list
						this.busReq()
          }
        })
     	},
     	plus(item) {  //增加购物车商品数量
     		this.api.updateShopCart({
   				shopcart_item_list:[{id:item.id,qit:item.goods_qit+1}],
   				update_shopcart_type:item.checkStatus,
   			}).then(res=> {
          if(res.callStatus == 'SUCCESS') {
						this.shopcartData = res.data
						this.busReq()
          }
        })
     	},
     	minus(item) { //减少购物车商品数量
     		let goods_qit = item.goods_qit
     		if(goods_qit>item.min_purchased) {
     			goods_qit--;
     		} else {
     			this.$toast('不能少于最低起订量：'+item.min_purchased)
     			return
     		}
     		this.api.updateShopCart({
   				shopcart_item_list:[{id:item.id,qit:goods_qit}],
   				update_shopcart_type:item.checkStatus,
   			}).then(res=> {
          if(res.callStatus == 'SUCCESS') {
						this.shopcartData = res.data
						this.busReq()
          }
        })
     	},
     	modifyQit(item) {  //修改购物车商品数量
     		this.$messagebox.prompt('','',{
	        message:'修改购买数量',
	        inputValue:item.goods_qit,
	        inputType:'tel'
	      }).then(({value,action}) => {
	        if (action) {
	          if(value==''){
	            this.$toast("数量不能为空!");
	            return
	          }
	          let goods_qit = parseInt(value)
	          if(goods_qit<item.min_purchased) {
	          	this.$toast('不能少于最低起订量：'+item.min_purchased)
     					return
	          }
	          this.api.updateShopCart({
		   				shopcart_item_list:[{id:item.id,qit:goods_qit}],
		   				update_shopcart_type:item.checkStatus,
		   			}).then(res=> {
		          if(res.callStatus == 'SUCCESS') {
								this.shopcartData = res.data
								this.busReq()
		          }
		        })
	        }
	      }).catch(function () {})
     	},
     	getDpDesc(type) {
        if (type == 'MZ') {
          return '单品满赠'
        } else if (type == 'MMZ') {
          return '单品每满赠'
        } else if (type == 'MJ') {
          return '单品满减'
        } else if (type == 'MMJ') {
          return '单品每满减'
        }
        return ''
      },
      getZhDesc(type) {
        if (type == 'MZ') {
          return '组合满赠'
        } else if (type == 'MMZ') {
          return '组合每满赠'
        } else if (type == 'MJ') {
          return '组合满减'
        } else if (type == 'MMJ') {
          return '组合每满减'
        }
        return ''
      },
      dpUpdateShopcart: function (promotion) {
          var request_data = {
              id: Number(promotion.id),
              promotionId: Number(promotion.promotionId),
              qit: 1,
              promotionType: 'DPCX',
              gysBuyerPromotionShopcartItems: [{
                  itemQit: Number(promotion.promotionQit)
              }]
          };

          if (promotion.giftGoodsList&&promotion.giftGoodsList.length > 0) {
              request_data.conditionAndGiftList = []
              promotion.giftGoodsList.forEach(function(val, idx) {
                  var ajax_item_list = []
                  var ajax_item = {
                      promotionConditionId: val.promotionConditionId,
                      goodsSalesInfoId: ajax_item_list
                  }
                  val.dpGiftGoodsList.forEach(function(good) {
                      if (good.check_status == 'CHECK') {
                          ajax_item_list.push(good.goods_sales_info_id)
                      }
                  })
                  request_data.conditionAndGiftList.push(ajax_item)
              })
          }
          this.api.updatePromotionShopCart(request_data).then(res => {
	        	if(res.callStatus == 'SUCCESS') {
							this.getShopCartList()
							this.busReq()
	          }
	        })
      },
      zhUpdateShopcart(promotion) {
        let request_data = {
            id: Number(promotion.id),
            promotionId: Number(promotion.promotionId),
            qit: promotion.zhPromotionType == 'GDZH' ? Number(promotion.promotionQit) : '1',
            promotionType: 'ZHCX',
            gysBuyerPromotionShopcartItems: []
        };
        if (promotion.zhPromotionType == 'RYZH') {
            promotion.zhPromotionGoodsList.forEach(function(val, idx) {
                request_data.gysBuyerPromotionShopcartItems.push({
                    itemQit: val.goods_qit,
                    goodsSalesInfoId: val.goods_sales_info_id
                })
            })
        }
        if (promotion.giftGoodsList) {
          request_data.conditionAndGiftList = []
          promotion.giftGoodsList.forEach(function(val, idx) {
            let ajax_item_list = []
            let ajax_item = {
              promotionConditionId: val.promotionConditionId,
              goodsSalesInfoId: ajax_item_list
            }
            val.dpGiftGoodsList.forEach(function(good) {
              if (good.check_status == 'CHECK') {
                ajax_item_list.push(good.goods_sales_info_id)
              }
            })
            request_data.conditionAndGiftList.push(ajax_item)
          })
        }
        this.api.updatePromotionShopCart(request_data).then(res => {
        	if(res.callStatus == 'SUCCESS') {
						this.getShopCartList()
						this.busReq()
          }
        })
      },
      dpMinus: function (dp) {
          if (Number(dp.promotionQit) == 1) {
              return;
          }
          if ((Number(dp.promotionQit) > Number(dp.minQit) && dp.minQit != 0) || dp.minQit == 0) {
              dp.promotionQit = Number(dp.promotionQit) - 1
              this.dpUpdateShopcart(dp)
          } else {
              this.$toast({
                  message: "不允许低于起订量：" + dp.minQit,
              });
          }
      },
      ryzhMinus(dp, good) {
        if (Number(good.goods_qit) == 1) {
          return;
        }
        if ((good.goods_qit > good.min_qit && good.min_qit != 0) || good.min_qit == 0) {
            good.goods_qit = good.goods_qit - 1
            this.zhUpdateShopcart(dp)
        } else {
          this.$toast({
              message: "不允许低于起订量：" + good.min_qit,
          });
        }
      },
      gdzhMinus(dp) {
        if (Number(dp.promotionQit) == 1) {
            return;
        }
        if ((Number(dp.promotionQit) > Number(dp.minQit) && dp.minQit != 0) || dp.minQit == 0) {
            dp.promotionQit = Number(dp.promotionQit) - 1
            this.zhUpdateShopcart(dp)
        } else {
            this.$toast({
                message: "不允许低于起订量：" + dp.minQit,
            });
        }
      },
      dpPlus: function (dp) {
        if (Number(dp.promotionQit) + 1 > 999999) {
            this.$toast("购买数量不能大于999999");
            return
        }
        dp.promotionQit = Number(dp.promotionQit) + 1
        this.dpUpdateShopcart(dp)
      },
      ryzhPlus(dp, good) {
        if (Number(good.goods_qit) + 1 > 999999) {
          this.$toast("购买数量不能大于999999");
          return
        }
        good.goods_qit = Number(good.goods_qit) + 1
        this.zhUpdateShopcart(dp)
	    },
	    gdzhPlus(dp) {
        if (Number(dp.promotionQit) + 1 > 999999) {
          this.$toast("购买数量不能大于999999");
          return
        }
        dp.promotionQit = Number(dp.promotionQit) + 1
        this.zhUpdateShopcart(dp)
      },
      dpModifyNum: function (dp) {
        this.$messagebox.prompt('修改购买数量').then(({value,action}) => {
          if (action) {
              if (parseInt(value) > 999999) {
                  this.$toast("购买数量不能大于999999");
                  return
              }
              if (value > dp.maxQit && dp.maxQit != 0) {
                  Vue.$toast({
                      message: "购买数量不能多于" + dp.maxQit,
                  });
                  return
              }
              if (value === null) {
                  this.$toast({
                      message: "购买数量不能为空",
                  });
                  return
              }
              dp.promotionQit = value === null ? dp.promotionQit : parseInt(value)
              if (Number(dp.promotionQit) >= Number(dp.minQit)) {
                  this.dpUpdateShopcart(dp)
              } else {
                  this.$toast({
                      message: "不允许低于起订量：" + dp.minQit,
                  });
              }
          }
        }).catch(function() {})
      },
	    ryzhModifyNum(dp, good) {
        this.$messagebox.prompt('修改购买数量').then(({value,action})=> {
          if (action) {
            if (parseInt(value) > 999999) {
              this.$toast("购买数量不能大于999999");
              return
            }
            if (value > good.max_qit && good.max_qit != 0) {
              this.$toast({
                message: "购买数量不能多于" + good.max_qit,
              });
              return
            }
            if (value === null) {
              this.$toast({
                message: "购买数量不能为空",
              });
              return
            }
            good.goods_qit = value === null ? good.goods_qit : parseInt(value)
            if (good.goods_qit >= good.min_qit) {
              this.zhUpdateShopcart(dp)
            } else {
              this.$toast({
                message: "不允许低于起订量：" + good.min_qit,
              });
            }
          }
        }).catch(function() {})
      },
      gdzhModifyNum(dp) {
        this.$messagebox.prompt('修改购买数量').then(({value,action})=> {
          if (action) {
            if (parseInt(value) > 999999) {
                this.$toast("购买数量不能大于999999");
                return
            }
            if (value > dp.maxQit && dp.maxQit != 0) {
                this.$toast({
                    message: "购买数量不能多于" + dp.maxQit,
                });
                return
            }
            if (value === '') {
                this.$toast({
                    message: "购买数量不能为空",
                });
                return
            }
            dp.promotionQit = value === null ? dp.promotionQit : parseInt(value)
            if (Number(dp.promotionQit) >= Number(dp.minQit)) {
                this.zhUpdateShopcart(dp)
            } else {
                this.$toast({
                    message: "不允许低于起订量：" + dp.minQit,
                });
            }
          }
        }).catch(function() {})
      },
      zhCheckGift: function (dp, gift, giftItem) {
        let giftGoodsNum = giftItem.giftGoodsNum
        let num = 0
        giftItem.dpGiftGoodsList.forEach(function(val) {
            if (val.check_status == 'CHECK') {
                num++
            }
        })
        if (num >= giftGoodsNum && gift.check_status == 'UNCHECK') {
            this.$toast({
                message: "该区间的赠品只能选择" + giftGoodsNum + "件",
            });
            return;
        }
        if(gift.check_status == 'UNCHECK') {
        	gift.check_status = 'CHECK'
        } else {
        	gift.check_status = 'UNCHECK'
        }
        if (gift.check_status == 'UNCHECK') return
        this.zhUpdateShopcart(dp)
      },
			 gotoConfirm() { //结算
			 if(this.is_allowed_settlement){
     	    this.$router.push(`/shop/confirmOrder/confirmOrder`);
			 }else{
				 this.$toast('不满足起订金额')
			 }
     	},
     	gotoHome() {
     		this.$router.push(`/shop/base/home`);
     	}
		}
	}
</script>

<style scoped>
	#shoppingCar {
		height: 100%;
		padding-top: 88px;
		padding-bottom: 200px;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}
	.header {
		position: absolute;
		top: 0;
    width: 100%;
    height: 88px;
    line-height: 88px;
    background: linear-gradient(to left, #1e90ff, #4fe4fa);
    text-align: center;
    font-size: 34px;
    color: #fff;
    z-index: 10;
	}
	.header span {
		position: absolute;
		right: 24px;
		color: #fff;
		font-size: 30px;
	}
	.gys-tit {
		margin-bottom: 20px;
		padding: 20px 24px;
		background: #FFF;
	}
	.gys-tit p {
		width: 637px;
		font-size: 30px;
	}
	.radio-wrap span {
		display: inline-block;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		vertical-align: middle;
	}
	.radio-wrap .border {
		border: 0.5px solid #C7C7C7;
	}
	.radio-wrap span img {
		width: 34px;
		height: 34px;
		vertical-align: middle;
	}
	.main-goods .over {
    background: #ccc;
  }
	.main-goods-item {
		border-bottom: 0.5px solid #eee;
	}
	.main-goods-item>img,.goods>img,.gift-item>img {
		width: 175px;
		height: 175px;
	}
	.main-goods-item .text-detail,.gift-item .text-detail {
		position: relative;
		width: 444px;
	}
	.goods .text-detail {
		position: relative;
		width: 497px;
	}
	.stock_count {
		margin-top: 12px;
		color: #666666;
		font-size: 22px;
	}
	.sales_price {
		margin-top: 50px;
		color: #111;
			font-size: 26px;
	}

	.showMsg {
		position: absolute;
		right: 0;
		bottom: 5px;
	}

	.add-mod {
		position: absolute;
		bottom: 0;
		right: 0;
		border: 0.5px solid #CCCCCC;
	}
	.add-mod {
		border-radius: 8px;
	}
	.add-mod span {
		height: 46px;
		line-height: 46px;
	}
	.add-mod .btn-plus,.add-mod .btn-minus {
		width: 50px;
		background-size: 26px;
		background-repeat: no-repeat;
		background-position: center center;
	}
	.add-mod .btn-plus {
		background-image: url(../../../common/images/icon-add.png);
	}
	.add-mod .btn-minus {
		background-image: url(../../../common/images/icon-minus.png);
	}
	.add-mod .qit {
		width: 100px;
		border-left:0.5px solid #CCCCCC;
		border-right:0.5px solid #CCCCCC;
		text-align: center;
		font-size: 30px;
	}

	.wrap-settle {
		position: absolute;
		padding-left: 24px;
		bottom: 97px;
		width: 100%;
		height: 96px;
		background: #fff;
		z-index: 9;
		border-bottom: 0.5px solid #eee;
		border-top: 0.5px solid #eee;
	}
	.wrap-settle .amount {
		width: 386px;
		text-align: right;
	}
	.wrap-settle .pay_amount {
		font-size: 24px;
		color: #FF6754;
	}
	.wrap-settle .sum_goods_amount {
		color: #666666;
		font-size: 20px;
	}

.submit1{
	background: linear-gradient(to left, #1e90ff, #4fe4fa);
}
.submit2{
		background: #c1c1c1;
}
.amessage{
		position: absolute;
		padding-left: 24px;
		width: 100%;
		text-align: center;
		font-size: 22px;
		bottom: 193px;
		background:#7ECEF4;
		z-index:9; 
		color: #fff;
	}

.settle a{
		display: block;
		height: 96px;
		line-height: 96px;
		width: 198px;
		/* background: #c1c1c1; */
		color: #fff;
		text-align: center;
		font-size: 30px;
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
		margin-top: 220px;
		width: 138px;
	}
	.empty p {
		margin-top: 33px;
		font-size: 26px;
		color: #666666;
	}
	.empty .go-shopping {
		margin-top: 90px;
		width: 120px;
	}

	.zh-goods {
		margin-top: 20px;
	}
	.zh-goods-itme .title {
		padding: 20px 24px;
		border-bottom: 0.5px solid #eee;
		background: #fff;
	}
	.zh-goods-itme .title .arrow {
		width: 13px;
	}
	.title p {
		width: 600px;
	}
	.title p span {
		display: inline-block;
		margin-right: 20px;
		padding: 0 3px;
		color: #FF6754;
		border: 0.5px solid #FF6754;
		font-size: 26px;
		border-radius: 5px;
	}
	.zh-goods-itme {
		margin-bottom: 20px;
	}
	.zh-goods-itme .goods {
		padding: 30px 24px;
		border-bottom: 0.5px solid #eee;
		background: #fff;
	}
	.zh-goods-itme .gifts {

	}
	.gifts>p {
		padding: 20px 24px;
	}
	.gift-item,.order-gift .goods {
		background: #fff;
		padding: 30px 24px;
		border-bottom: 0.5px solid #eee;
	}
	.zh-goods-amount {
		position: relative;
	}
	.zh-goods-amount .add-mod {
		bottom: 70px;
		right: 24px;
	}
	.zh-goods-amount .payPrice span {
		font-size: 34px;
		color: #ff6754;
	}
	.zh-goods-amount .sumPrice span {
		margin-right: 20px;
		text-decoration: line-through;
	}
	.zh-goods-amount .sumPrice {
		margin-top: 10px;
		font-size: 26px;
		color: #666666;
	}
	.sales_price .gift_qit {
		color: #666666;
	}
</style>