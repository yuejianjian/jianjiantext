<template>
  <div id="remark">
    <div class="header">
      备注信息
      <a href="javascript:;" @click="goBack"></a>
    </div>

    <ul>
      <li v-for="item in remarkList">
        <p>{{item.remark}}</p>
        <div class="flex-item">
          <span>{{item.operateName}}</span>
          <span>{{item.createTime}}</span>
        </div>
      </li>
    </ul>
    <button class="add-remark" @click="addRemark">添加备注</button>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
export default {
	data() {
    return {
      remarkList:[],
    }
  },
  mounted() {
    this.getDetail();
  },
  methods:{
    getDetail() {
      this.api.getOrderDetail({order_id:this.$route.params.id}).then(res=> {
        if(res.callStatus == 'SUCCESS') {
          this.remarkList = res.data.gysOrderRemark
        }
      })
    },
    addRemark() {
      this.$messagebox.prompt('','',{
        message:'添加备注',
      }).then(({value,action}) => {
        if (action) {
          console.log(value)
          if(value==null){
            this.$toast("备注不能为空!");
            return
          }
          this.api.addRemark({orderId:this.$route.params.id,remark:value}).then(res=> {
            if(res.callStatus == 'SUCCESS') {
              this.getDetail();
            }
          })
        }
      }).catch(function () {})
    },
    goBack() {
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
  .header {
    height: 88px;
    line-height: 88px;
    text-align: center;
    background: #000;
    background: #1E90FF;
    color: #fff;
    font-size: 34px;
  }
  .header a {
    position: absolute;
    width: 88px;
    height: 88px;
    left: 0;
    top: 0;
    background: url(../../common/images/arrow-left.png) no-repeat center center;
    background-size: 21px 40px;
  }

	#remark {
		padding-top: 108px;
	}
  .add-remark {
    position: absolute;
    left: 50px;
    bottom: 20px;
    width: 650px;
    height: 60px;
    border: none;
    background: #1e90ff;
    border-radius: 10px;
    color: #FFF;
  }
  #remark ul li {
    padding: 20px 24px;
    background: #fff;
    border-bottom: 0.5px solid #EEEEEE;
  }
  #remark ul li p {
    margin-bottom: 20px;
  }
</style>
