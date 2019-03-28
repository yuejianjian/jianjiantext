<template>
  <div id="orderDetails">
		<div class="header">
			确认订单
			<a href="javascript:;" @click="goBack"></a>
		</div>

    <div @click="showAddress = true" class="receive-info c-item flex-item" v-if="addressList.length>0">
    	<img src="@/common/images/ic_map.png" alt="">
    	<div>
    		<p>{{curAddress.contactPerson}} {{curAddress.contactPhone}}</p>
    		<p class="address">{{curAddress.ssx}}{{curAddress.address}}</p>
    	</div>
    	<img class="arrow-right" src="@/common/images/arrow-right.png" alt="">
    </div>
	<div>
		<img src="@/common/images/iv_bian.png" style="width: 100%;height: 3px;">
	</div>

    <div class="c-item">
    	<div class="wrap-list flex-item" v-if="confirm_goods_list.length>1">
    		<ul class="goods-list flex-item">
	    		<li v-for="(item,index) in confirm_goods_list" :key="index">
	    			<img :src="item.photo_url||'../../static/404.png'" alt="">
	    		</li>
	    	</ul>
	    	<div class="more" @click="gotoGoodsList">
	    		<div>商品清单</div>
					<div>共{{orderDetail.total_goods_count}}件<img src="@/common/images/arrow-right.png" alt=""></div>
	    	</div>
    	</div>

    	<div class="only-one flex-item" v-if="confirm_goods_list.length == 1">
    		<img :src="confirm_goods_list[0].photo_url||'../../static/404.png'" alt="">
				<div class="text-detail">
					<p class="goods_name line-clamp2">{{confirm_goods_list[0].goods_name}}</p>
					<p class="sales_price flex-item"><span>￥{{confirm_goods_list[0].sales_price}}/{{confirm_goods_list[0].specific_name}}</span><span class="goods_qit">x{{confirm_goods_list[0].goods_qit}}</span></p>
				</div>
    	</div>
    </div>


   
    <div class="other-info">
    	<div @click="showPayMethodsList">
	    	<span>付款方式</span>
	    	<span>{{paymethod_desc}}<img src="@/common/images/arrow-right.png" alt=""></span>
	    </div>
    	<div @click="nothing">
    		<span>开具发票</span>
    		<span>不需要发票<img src="@/common/images/arrow-right.png" alt=""></span>
    	</div>
    	<div @click="nothing">
    		<span>优惠券</span>
    		<span>选择优惠券/无可用<img src="@/common/images/arrow-right.png" alt=""></span>
    	</div>
    	<div @click="changeDate">
    		<span>交货日期</span>
    		<span>{{dateValue || '请选择'}}<img src="@/common/images/arrow-right.png" alt=""></span>
    	</div>
    	<div @click="gotoAddFile">
    		<span>订单附件</span>
    		<span>添加附件<img src="@/common/images/arrow-right.png" alt=""></span>
    	</div>
    </div>

    <div class="c-item">
    	<div class="pay-amount flex-item">
    		<span>共{{orderDetail.total_goods_count}}种{{orderDetail.total_goods_qit}}件</span>
    		<span>应付金额: ￥{{orderDetail.pay_amount | formatMoney}}</span>
    	</div>
    	<div class="total-amount">
    		<span>优惠金额:<em>￥{{orderDetail.discount_amount | formatMoney}}</em></span>
    		<span>商品总额:￥{{orderDetail.sum_goods_amount | formatMoney}}</span>
    	</div>
    </div>

    <div class="message-item">
    	<p>给商家留言</p>
			<textarea placeholder="请输入你的留言：" v-model="message"></textarea>
    </div>

    <!-- 底部结算 -->
	  <div class="mod-submit flex-item">
	  	<div><em>￥{{orderDetail.pay_amount|formatMoney}}</em></div>
	  	<a href="javascript:;" @click="submitOrder">提交</a>
	  </div>

		<!-- 收获地址列表 -->
    <div class="mod-address" v-show="showAddress">
    	    <div class="header">
				收货地址
				<a href="javascript:;" @click="showAddress = false"></a>
				<span @click="addAddress" style="font-size: 12px;">添加新地址</span>
			</div>
			<ul class="address-list">
				<li class="flex-item" v-for="(item,index) in addressList"  :key="index" @click="changeAddress(item,index)">
					<div class="radio-wrap" :class="{'border':!item.isCheck}"><img src="@/common/images/icon-radio.png" alt="" v-show="item.isCheck"></div>
					<div class="text-details">
						<p class="person"><span class="name">{{item.contactPerson}}</span><span>{{item.contactPhone}}</span><span v-if="item.isdefault == 'Y'" class="default">默认</span></p>
						<p class="all-address">{{item.ssx}}{{item.address}}</p>
					</div>
					<img class="icon-edit" src="@/common/images/icon-edit.png" alt="" @click.stop="editAddress(item)">
				</li>
			</ul>
    </div>

    <!-- 编辑收货地址 -->
    <div class="edit-address" v-show="showEditAddress">
    	<div class="header">
				编辑收货地址
				<a href="javascript:;" @click="showEditAddress = false"></a>
				<span v-if="updateType == 'edit'" @click="deleteAddress">删除</span>
			</div>

			<div class="wrap-data">
				<div>
					<span class="">收货人：</span>
					<input type="text" v-model="updateAddressData.contactPerson">
				</div>
				<div>
					<span class="">联系方式：</span>
					<input type="text" v-model="updateAddressData.contactPhone">
				</div>
				<div class="flex-item" @click="showPop">
					<div>
						<span class="">收货地址：</span>
						<em>{{updateAddressData.ssx}}</em>
					</div>
					<img src="@/common/images/arrow-right.png" alt="">
				</div>
				<textarea v-model="updateAddressData.address"></textarea>
				<div>
					<div class="radio-wrap1" @click="updateAddressData.isdefault=='Y'?updateAddressData.isdefault='N':updateAddressData.isdefault='Y'">
						<span :class="{'border':updateAddressData.isdefault=='N'}">
							<img src="@/common/images/icon-radio.png" alt="" v-show="updateAddressData.isdefault=='Y'">
						</span>默认地址
					</div>
					<span class="remind">注：选中后每次下单会使用该地址</span>
				</div>
			</div>
			<div class="btn-save" @click="updateAddress">保存并使用</div>

			<mt-popup v-model="popupVisible" :closeOnClickModal="false" position="bottom">
				<a href="javascript:;" @click="saveChange">确定</a>
				<mt-picker value-key="name" :slots="slots" @change="onValuesChange"></mt-picker>
			</mt-popup>
    </div>

    <!-- 选择附件方式 -->
    <mt-popup v-model="showPayMethods" position="bottom" class="pay-methods">
  		<p>付款方式</p>
  		<ul>
  			<li v-for="(item,index) in payMethodList" :key="index" class="flex-item" @click="changeMethods(item,index)">
  				<span>{{item.paymethod_desc}}</span>
  				<span class="sp-radio">
  					<img v-show="item.isSelected" src="@/common/images/icon-radio.png" alt="">
  					<img v-show="!item.isSelected" src="@/common/images/icon-radio1.png" alt="">
  				</span>
  			</li>
  		</ul>
		</mt-popup>

		<!-- 选择日期 -->
		<mt-datetime-picker
	    ref="picker"
	    type="date"
		:startDate="new Date()"
	    year-format="{value} 年"
	    month-format="{value} 月"
 	    date-format="{value} 日"
	    v-model="pickerValue"  
        @confirm="selectDate">
	  </mt-datetime-picker>

	  
  </div>
