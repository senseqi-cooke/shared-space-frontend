<template>
  <div class="app-container">
    <div class="main-panel">
      <view ref="form" class="content" :model="form" :rules="rules" label-width="100px">
        <div class="title">充值规则设置</div> 
        <view v-for="(item, index) in form.rechargeItem" :key="index">
          <view :span="24">
            <view class="recharge-item">
				
			  <view style="width: 175px;">	
					<u--input v-model="item.rechargeAmount" class="recharge-input" placeholder="充值金额，单位：元" maxlength="10" />
					<span class="recharge-tips">赠送</span>
					<u--input v-model="item.giveAmount" class="give-input"   placeholder="赠送金额，单位：元" maxlength="10" />
					<span class="remove el-icon-delete" @click="removeRechargeItem(index)">删除</span>
              </view>
			  
<!-- 			  <view style="width: 100px;">	
				<u--input v-model="item.giveAmount" class="give-input"   placeholder="赠送金额" maxlength="10" />
              </view>
			  
			  <span class="remove el-icon-delete" @click="removeRechargeItem(index)">删除</span> -->
			  
            </view>
          </view>
        </view>
        <div class="operate"><span class="el-icon-plus" @click="addRechargeItem()">添加</span></div>
        <el-row>
          <el-col :span="12">
            <el-form-item class="recharge-item">
				
             <!-- <u--input v-model="form.remark" rows="4" type="textarea" placeholder="请输入充值说明" maxlength="1000" /> -->
			  <!-- <rich-text :nodes="nodes"></rich-text> -->
			  
<!-- 			<editor id="editor" class="ql-container" placeholder="开始输入..." showImgSize showImgToolbar showImgResize
			  	@statuschange="onStatusChange" :read-only="false" @ready="onEditorReady" @blur="getContents">
			</editor> -->
			 <view style="width: 300px;">	
				<u--textarea placeholder="请输入充值说明" placeholderClass="joinPla" v-model="form.remark" style="width: 150px;">
					
				</u--textarea>
			</view>	
            </el-form-item>
			
          </el-col>
        </el-row>
		<!-- <rich-text-editor v-model="richText"></rich-text-editor> -->
		<view style="margin-top: 15px;">
			<radio-group v-model="form.status"  @change="(e) => onChangeMarkChoose(e)">
			  <radio key="A" label="A" value="A" style="margin: 10px;" :checked="form.status=='A'">开启</radio>
			  <radio key="D" label="D" value="D" style="margin: 10px;" :checked="form.status=='D'">关闭</radio>
			</radio-group>
		</view>
<!--        <el-row>
          <el-col :span="24">
            <el-form-item class="recharge-status" label="开启状态">
              <el-radio-group v-model="form.status">
                <el-radio key="A" label="A" value="A">开启</el-radio>
                <el-radio key="D" label="D" value="D">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row> -->
      </view>
	  
<!--      <div slot="footer" class="footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div> -->
		<view class="formBox" style="padding-bottom: 20rpx;">
			<view class="button" @click="submitForm">
				保 存
			</view>
		</view>	  
    </div>
  </div>
</template>

<script>
import { getSettingInfo, saveSetting } from "@/api/balance";
//import RichTextEditor from "@/components/RichText/RichTextEditor.vue"
//import { getInfo } from '@/api/login'
export default {
/*  components:{
  	RichTextEditor
  }, */	
  name: "BalanceSetting",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 门店ID,默认0为平台,大于0表示具体门店
      storeId:0,
	  richTextData: '<p>这是一段<b>加粗</b>的<i>斜体</i>文字</p>',
      // 表单参数
      form: { rechargeItem: [], remark: '', status: "A",storeId: 0 },
      queryParams: {
        storeId: 0
      },
	  storeId:0,
      // 表单校验
      rules: {
        rechargeItem: [
          { required: true, message: "充值项不能为空", trigger: "blur" }
        ],
      }
	  //richText:'这里是初始内容'			
	  /* ,
	  nodes: [
	                  {
	                      name: 'div',
	                      attrs: {
	                          class: 'div_class',
	                          style: 'line-height: 60px; color: red;'
	                      },
	                      children: [
	                          {
	                              type: 'text',
	                              text: 'Hello&nbsp;World!'
	                          },
	                          {
	                              name:"img",
	                              attrs: {
	                                  style: 'width: 100px;',
	                                  src:'http://photocdn.sohu.com/20120910/Img352705474.jpg'
	                              },
	                          }
	                      ]
	                  },
	              ] */
    };
  },
