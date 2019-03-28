import axios from 'axios'
import Qs from 'qs'
import {hex_md5} from '../common/md5'
import { Indicator } from 'mint-ui'

// let routerMode = 'hash'
// export const apiUrl = 'https://api.dh.kxp1688.com'
// export const apiUrl = '/lp'
export const apiUrl = BASE_URL

const timeout = '';
const withCredentials = true;


//返回状态判断
axios.interceptors.response.use((res) => {
  if (!res.data.success) {
    return Promise.resolve(res);
  }
  return res;
}, (error) => {
  return Promise.reject(error);
});


let str = 'a=1'  //设置签名
//post请求
const post = (url, params, type) => {
  type === "qs" && (params = Qs.stringify(params))
  type === "json" && (params = JSON.stringify(params))

  let time =  new Date().getTime() *2;
  let sign = hex_md5(str.toUpperCase()+time);
  let token = sessionStorage.getItem('h5_token')
  let buyer_id = sessionStorage.getItem('buyer_id')

  let headers = {  //订单
    'Content-Type': 'application/json',
    'nonce_str':time,
    'sign':sign,
    'accessToken':token,
    'buyer_id':'',
    'is_dkxd':'N',
    'isCarSales':'N'
  }

  if(buyer_id) {
    headers = {  //代客下单
      'Content-Type': 'application/json',
      'nonce_str':time,
      'sign':sign,
      'accessToken':token,
      'buyer_id':buyer_id,
      'is_dkxd':'Y',
      'isCarSales':'N'
    }
  }

  if(url.indexOf('public') > -1) {
    headers = {
      'Content-Type': 'application/json',
      'nonce_str':time,
      'sign':sign,
    }
  }

  if(url.indexOf('uploadFile') > -1) {
    headers['Content-Type'] = 'multipart/form-data'
  }

  if(url.indexOf('deleteFile') > -1) {
    headers = {
      'Content-Type': 'application/json',
      'accessToken':token,
      'buyer_id':buyer_id,
      'is_dkxd':'Y',
      'isCarSales':'N'
    }
  }

  return new Promise((resolve, reject) => {
    // Indicator.open({
    //   text: '加载中wwwwww...',
    //   spinnerType: 'fading-circle'
    // });
    axios({
      method: 'post',
      url: url+'?' + str,
      baseURL: apiUrl,
      timeout: timeout,
      withCredentials: true,
      data: params,
      headers: headers,
    }).then(response => {
      // Indicator.close()
      // if(data.authStatus !== 'Y') { //token失效
      //   //需要告诉app重新登录
      //   return;
      // }
      resolve(response.data);
    }, err => {
      reject(err);
    })
      .catch((error) => {
        reject(error)
      })
  })
}



//get请求
const get = (url, params = '') => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      baseURL: apiUrl,
      timeout: timeout,
      withCredentials: withCredentials,
      params: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        
      }
    }).then(response => {
      resolve(response.data);
    }, err => {
      reject(err);
    })
      .catch((error) => {
        reject(error)
      })
  })
}


