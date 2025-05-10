<template>
	<view class="formBox">
		<view class="inputBox">
			<view class="title">
				<text>*</text>加盟城市
			</view>
			<u--input
			    placeholder="请输入加盟城市"
			    border="bottom"
				placeholderClass="joinPla" v-model="joinCity" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text>*</text>您的姓名
			</view>
			<u--input
			    placeholder="请输入您的姓名"
			    border="bottom"
				placeholderClass="joinPla" v-model="youName" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text>*</text>您的电话
			</view>
			<u--input
			    placeholder="请输入您的电话"
			    border="bottom"
				placeholderClass="joinPla" v-model="tel" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title marginBottom">
				其他留言
			</view>
			<u--textarea placeholder="请输入其他留言" placeholderClass="joinPla" v-model="leaveMsg" required></u--textarea>
		</view>
		
		<view class="buttonBox" >
			<view class="button"  @click="call()">
				电话咨询
			</view>
			<view class="button" @click="submit">
				提交申请
			</view>
		</view>
	</view>
</template>

<script>
	import { tojoin } from '@/api/tojoin';
	import attrs, { required, chs_phone } from '@/utils/validate'
	import { validatorDefaultCatch } from '@/utils/dialog'
	export default {
		data() {
			return {
 				joinCity: "", 
				youName: "",
				tel: "",
				leaveMsg: "" 
			}
		},
		created() {
			
		},
		methods: {
/* 			addJoin() { 
				let data = {
					joinCity:this.joinCity,
					youName:this.youName,
					tel:this.tel,
					leaveMsg:this.leaveMsg
				}
				tojoin(data).then(res => {
					
					if (res.status == 200) {
						
						uni.showToast({
						  title: '提交成功',
						  icon: 'success',
						  duration: 5000,
						})
						// 跳转回上一页
						uni.navigateBack({
						    delta: 1
						});
					}	
					
				})				
			}, */
			call() { // 拨打电话
				let phone = "13800138000"
				uni.makePhoneCall({
					phoneNumber: phone,
					success: function() {
						console.log('拨打电话成功');
					},
					fail() {
						uni.showToast({
							title: "拨打电话失败，请确认电话格式是否正确",
							icon: "none"
						})
					}
				})
			},			
			submit() {
/* 			  let youName = this.youName,
				tel = this.tel,
				joinCity = this.joinCity
			  try {
				await this.$validator({
				  youName: [required(required.message('姓名')), attrs.range([2, 16], attrs.range.message('姓名'))],
				  tel: [required(required.message('联系电话')), chs_phone(chs_phone.message())],
				  joinCity: [required(required.message('请输入城市'))],
				}).validate({ youName, phone, joinCity })
			  } catch (e) {
				return validatorDefaultCatch(e)
			  } */
			  //console.log("====="+this.joinCity+","+this.youName+","+this.tel)
			  if(this.joinCity===""){
				  uni.showToast({
				    title: '请输入加盟城市',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
			  if(this.youName===""){
				  uni.showToast({
				    title: '请输入您的姓名',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
			  if(this.tel===""){
				  uni.showToast({
				    title: '请输入您的电话',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }								
			  let data = {
			  	joinCity:this.joinCity,
			  	youName:this.youName,
			  	tel:this.tel,
			  	leaveMsg:this.leaveMsg
			  }
			  tojoin(data).then(res => {			  	
			  	if (res.status == 200) {			  		
			  		uni.showToast({
			  		  title: '提交成功',
			  		  icon: 'success',
			  		  duration: 5000,
			  		})
			  		// 跳转回上一页
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},1000)
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