import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/order/index'
import OrderDetails from '@/pages/order/orderDetails'
import PayMod from '@/pages/order/payMod'
import Shipped from '@/pages/order/shipped'
import GoodsList from '@/pages/order/goodsList'
import CkGoodsList from '@/pages/order/ck_goodsList'
import WaitGoodsList from '@/pages/order/wait_goodsList'
import Remark from '@/pages/order/remark'
import UploadFile from '@/pages/order/uploadFile'

import baseVue from '@/pages/shop/base'
import Home from '@/pages/shop/home/home'
import Promotion from '@/pages/shop/promotion/promotion'
import Zh_promotion_detail from '@/pages/shop/zh_promotion_detail/zh_promotion_detail' //组合促销详情
import Dp_promotion_detail from '@/pages/shop/dp_promotion_detail/dp_promotion_detail' //单品促销详情
import Search_goods_list from '@/pages/shop/search_goods_list/search_goods_list' //搜索商品列表

import Category from '@/pages/shop/category/category'
import Detail from '@/pages/shop/detail/detail'

import ShoppingCar from '@/pages/shop/shoppingCar/shoppingCar'
import ConfirmOrder from '@/pages/shop/confirmOrder/confirmOrder'
import AddFile from '@/pages/shop/confirmOrder/addFile'
import Success from '@/pages/shop/confirmOrder/success'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  scrollBehavior:()=> ({
    y: 0
  }),
  linkActiveClass:'active',
  routes: [
    {
      path: '/order/index',
      component: Index,
      meta:{
        title:'订单列表'
      }
    },
    {
      path: '/order/orderDetails/:id',
      component: OrderDetails,
      meta:{
        title:'订单详情'
      }
    },
    {
      path: '/order/payMod/:id',
      component: PayMod,
      meta:{
        title:'付款记录'
      }
    },
    {
      path: '/order/shipped/:id',
      component: Shipped,
      meta:{
        title:'出库/发货记录'
      }
    },
    {
      name:'GoodsList',
      path: '/order/goodsList/:status',
      component: GoodsList,
      meta:{
        title:'商品清单'
      }
    },
    {
      name:'CkGoodsList',
      path: '/order/ck_goodsList',
      component: CkGoodsList,
      meta:{
        title:'出库/发货商品清单'
      }
    },
    {
      path: '/order/wait_goodsList',
      component: WaitGoodsList,
      meta:{
        title:'待出库商品清单'
      }
    },
    {
      path: '/order/remark/:id',
      component: Remark,
      meta:{
        title:'备注信息'
      }
    },
    {
      path: '/order/uploadFile/:id',
      component: UploadFile,
      meta:{
        title:'订单附件'
      }
    },
    {
      path: '/shop/base',
      component: baseVue,
      children:[
        {
          path: '/shop/base/home',
          component: Home
        },
        {
          path: '/shop/base/category/:index',
          component: Category
        },
        {
          path: '/shop/base/shoppingCar',
          component: ShoppingCar
        },
        
        {path: "/shop/base", redirect: "/shop/base/home" }
      ]
    },
    //首页路由配置
    {
      path: '/shop/home/promotion',
      component: Promotion
    },
    {
      path: '/shop/home/zh_promotion_detail/:id',//组合详情
      component: Zh_promotion_detail
    },
    {
      path: '/shop/home/dp_promotion_detail/:id',//单品详情
      component: Dp_promotion_detail
    },
    {
      path: '/shop/home/search_goods_list/:keywords', //搜索商品列表
      component: Search_goods_list
    },
    {
      path: '/shop/detail',
      component: Detail
    },
    //购物车路由配置
    {
      path: '/shop/confirmOrder/confirmOrder',
      component: ConfirmOrder
    },
    {
      path: '/shop/confirmOrder/addFile',
      component: AddFile
    },
    {
      path: '/shop/confirmOrder/success/:id',
      component: Success
    },

    // {path: "/", redirect: "/shop/base" }
  ],
})