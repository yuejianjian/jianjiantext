function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export const formatMoney = (val) => {
  if(!isNaN(val)) {
    return val.toFixed(2);
  }
}


//获取url参数的值
export function GetQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return "";
}


//日期时间格式化
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//日期时间格式化
export const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

//补0
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//表单验证
export const vertify = {
  isName : str => {
    let reg = /^[\u4E00-\u9FA5]{2,6}$/;
    return reg.test(str);
  },
  isTel : str => {
    let reg = /^1[234578][0-9]\d{8}$/;
    return reg.test(str);
  },
  isIdCard : str => {
    let reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
    return reg.test(str);
  },
  isEmail: str => {
    let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return reg.test(str);
  }
}


//数组从小到大排序
export function sortArr(arr) {
  for(let i=0;i<arr.length;i++){
    for(let j = i + 1;j<arr.length;j++){
      if(arr[i]>arr[j]){
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
    }
  }
  return arr;
}

//数组去重复
export function unique(arr) {
  let result = [], hash = {};   //hash为hash表，result为临时数组
  for (let i = 0, elem; (elem = arr[i]) != null; i++) {  //遍历当前数组
    if (!hash[elem]) {   //如果hash表中没有当前项
      result.push(elem);  //把当前数组的当前项push到临时数组里面
      hash[elem] = true;   //存入hash表
    }
  }
  return result;
}

//判断访问终端
export const browser={
  versions:function(){
    let u = navigator.userAgent, app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };
  }(),
  language:(navigator.browserLanguage || navigator.language).toLowerCase()
}


//从一个给定的数组arr中,随机返回num个不重复项
export function getArrayItems(arr, num) {
  let temp_array = new Array();
  for (let index in arr) {
    temp_array.push(arr[index]);
  }
  let return_array = new Array();
  for (let i = 0; i < num; i++) {
    if (temp_array.length > 0) {
      let arrIndex = Math.floor(Math.random() * temp_array.length);
      return_array[i] = temp_array[arrIndex];
      temp_array.splice(arrIndex, 1);
    } else {
      break;
    }
  }
  return return_array;
}

//数组随机打乱顺序
export function randArray(data){
  //获取数组长度
  let arrlen = data.length;
  //创建数组 存放下标数
  let try1 = new Array();
  for(let i = 0;i < arrlen; i++){
    try1[i] = i;
  }
  //创建数组 生成随机下标数
  let try2 = new Array();
  for(let i = 0;i < arrlen; i++){
    try2[i] = try1.splice(Math.floor(Math.random() * try1.length),1);
  }
  //创建数组，生成对应随机下标数的数组
  let try3 = new Array();
  for(let i = 0; i < arrlen; i++){
    try3[i] = data[try2[i]];
  }
  return try3;
}