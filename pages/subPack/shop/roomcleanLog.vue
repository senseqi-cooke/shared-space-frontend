<template>
	<view class="formBox">
		<view class="inputBox">
			<view class="title marginBottom">
				<text>*</text>保洁记录
			</view>
			<u--textarea placeholder="请输入保洁记录" v-model="remark" placeholderClass="joinPla"></u--textarea>
		</view>
		<view class="msg">
			提交后，房间的状态变为已保洁（空闲中）
		</view>
		<view class="button" @click="submit">
			提交
		</view>
	</view>
</template>

<script>
	import { cleanRecord } from '@/api/order';
	export default {
		data() {
			return {
				storeRoomId: 0,
				cleannerPhone: 0,
				storeRoomName: "",
				remark:"",
				orderId: 0,
				storeId: 0
			}
		},
		onLoad(e){
			this.storeRoomId = e.storeRoomId;
			this.cleannerPhone = e.cleannerPhone;
			this.storeRoomName = e.storeRoomName;
			this.orderId = e.orderId;
			this.storeId = e.storeId;
			
		},
		onShow: function () {
			
		},	
		methods: {

			submit() {
				let paramData = {
					storeRoomId:this.storeRoomId,
					cleannerPhone:this.cleannerPhone,
					storeRoomName:this.storeRoomName,
					remark:this.remark,
					orderId:this.orderId,
					storeId:this.storeId
				};
				cleanRecord(paramData).then(res => {
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
</style>

<style lang="scss" scoped>
	.formBox{
		width: 100%;
		height: auto;
		
		.inputBox{
			width: 90%;
			height: auto;
			margin: 20rpx auto 0;
			
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
		
		.msg{
			width: 90%;
			height: auto;
			margin: 20rpx auto 0;
			font-size: 28rpx;
			color: #666666;
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