</template>

<script>
import {formatDate} from '@/utils/util.js'
import 'mint-ui/lib/style.css'

export default {
  data() {
    return {
      orderDetail:{
      	gysOrderRemark:[],
      	orderFile:[]
      },
      confirm_goods_list:[],

      addressList:[],
      curAddress:{},
      showAddress:false,
      showEditAddress:false,
      slots:[
        {
          flex: 1,
          // defaultIndex: 1,
          values: [],
          className: 'slot',
          textAlign: 'center'
        }
      ],
      popupVisible:false,
      updateAddressData:{
      	address:'',
				cityId:'',
				contactPerson:'',
				contactPhone:'',
				countyId:'',
				id:'',
				isdefault:'',
				provinceId:'',
				ssx:'',
      },
      updateType:'',
      curRegion:{},

      showPayMethods:false,
      payMethodList:[],
      paymethod_type:'',
      paymethod_desc:'',
      pickerValue: new Date(),
	  dateValue: '',
	  //new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(),
      message:''
    }
  },
  mounted() {
    this.getDetail();
    this.queryMyAddressbook()
  },
  filters:{
    formatMoney(val) {
      if(!isNaN(val)) {
        return val.toFixed(2);
      }
    }
  },
  methods:{
    getDetail() {  //获取订单数据
      this.api.confirmOrder({}).then(res=> {
        if(res.callStatus == 'SUCCESS') {
          this.orderDetail = res.data
          this.confirm_goods_list = this.confirm_goods_list.concat(res.data.confirm_goods_list).concat(res.data.gift_list)
          this.confirm_goods_list = this.confirm_goods_list.splice(0,3);
          this.payMethodList = res.data.pay_method_list
          this.payMethodList.forEach(item=> {
		    		item.isSelected = false
		    	})
		    	this.payMethodList[0].isSelected = true
		    	this.paymethod_desc = this.payMethodList[0].paymethod_desc
		    	this.paymethod_type = this.payMethodList[0].paymethod_type
        }
      })
    },
    queryMyAddressbook() {  //获取收货地址列表
    	this.api.queryMyAddressbook({}).then(res=> {
        if(res.callStatus == 'SUCCESS') {
          this.addressList = res.data
          this.addressList.forEach(item=> {
		    		if(item.isdefault == 'Y') {
		    			item.isCheck = true
		    		} else {
		    			item.isCheck = false
		    		}
		    	})
		    	this.curAddress = this.addressList[0]
        }
      })
    },
    changeAddress(item,index) {  //切换收货地址
    	this.addressList.forEach(i=> {
    		i.isCheck = false
    	})
    	this.addressList[index].isCheck = true
    	this.addressList.push({})
    	this.addressList.pop()
    	this.curAddress = item
    	this.showAddress = false
    },
    editAddress(item) { //编辑收货地址
    	this.showEditAddress = true
    	this.updateAddressData.address = item.address
    	this.updateAddressData.cityId = item.cityId
    	this.updateAddressData.contactPerson = item.contactPerson
    	this.updateAddressData.contactPhone = item.contactPhone
    	this.updateAddressData.countyId = item.countyId
    	this.updateAddressData.id = item.id
    	this.updateAddressData.isdefault = item.isdefault
    	this.updateAddressData.provinceId = item.provinceId
    	this.updateAddressData.ssx = item.ssx
    	this.updateType = 'edit'
    },
    addAddress() {
    	this.showEditAddress = true
    	this.updateAddressData.address = ''
    	this.updateAddressData.cityId = ''
    	this.updateAddressData.contactPerson = ''
    	this.updateAddressData.contactPhone = ''
    	this.updateAddressData.countyId = ''
    	this.updateAddressData.id = ''
    	this.updateAddressData.isdefault = 'N'
    	this.updateAddressData.provinceId = ''
    	this.updateAddressData.ssx = ''
    	this.updateType = 'add'
    },
    showPop() {
    	this.popupVisible = true
    	this.queryRegion(0)
    	this.updateAddressData.ssx = ''
    },
    queryRegion(id) {
    	this.api.queryRegion({parentRegionID:id}).then(res=> {
        if(res.callStatus == 'SUCCESS') {
        	this.slots[0].values = res.data
        }
      })
    },
    onValuesChange(picker, values) {
      this.curRegion = values[0]
    },
    saveChange() {
    	if(this.curRegion.level == 1) {
    		this.updateAddressData.provinceId = this.curRegion.id
    		this.queryRegion(this.curRegion.id)
    	}
    	if(this.curRegion.level == 2) {
    		this.updateAddressData.cityId = this.curRegion.id
    		this.queryRegion(this.curRegion.id)
    	}
    	if(this.curRegion.level == 3) {
    		this.updateAddressData.countyId = this.curRegion.id
    		this.popupVisible = false
    	}
    	this.updateAddressData.ssx+=this.curRegion.name
    },
    updateAddress() {//提交新增/编辑收货地址
    	console.log(this.updateAddressData)
    	console.log(this.updateType)
    	if(this.updateType == 'add') {
    		this.api.addNewItem(this.updateAddressData).then(res=> {
	        if(res.callStatus == 'SUCCESS') {
	        	this.showEditAddress = false
	        	this.queryMyAddressbook()
	        }
	      })
    	} else {
    		this.api.editItem(this.updateAddressData).then(res=> {
	        if(res.callStatus == 'SUCCESS') {
	        	this.showEditAddress = false
	        	this.queryMyAddressbook()
	        }
	      })
    	}
    },
    deleteAddress() { //提交删除收货地址
    	this.api.delItem(this.updateAddressData).then(res=> {
        if(res.callStatus == 'SUCCESS') {
        	this.showEditAddress = false
        	this.queryMyAddressbook()
        }
      })
    },
    showPayMethodsList() {
    	this.showPayMethods = true
    },
    changeMethods(item,index) {
    	this.paymethod_type = item.paymethod_type
    	this.paymethod_desc = item.paymethod_desc
    	this.payMethodList.forEach(i=>{
    		i.isSelected = false
    	})
    	this.payMethodList[index].isSelected = true
    	this.payMethodList.push({})
    	this.payMethodList.pop()
    	this.showPayMethods = false
    },
    changeDate() {
    	this.$refs.picker.open()
    },
    selectDate(val) {
    	this.dateValue = formatDate(val)
    },
    gotoGoodsList() { //跳转商品清单
    	localStorage.setItem('orderDetail',JSON.stringify(this.orderDetail))
    	this.$router.push('/order/goodsList/confirm');
    },
    gotoAddFile() {
    	this.$router.push('/shop/confirmOrder/addFile');
    },
    submitOrder() {  //提交订单
    	let submitData = {
    		order_no:this.orderDetail.order_no,
    		pay_method:this.paymethod_type,
    		recipient_address_id:this.curAddress.id,
    		order_seq:this.orderDetail.order_seq,
    		order_message:this.message,
    		hope_recipient_time:this.dateValue
    		// gysOrderInvoice:''
    	}
    	this.api.createOrder(submitData).then(res=> {
        if(res.callStatus == 'SUCCESS') {
        	localStorage.removeItem('imgList')
        	this.$router.push(`/shop/confirmOrder/success/${res.data.id}`);
        }
      })
    },
    goBack() {
    	this.$router.back(-1)
    },
    nothing() {
    	this.$toast('努力开发中！')
    }
  }
}
</script>

