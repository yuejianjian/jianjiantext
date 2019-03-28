// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import {api} from './api/api.js'
import Animate from 'animate.css'
import 'mint-ui/lib/style.css'; 
import hybrid from './common/hybrid'
import VueAwesomeSwiper from 'vue-awesome-swiper'//轮播图插件
import { Loadmore } from 'mint-ui';
Vue.component(Loadmore.name, Loadmore);
Vue.use(VueAwesomeSwiper) //注册轮播图组件

Vue.use(MintUI)

Vue.prototype.api = api;

Vue.config.productionTip = false

Vue.prototype.$hybrid = hybrid;

/* eslint-disable no-new */


// api.login({
//   mobile:'18674022930',
//   login_password:'waxw1130',
//   gys_id:9,
//   gys_no:'M00000008'
// }).then(res=> {
// 	new Vue({
// 	  el: '#app',
// 	  router,
// 	  components: { App },
// 	  template: '<App/>'
// 	})
// })

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  console.log(to.meta.title);
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})


window.back = function(){
  router.back(-1)
}

var getUrlStr = function(name){
  let reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)","i");
  if(reg.test(window.location.href)){
      return unescape(RegExp.$2.replace(/\+/g," "))
  }
  return undefined
}
let h5_token = getUrlStr('h5_token');
let buyer_id = getUrlStr('buyer_id');
if(buyer_id) {
  if(buyer_id.indexOf('#')>-1) {
    buyer_id = buyer_id.substring(0,buyer_id.indexOf('#'))
  }
  sessionStorage.setItem('buyer_id',buyer_id)
} else {
  sessionStorage.removeItem('buyer_id')
}
if(h5_token) {
  if(h5_token.indexOf('#')>-1) {
    h5_token = h5_token.substring(0,h5_token.indexOf('#'))
  }
  sessionStorage.setItem('h5_token',h5_token)
} 
let exist_buyer_id = sessionStorage.getItem('buyer_id')
if(!exist_buyer_id||exist_buyer_id != undefined) {
  if(buyer_id) {
    router.push('/shop/base/home')
  } else {
    router.push('/order/index')
  }
}







