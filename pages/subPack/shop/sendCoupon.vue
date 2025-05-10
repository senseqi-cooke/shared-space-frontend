<template>
	<view class="formBox">
		<view class="inputBox">
			<view class="title">
				<text>*</text>卡券名称
			</view>
			<u--input
			    placeholder="请输入卡券名称"
			    border="bottom"
				placeholderClass="joinPla" v-model="name" :disabled="true"></u--input>
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
		<view class="inputBox">
			<view class="title">
				<text>*</text>发放数量
			</view>
			<u--input
			    placeholder="请输入发放数量"
			    border="bottom"
				placeholderClass="joinPla" v-model="sendNum" required></u--input>
		</view>
		
<!-- 		<view class="inputBox">
			<view class="title marginBottom">
				备注信息
			</view>
			<u--textarea placeholder="请输入备注信息" placeholderClass="joinPla" v-model="leaveMsg" required></u--textarea>
		</view> -->
		
		<view class="formBox" style="padding-bottom: 20rpx;">
			<view class="button" @click="submit">
				提交
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import { sendCoupon} from '@/api/coupon'
	import attrs, { required, chs_phone } from '@/utils/validate'
	import { validatorDefaultCatch } from '@/utils/dialog'
	export default {
		data() {
			return {
 				couponId: 0, 
				mobile: "",
				sendNum: 0,
				storeId: 0,
				name: "" 
			}
		},
		created() {
			
		},
		onLoad(e) {
			this.couponId = e.id;
			this.storeId = e.storeId;
			this.name = e.name;
			console.log("this.name:"+this.name);	
		},
		methods: {
			
			submit() {
				
			  if(this.mobile===""){
				  uni.showToast({
				    title: '请输入绑定用户的手机号码',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
			  
			  if(this.sendNum===""){
				  uni.showToast({
				    title: '请输入发放数量',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }	
									  
			  let data = {
			  	id:this.couponId,
			  	mobile:this.mobile,
			  	sendNum:this.sendNum,
			  	storeId:this.storeId
			  }
			  
			  sendCoupon(data).then(res => {
	
			  	if (res.status == 200) {
			  		
			  		uni.showToast({
			  		  title: res.msg,
			  		  icon: 'success',
			  		  duration: 5000,
			  		})
			  					
			  		if(res.msg=='发放成功'){
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