<style scoped>
	#orderDetails {
		padding-top: 108px;
		padding-bottom: 120px;
	}
	.header {
		position: fixed;
		top: 0;
		width: 100%;
		height: 88px;
		line-height: 88px;
		text-align: center;
		font-size: 34px;
		border-bottom: 0.5px solid #CCCCCC;
		background: #fff;
	}
	.header a {
		position: absolute;
		width: 88px;
		height: 88px;
		left: 0;
		top: 0;
		background: url(../../../common/images/arrow-left1.png) no-repeat center center;
		background-size: 21px 40px;
	}

	#orderDetails>div {
		/* margin-bottom: 20px; */
	}
	.order-num span:last-child {
		color: #FF6754;
	}
	.receive-info img {
		width: 30px;
	}
	.receive-info .arrow-right {
		width: 14px;
	}
	.receive-info div {
		width: 620px;
	}
	.receive-info .address {
		margin-top: 16px;
		color: #666666;
		font-size: 26px;
	}

	.wrap-list {
		border-bottom: 0.5px solid #EEEEEE;
	}
	.wrap-list .more{
		padding-top: 45px;
		height: 175px;
		padding-left: 30px;
		box-shadow: -3px 0px 5px #f2f2f2;
	}
	.wrap-list .more img {
		margin-left: 10px;
		width: 10px;
	}
	.goods-list li {
		padding: 20px 0;
	}
	.goods-list li img {
		width: 175px;
	}
	.goods-list .text-detail {
		position: relative;
		padding-bottom: 104px;
		width: 497px;
	}
	.text-detail>div {
		position: absolute;
		bottom: 0;
		width: 100%;
		font-size: 26px;
	}
	.text-detail .spec {
		margin-top: 15px;
		font-size: 26px;
		color: #929292;
	}
	.text-detail .unit-price {
		font-size: 28px;
		color: #FF6754;
	}
	.total-amount {
		margin-top: 15px;
		text-align: right;
		font-size: 24px;
		color: #666666;
	}
	.total-amount span:first-child {
		margin-right: 20px;
	}
	.total-amount em {
		color: #FF6754;
	}

	.other-info,.logs {
		padding: 0 24px;
		background: #fff;
	}
	.other-info>div {
		display: flex;
	    align-items: center;
	    justify-content: space-between;
		padding: 15px 0;
		border-bottom: 0.5px solid #EEEEEE;
	}
	.other-info>div img {
		margin-left: 20px;
		width: 13px;
		vertical-align: middle;
	}
	.other-info .orderRemark,.other-info .orderFile {
		color: #1e90ff;
	}



	.mod-address,.edit-address {
		position: fixed;
		padding-top: 88px;
		top: 0;
		width: 100%;
		height: 100%;
		background: #F6F6F6;
	}
	.radio-wrap {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		vertical-align: middle;
	}
	.radio-wrap1 {
		display: inline-block;
	}
	.radio-wrap1 span {
		margin-right: 10px;
		display: inline-block;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		vertical-align: middle;
	}
	.radio-wrap1 .border,.radio-wrap.border {
		border: 0.5px solid #C7C7C7;
	}
	.radio-wrap img,.radio-wrap1 img {
		width: 34px;
		height: 34px;
		vertical-align: middle;
	}
	.icon-edit {
		width: 42px;
		height: 41px;
	}
	.address-list li {
		padding: 30px 35px;
		border-bottom: 0.5px solid #ddd;
		background: #fff;
	}
	.address-list .text-details {
		width: 528px;
	}
	.address-list .person {
		font-size: 30px;
		color: #000;
	}
	.person .name {
		margin-right: 20px;
	}
	.person .default {
		display: inline-block;
		width: 80px;
		height: 35px;
		line-height: 35px;
		color: #fff;
		font-size: 22px;
		text-align: center;
		background: #FF6754;
		border-radius: 8px;
		margin-left: 20px;
	}
	.address-list .all-address {
		margin-top: 15px;
		font-size: 26px;
		color: #333;
	}
	.mod-address .add-item {
		position: absolute;
		bottom: 0;
		padding: 30px 0;
		width: 100%;
		background: #fff;
		text-align: center;
		color: #1E90FF;
		font-size: 30px;
	}
	.mod-address .add-item span {
		display: inline-block;
		margin-right: 20px;
		width: 38px;
		height: 38px;
		line-height: 38px;
		border-radius: 50%;
		border: 1px solid #1E90FF;
		vertical-align: middle;
	}

	.wrap-data {
		margin-top: 20px;
		padding: 0 24px;
		background: #fff;
	}
	.wrap-data>div {
		padding: 30px 0;
		border-bottom: 0.5px solid #EBEAEA;
	}
	.wrap-data .flex-item img {
		width: 13px;
	}
	.wrap-data>div span {
		font-size: 30px;
	}
	.wrap-data>div em {
		color: #666;
	}
	.wrap-data textarea {
		padding: 20px;
		width: 702px;
		height: 110px;
		border: 0.5px solid #D2D2D2;
		resize: none;
		color: #666;
	}
	.wrap-data .remind {
		margin-left: 20px;
		font-size: 26px;
		color: #999;
	}
	.btn-save {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 98px;
		line-height: 98px;
		color: #fff;
		background: #1E90FF;
		text-align: center;
		font-size: 34px;
	}

	.edit-address .mint-popup,.edit-address .picker {
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
	.header span {
		position: absolute;
		right: 24px;
		font-size: 32px;
		color: #1e90ff;
	}

	#orderDetails .pay-methods {
		margin: 0;
		width: 100%;
		text-align: center;
	}
	.pay-methods p {
		line-height: 80px;
		font-size: 30px
	}
	.pay-methods ul li {
		padding: 30px 0;
		margin: 0 30px; 
		border-bottom: 0.5px solid #ccc;
	}
	.pay-methods ul li img {
		width: 34px;
		height: 34px;
	}

	#orderDetails .mod-submit {
		position: fixed;
		margin: 0;
		padding-left: 24px;
		bottom: 0;
		width: 100%;
		height: 98px;
		background: #fff;
		border-top: 0.5px solid #eee;
	}
	.mod-submit div {
		color: #FF6754;
		font-size: 26px;
	}
	.mod-submit div em {
		font-size: 34px;
	}
	.mod-submit a {
		width: 200px;
		height: 98px;
		line-height: 98px;
		background: #1E90FF;
		color: #fff;
		font-size: 34px;
		text-align: center;
	}

	.message-item {
		padding: 20px 24px;
		background: #fff;
	}
	.message-item textarea {
		width: 702px;
		height: 100px;
		resize: none;
		background: #F6F6F6;
		padding: 15px;
	}

	.only-one .text-detail {
		position: relative;
		width: 497px;
	}
	.text-detail .sales_price {
		margin-top: 50px;
		color: #FF6754;
	}
	.only-one img {
		width: 175px;
		height: 175px;
	}
	.sales_price .goods_qit {
		color: #666;
	}
</style>
