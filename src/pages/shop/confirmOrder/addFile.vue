<template>
  <div id="uploadFile">
    <div class="header">
      订单附件
      <a href="javascript:;" @click="goBack"></a>
    </div>

    <p class="c-item">添加附件</p>

    <ul class="upImgList">
      <li v-for="(imgItem,idx) in imgList" :key="idx">
        <img :src="imgItem.file_url">
        <img @click="delImg(imgItem,idx)" class="delImg" src="@/common/images/del.png">
      </li>
      <li v-if="orderDetail.order_status!='Awaiting_order_review'&&orderDetail.order_status!='Completed'&&imgList.length < 5">
        <img src="@/common/images/add.png">
        <input type="file" accept="image/jpeg,image/jpg,image/png" @change="changeImage" id="j_detail_pic" ref="fileInput">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
	data() {
    return {
      orderDetail:{},
      imgList:[]
    }
  },
  mounted() {
    this.getDetail();
    this.imgList = JSON.parse(localStorage.getItem('imgList'))
  },
  methods:{
    getDetail() {
      this.api.confirmOrder({}).then(res=> {
        if(res.callStatus == 'SUCCESS') {
          this.orderDetail = res.data
          // this.imgList = this.imgList.concat(res.data.orderFile)
        }
      })
    },
    changeImage(e) {
      let fd = new FormData(); //创建表单数据对象
      fd.append('keyID', this.orderDetail.order_no);
      fd.append('bucketName', 'orderAttachment');
      fd.append('supplier_no', this.orderDetail.gys_no);
      let files = this.$refs.fileInput.files;
      let count = files.length;
      for (let index = 0; index < count; index++) {
        let file = files[index];
        fd.append('file', file); //将文件添加到表单数据中
        //   funs.previewImage(file);//上传前预览图片，也可以通过其他方法预览txt
      }

      this.api.uploadFile(fd).then(res=> {
        if(res.callStatus == 'SUCCESS') {
          this.imgList = this.imgList.concat(res.data);
          localStorage.setItem('imgList',JSON.stringify(this.imgList))
        }
      })
    },
    delImg(item, idx) {
      this.api.deleteFile({
        supplier_no: this.orderDetail.gys_no,
        bucketName: 'orderAttachment',
        keyID: this.orderDetail.order_no,
        file_key: item.file_key
      }).then(res=> {
        if(res.callStatus == 'SUCCESS') {
          this.imgList.splice(idx, 1)
          localStorage.setItem('imgList',JSON.stringify(this.imgList))
        }
      })
    },
    goBack() {
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
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

	#uploadFile {
		padding-top: 108px;
	}
  .upImgList img{
    width: 200px;
    height: 200px;
    border: 1px solid #ddd;
  }
  .upImgList li{
    margin: 20px 0 0 20px;
    float: left;
    position: relative;
  }
  .upImgList .delImg{
    border: 0;
    margin: 0;
    position: absolute;
    width: 40px;
    height: 40px;
    top: -16px;
    right: -16px;
  }
  .upImgList input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    opacity: 0;
  }
</style>
