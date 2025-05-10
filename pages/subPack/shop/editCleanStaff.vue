<template>
	<view class="formBox">
		<view class="inputBox">
			<view class="title">
				<text>*</text>姓名
			</view>
			<u--input
			    placeholder="请输入姓名"
			    border="bottom"
				placeholderClass="joinPla" v-model="realName" ></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text>*</text>绑定用户的手机号码
			</view>
			<u--input
			    placeholder="请输入绑定用户的手机号码"
			    border="bottom"
				placeholderClass="joinPla" v-model="mobile" required></u--input>
		</view>
		
<!-- 		<view class="inputBox">
			<view class="title">
				<text>*</text>备注信息
			</view>
			<u--input
			    placeholder="请输入备注信息"
			    border="bottom"
				placeholderClass="joinPla" v-model="description" required></u--input>
		</view> -->
		
 		<view class="inputBox">
			<view class="title marginBottom">
				备注信息
			</view>
			<u--textarea placeholder="请输入备注信息" placeholderClass="joinPla" v-model="description" required></u--textarea>
		</view>
		<view style="margin-top: 15px;">
			<radio-group v-model="auditedStatus"  @change="(e) => onChangeMarkChoose(e)">
			  <radio key="A" label="A" value="A" style="margin: 10px;" :checked="auditedStatus=='A'">开启</radio>
			  <radio key="N" label="N" value="N" style="margin: 10px;" :checked="auditedStatus=='N'">禁止</radio>
			</radio-group>
		</view>		
		<view class="formBox" style="padding-bottom: 20rpx;">
			<view class="button" @click="submit">
				提交
			</view>
		</view>

		
	</view>
</template>

<script>
	import { staffSave} from '@/api/mtstore'
	import attrs, { required, chs_phone } from '@/utils/validate'
	import { validatorDefaultCatch } from '@/utils/dialog'
	export default {
		data() {
			return {
 				id: 0,
				realName: "",
				mobile: "",
				description: 0,
				storeId: 0,
				auditedStatus:"A",
				category:2
			}
		},
		created() {
			
		},
		onLoad(e) {
			this.id = e.id;
			this.storeId = e.storeId;
			this.realName = e.realName;
			this.mobile = e.mobile;
			this.category = e.category;
			this.description = e.description;
			this.auditedStatus = e.auditedStatus;	
		},
		methods: {
			onChangeMarkChoose(e) {
				this.auditedStatus = e.detail.value;
				console.log(e.detail.value);
			},			
			submit() {
				
			  if(this.realName===""){
				  uni.showToast({
				    title: '请输入姓名',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
								  
			  if(this.mobile===""){
				  uni.showToast({
				    title: '请输入绑定用户的手机号码',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
				  
			  let data = {
			  	id:this.id,
				category:this.category,
			  	mobile:this.mobile,
			  	realName:this.realName,
				description:this.description,
				auditedStatus:this.auditedStatus,
			  	storeId:this.storeId
			  }
			  
			  staffSave(data).then(res => {
	
			  	if (res.status == 200) {
			  		
			  		uni.showToast({
			  		  title: res.msg,
			  		  icon: 'success',
			  		  duration: 5000,
			  		})
			  					
			  		if(res.msg=='保存成功'){
			  			// 跳转回上一页
			  			setTimeout(()=>{
			  				uni.navigateBack({
			  					delta:1
			  				})
			  				},1000)
			  			}	
					}	
			  })

			}				  
		}
	}	
</script>

<style>
	page{
		background: #f8f8fa;
	}
	.joinPla{
		color: #d8d8d8;
		font-size: 24rpx;
	}
</style>

<style lang="scss" scoped>
	.formBox{
		width: 100%;
		height: auto;
		
		.inputBox{
			width: 90%;
			height: auto;
			margin: 50rpx auto 0;
			
			.marginBottom{
				margin-bottom: 20rpx !important;
			}
			
			.title{
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
				text{
					color: red;
				}
			}
		}
		
		.buttonBox{
			position: fixed;
			bottom: 90rpx;
			display: flex;
			width: 100%;
			height: auto;
			
			.button{
				padding: 30rpx 0;
				flex: 1;
				height: auto;
				color: #fff;
				text-align: center;
			}
		}
		
		.buttonBox>.button:nth-child(1){
			background: #f082e8;
		}
		
		.buttonBox>.button:nth-child(2){
			background: #b154aa;
		}
	}
</style>

<style lang="scss" scoped>
	.formBox{
		width: 100%;
		height: auto;
		
		.inputBox{
			width: 90%;
			height: auto;
			margin: 50rpx auto 0;
			
			.marginBottom{
				margin-bottom: 20rpx !important;
			}
			
			.title{
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
				text{
					color: red;
				}
			}
		}
		
		.buttonBox{
			position: fixed;
			bottom: 90rpx;
			display: flex;
			width: 100%;
			height: auto;
			
			.button{
/* 				padding: 30rpx 0;
				flex: 1;
				height: auto;
				color: #fff;
				text-align: center; */
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
		
		.buttonBox>.button:nth-child(1){
			background: #f082e8;
		}
		
		.buttonBox>.button:nth-child(2){
			background: #b154aa;
		}
		
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
</style>