export const api = {
  //获取订单列表
  queryOrder:(data) => post('/api/kxdh/merchant/v1/order/queryOrder.do',data,'json'),
  //获取订单详情
  getOrderDetail:(data) => post('/api/kxdh/merchant/v1/order/getOrderDetail.do',data,'json'),
  //作废订单
  cancelOrder:(data) => post('/api/kxdh/merchant/v1/order/cancelOrder.do',data,'json'),
  //删除订单
  removeOrder:(data) => post('/api/kxdh/merchant/v1/order/removeOrder.do',data,'json'),
  //付款记录
  getPaymentInfo:(data) => post('/api/kxdh/merchant/v1/orderPayment/getOrderPaymentInfo.do',data,'json'),
  //筛选状态
  getOrderStatus:(data) => post('/api/kxdh/merchant/v1/public/getEnumListByName.do',data,'json'),
  //出库/发货记录
  getShippedList:(data) => post('/api/kxdh/merchant/v1/order/getShippedList.do',data,'json'),
  //待发货数量
  getDelivery:(data) => post('/api/kxdh/merchant/v1/order/getDeliveryList.do',data,'json'),
  //添加备注
  addRemark:(data) => post('/api/kxdh/merchant/v1/order/addRemark.do',data,'json'),
  //删除附件
  deleteFile:(data) => post('/api/kxdh/file/upload/deleteFile.do',data,'json'),
  //确认签收
  shippingReceived:(data) => post('/api/kxdh/merchant/v1/order/shippingReceived.do',data,'json'),
  //供应商
  getGysUserList:(data) => post('/api/kxdh/merchant/visitPlan/getGysUserListByDepartmentId.do',data,'json'),


  //首页模块相关接口
  lunbotu: (data) => post('/api/kxdh/merchant/banner/getBannerList.do', data, 'json'), //首页轮播图接口
  getHomePageTag: (data) => post('/api/kxdh/merchant/v2/tag/getHomePageTag.do', data, 'json'), //获取首页推荐标签
  getPromotionRecList: (data) => post('/api/kxdh/merchant/v1/promotion/getPromotionRecommendList.do', data, 'json'), //促销推荐接口
  getPromotionInfoList: (data) => post('/api/kxdh/merchant/v1/promotion/getPromotionList.do', data, 'json'), //获取首页全网优惠
  getHomeRecommendGoods: (data) => post('/api/kxdh/merchant/v1/goods/homeRecommendGoods.do', data, 'json'), //获取首页热销推荐接口
  getSearchGoods: (data) => post('/api/kxdh/merchant/v1/goods/searchGoods.do', data, 'json'), //搜索商品接口
  getDppromotion: (data) => post('/api/kxdh/merchant/v1/dppromotion/searchDPPromotion.do', data, 'json'), //单品促销接口
  getZhpromotion: (data) => post('/api/kxdh/merchant/v1/zhpromotion/searchZHPromotion.do', data, 'json'), //组合促销接口
  getZhpromotionDetail: (data) => post('/api/kxdh/merchant/v1/promotion/zhPromotionDetailUpdate.do', data, 'json'), //组合促销详情接口
  getDppromotionDetail: (data) => post('/api/kxdh/merchant/v1/promotion/dpPromotionDetailUpdate.do', data, 'json'), //单品促销详情接口
  yzCollection: (data) => post('/api/kxdh/merchant/v1/goods/collection/doJudgeToGoodsCollection.do', data, 'json'), //验证是否收藏
  addGoodsCollection: (data) => post('/api/kxdh/merchant/v1/goods/collection/addGoodsCollection.do', data, 'json'), //收藏接口
  delGoodsCollection: (data) => post('/api/kxdh/merchant/v1/goods/collection/delGoodsCollection.do', data, 'json'), //取消收藏接口
  addShopCart: (data) => post('/api/kxdh/merchant/v1/shopcart/addShopCart.do', data, 'json'), //点击加入进货单
  isShowkucun: (data) => post('/api/kxdh/merchant/v1/user/getGysIsStockOpen.do', data, 'json'), //获取供应商库存接口
  addPromotionShopCart: (data) => post('/api/kxdh/merchant/v1/promotionShopcart/addPromotionShopCart.do', data, 'json'), //单品促销购物车接口

  //商品模块接口
  categoryFun:(data) => post('/api/kxdh/merchant/v1/classificaion/quaryClassificaion.do',data,'json'),//商品分类
  detailsFun:(data) => post('/api/kxdh/merchant/v1/goods/searchGoods.do',data,'json'),//商品列表
  getBrandList:(data) => post('/api/kxdh/merchant/brand/ajax/getBrandList.do',data,'json'),//品牌筛选
  getGoodsDetail:(data) => post('/api/kxdh/merchant/v2/goods/getGoodsDetail.do',data,'json'),//品牌筛选
  getPromotionListByGoodId:(data) => post('/api/kxdh/merchant/v1/promotion/getPromotionListByGoodId.do',data,'json'),//组合商品


  //添加到购物车
  addShopCart:(data) => post('/api/kxdh/merchant/v1/shopcart/addShopCart.do',data,'json'),
  //购物车列表
  queryShopCartList:(data) => post('/api/kxdh/merchant/v1/shopcart/queryShopCartList.do',data,'json'),
  //更新购物车数据
  updateShopCart:(data) => post('/api/kxdh/merchant/v2/shopcart/updateShopCart.do',data,'json'),
  //确认订单
  confirmOrder:(data) => post('/api/kxdh/merchant/v1/order/confirmOrder.do',data,'json'),
  //收获地址列表
  queryMyAddressbook:(data) => post('/api/kxdh/merchant/v1/addressbook/queryMyAddressbook.do',data,'json'),
  //获取地区联动数据
  queryRegion:(data) => post('/api/kxdh/merchant/v1/public/queryRegion.do',data,'json'),
  //新增收获地址
  addNewItem:(data) => post('/api/kxdh/merchant/v1/addressbook/addNewItem.do',data,'json'),
  //编辑收获地址
  editItem:(data) => post('/api/kxdh/merchant/v1/addressbook/editItem.do',data,'json'),
  //删除收获地址
  delItem:(data) => post('/api/kxdh/merchant/v1/addressbook/delItem.do',data,'json'),
  //上传图片
  uploadFile:(data) => post('/api/kxdh/file/upload/uploadFile.do',data),
  //确认订单
  createOrder:(data) => post('/api/kxdh/merchant/v1/order/createOrder.do',data),

  //购物车金额
  getShopCartAmount:(data) => post('/api/kxdh/merchant/v1/shopcart/getShopCartAmount.do',data),
  updatePromotionShopCart:(data) => post('/api/kxdh/merchant/v1/promotionShopcart/updatePromotionShopCart.do',data),
} 