/*  watch:{
	richText(){
		console.log(this.richText);
	}
  }, */ 
  created() {
    //this.GetInfo();
    this.settingInfo();
  },
  onLoad(e) {
	  this.queryParams.storeId = e.storeId;
	  this.form.storeId = e.storeId;
  },	  
  activated() {
    //this.GetInfo();
    this.settingInfo();
  },
  methods: {
    // 添加充值项
    addRechargeItem() {
       this.form.rechargeItem.push({ rechargeAmount: '', giveAmount: '' })
    },
    //  删除充值项
    removeRechargeItem(i) {
      console.log(i)
      const rechargeItem = []
      this.form.rechargeItem.forEach(function(item, index){   
         if (i !== index) {
           rechargeItem.push(item)
         }
      })
      this.form.rechargeItem = rechargeItem
    },
	onChangeMarkChoose(e) {
		this.form.status = e.detail.value;
		console.log(e.detail.value);
	},
    // 获取用户信息
/*    GetInfo() {
        getInfo().then(res => {
          let data = res;
          console.info('data:'+JSON.stringify(data))
          console.info("data.storeId="+data.storeId);
          this.storeId = data.storeId;
          this.queryParams.storeId = this.storeId;
          //setUserInfo(res, commit)
          //resolve(res)
        }).catch(error => {
          //reject(error)
        })
    }, */
    // 查询账户列表
    settingInfo() {

      //console.info("store.state.user="+JSON.stringify(this.$store.state.user.user.storeId));

      this.loading = true;
      //getInfo().then(res => {
        //let data = res;
        //console.info('data:'+JSON.stringify(data))
        //console.info("data.storeId="+data.storeId);
        //console.info("this.$store.state.user.user.storeId:"+this.$store.state.user.user.storeId);
        //this.storeId = this.$store.state.user.user.storeId;
        //this.queryParams.storeId = this.$store.state.user.user.storeId;
        getSettingInfo(this.queryParams).then(response => {
            this.form.rechargeItem = response.data.rechargeRuleList;
            this.form.remark = response.data.remark;
            this.form.status = response.data.status;
            this.loading = false;
          }
        ); 
        //setUserInfo(res, commit)
        //resolve(res)
      //}).catch(error => {
        //reject(error)
      //})
    },
    // 取消按钮
    cancel() {
      //this.$store.dispatch('tagsView/delView', this.$route)
      //this.$router.push( { path: '/balance/list' } );
    },
    // 保存成功
    submitForm: function() {
      //this.form.storeId = this.$store.state.user.user.storeId;
      //this.$refs["form"].validate(valid => {
      //  if (valid) {
            saveSetting(this.form).then(res => {
				if (res.status == 200) {
					uni.showToast({
					  title: '保存成功',
					  icon: 'success',
					  duration: 5000,
					})
					this.settingInfo();
				}	
            });
        //}
      //});
    }
  }
};
</script>
<style>
	page{
		background: #f8f8fa;
	}
	.joinPla{
		color: #d8d8d8;
		font-size: 24rpx;
		width: 50px;
	}
</style>
<style rel="stylesheet/scss" lang="scss">
	//main-container全局样式
/* 	.app-container {
	  padding: 20px 20px 45px 20px;

	} */

	.formBox{
		width: 100%;
		height: auto;
		.button{
			width: 60%;
			height: auto;
			padding: 25rpx 0;
			border-radius: 50rpx;
			background: linear-gradient(to right,#f082e8,#b3835b);
			text-align: center;
			color: #fff;
			margin: 60rpx auto 0;
		}
	}		
	.main-panel {
	  .content {
	    margin-left: 30px;
	    .title {
	       padding-left: 100px;
	       font-size: 18px;
	       height: 50px;
	    }
	    .operate {
	      padding-left: 120px;
	      height: 50px;
	      .el-icon-plus {
	         border: #FFFFFF solid 1px;
	         padding: 5px;
	         border-radius: 20px;
	         background: #00acac;
	         color: #FFFFFF;
	         cursor: pointer;
	      }
	    }
	    .recharge-status {
	       margin-left: 68px;
	    }
	    .recharge-item {
	       .recharge-input {
	          width: 35px;
	       }
	       .give-input {
	          width: 50px;
	       }
	      .recharge-tips {
	          background: #00acac;
	          display: block;
	          width: 50px;
	          color: #ffffff;
	          text-align: center;
	          border-radius: 2px;
	      }
	      .remove {
	          color: red;
	          cursor: pointer;
	          margin-left: 10px;
	      }
	    }
	  }
	  .footer {
	    margin-top: 10px;
	    margin-left: 150px;
	  }

}
</style>
