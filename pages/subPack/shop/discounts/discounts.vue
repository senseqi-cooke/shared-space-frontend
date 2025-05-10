<!--
 优惠首页
 Created by xunyin 
-->
<template>
	<view class="discountsBox">
		
		<view class="discountsList" @click="goPage('/pages/subPack/discounts/details?nav=0')">
			<view class="leftBox">
				<image src="../../static/images/icon-money.png" mode="widthFix"></image>
				<view class="nameBox">
					<view class="name">
						购买套餐
					</view>
					<view class="msg">
						各种优惠套餐，快来选购吧
					</view>
				</view>
			</view>
			<view class="rightBox">
				<image src="../../static/images/rightIcon.png" mode=""></image>
				<image src="../../static/images/rightIcon.png" mode=""></image>
			</view>
		</view>
		
		<view class="discountsList" @click="goPage('/pages/subPack/discounts/details?nav=1')">
			<view class="leftBox">
				<image src="../../static/images/icon-card.png" mode="widthFix"></image>
				<view class="nameBox">
					<view class="name">
						充值
					</view>
					<view class="msg">
						充值活动，优惠多多
					</view>
				</view>
			</view>
			<view class="rightBox">
				<image src="../../static/images/rightIcon.png" mode=""></image>
				<image src="../../static/images/rightIcon.png" mode=""></image>
			</view>
		</view>
		
		<view class="discountsList" @click="goPage('/pages/subPack/discounts/details?nav=2')">
			<view class="leftBox">
				<image src="../../static/images/icon-exchange.png" mode="widthFix"></image>
				<view class="nameBox">
					<view class="name">
						大众/美团兑换
					</view>
					<view class="msg">
						自动兑换大众，美团团购套餐
					</view>
				</view>
			</view>
			<view class="rightBox">
				<image src="../../static/images/rightIcon.png" mode=""></image>
				<image src="../../static/images/rightIcon.png" mode=""></image>
			</view>
		</view>
		
<!-- 		<view class="discountsList" @click="goPage('/pages/category/index')">
			<view class="leftBox">
				<image src="../../static/images/icon-exchange.png" mode="widthFix"></image>
				<view class="nameBox">
					<view class="name">
						商城
					</view>
					<view class="msg">
						线上商城，顾客随时随地购买下单，配送到家
					</view>
				</view>
			</view>
			<view class="rightBox">
				<image src="../../static/images/rightIcon.png" mode=""></image>
				<image src="../../static/images/rightIcon.png" mode=""></image>
			</view>
		</view> -->
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				//token:uni.getStorageSync("token"), // token
			}
		},
		methods:{
			goPage(url){
/* 				if (!this.token) {
					uni.navigateTo({
						url: "/pages/Login/login"
					})
				} */
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style>
	page{
		background: #fff;
	}
</style>

<style scoped lang="scss">
	.discountsBox{
		width: 100%;
		height: auto;
		
		.discountsList{
			width: calc(90% - 60rpx);
			height: auto;
			padding: 30rpx;
			background: linear-gradient(to bottom,#f082e8,#b154aa);
			margin: 40rpx auto 0;
			border-radius: 15rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.leftBox{
				display: flex;
				align-items: center;
				image{
					width: 120rpx;
				}
				
				.nameBox{
					margin-left: 25rpx;
					
					.name{
						color: #fff;
						font-size: 30rpx;
					}
					
					.msg{
						color: #efd4b4;
						font-size: 24rpx;
						margin-top: 10rpx;
					}
				}
			}
			
			.rightBox{
				color: #fff;
				display: flex;
				align-items: center;
				
				image{
					position: relative;
				}
			}
			
			
			.rightBox>image:nth-child(1){
				width: 35rpx;
				height: 35rpx;
				right: -20rpx;
				top: 3;
			}
			
			.rightBox>image:nth-child(2){
				width: 45rpx;
				height: 45rpx;
			}
		}
		
		.dyBox{
			position: fixed;
			bottom: 5%;
			width: 100%;
			height: auto;
			display: flex;
			justify-content: center;
			
			image{
				width: 30%;
				height: auto;
			}
		}
	}
</style>