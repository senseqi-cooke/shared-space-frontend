<!--
 优惠中心卡券购买详情页
 Created by xunyin 
-->
<template>
	<view class="couponDetail">
		<view class="backBox"></view>

		<view class="couponLi">
			<view class="left">
				<view class="time" v-if="type === 'H'">
					{{hourCount}}小时
				</view>
				<view class="time" v-if="type === 'N'">
					{{useableCount}}次数
				</view>				
				<view class="icon" v-if="type === 'H'">
					时长卡
				</view>
				<view class="icon" v-if="type === 'N'">
					次数卡
				</view>				
			</view>
			<view class="center">
				<view class="name">
					<!-- 2小时优惠券 -->
					{{name}}
				</view>
				<view class="isMsg">
					<text class="money">￥{{amount}}<!-- 79.9 --></text>
				</view>
			</view>
		</view>

		<view class="msgBox">
			
			<view class="formBox" v-if="type === 'N'">
				<view class="selectBox discount">
					每次可用{{everyUseableHourCount}}小时
				</view>
			</view>			
			<view class="msg">
				<image src="../../../static/images/youxiaoqi.png" mode=""></image>
				<view class="textBox">
					<view class="title">
						有效期
					</view>
					<view class="text" v-if="limitDay == 0">
						无限制
					</view>
					<view class="text" v-if="limitDay > 0">
						<!-- 30天 -->
						{{limitDay}}天
					</view>
				</view>
			</view>
			<view class="msg">
				<image src="../../../static/images/youxiaoqi.png" mode=""></image>
				<view class="textBox">
					<view class="title">
						可用星期
					</view>
					<view class="text">
						{{availWeekdays}}
					</view>
				</view>
			</view>
			<view class="msg">
				<image src="../../../static/images/youxiaoqi.png" mode=""></image>
				<view class="textBox">
					<view class="title">
						适用时间段
					</view>
					<view class="text">
						{{availTimescale}}
					</view>
				</view>
			</view>
			<view class="msg">
				<image src="../../../static/images/shiyongtiaojian.png" mode=""></image>
				<view class="textBox">
					<view class="title">
						限购次数
					</view>
					<view class="text">
						{{limitNum}}次
					</view>
				</view>
			</view>
			<view class="msg">
				<image src="../../../static/images/shiyongmendian.png" mode=""></image>
				<view class="textBox">
					<view class="title">
						适用店铺
					</view>
					<view class="text">
						{{storeIds}}
					</view>
				</view>
			</view>
			<view class="msg">
				<image src="../../../static/images/shiyongmendian.png" mode=""></image>
				<view class="textBox">
					<view class="title">
						适用包厢
					</view>
					<view class="text">
						{{roomIds}}
					</view>
				</view>
			</view>
			
<!-- 			<view class="formBox">
				<view class="selectBox discount">
					<view class="left">
						优惠券
					</view>
					<view class="right" @click="show = true"  >
						<text>{{shopDefault.startText ? shopDefault.startText : '暂无可用优惠券'}}</text>
						<image src="https://shareadminapi2.tonetn.com/file/pic/20240513152446554089.png" mode=""></image>
					</view>
				</view>
				<view class="selectBox balance">
					<view class="topBox">
						<view class="left">
							当前余额{{info.money}}元，可抵{{info.money}}元
						</view>
						<view class="right">
							<u-switch v-model="switchValue" size="18"></u-switch>
						</view>
					</view>
					<view class="bottomBox" @click="goPage('/pages/subPack/discounts/details?nav=1')">
						余额不足，马上充值>
					</view>
				</view>
			</view> -->
			<view class="button" @click="payment">
				立即购买
			</view>
		</view>
		<!-- <u-picker :show="show" :columns="columns" keyName="startText" @confirm="confirm" @cancel="cancel"></u-picker> -->
	</view>
</template>

<script>
	import { userBuyConpon } from "@/api/coupon";
    import { mapGetters } from "vuex";	
	import {weappPay } from "@/libs/wechat";
	import { getUserInfo } from '@/api/user';	
	export default {
		data() {
			return {
				switchValue: false, // 余额抵扣
				show: false, // 选择优惠券的状态
				columns: [
					[
						{
							id:1,
							startText:"优惠券1"
						},{
							id:2,
							startText:"优惠券2"
						},{
							id:3,
							startText:"优惠券3"
						},{
							id:4,
							startText:"优惠券4"
						}
					]
				], // 优惠券列表
				shopDefault:{}, // 选择的优惠券
				info: {}, // 用户信息
				availWeekdays:"无限制",
				availTimescale:"无限制",
				storeIds:"无限制",
				roomIds:"无限制",
				limitDay:0,
				limitNum:99999,
				type:"H",
				hourCount:1,
				useableCount:1,
				everyUseableHourCount:1,
				name:"卡券",
				amount:100,
				storeId:0,
				couponId:0
			}
		},
		computed: mapGetters(["userInfo"]),
		onLoad(e) {
			this.availWeekdays = e.availWeekdays
			this.availTimescale = e.availTimescale
			this.storeIds = e.storeIds
			this.roomIds = e.roomIds
			this.limitDay = e.limitDay
			this.limitNum = e.limitNum
			this.type = e.type
			this.hourCount = e.hourCount
			this.useableCount = e.useableCount
			this.name = e.name
			this.amount = e.amount
			this.everyUseableHourCount = e.everyUseableHourCount
			this.storeId = e.storeId
			this.couponId = e.id
			//console.log("e:"+e)
			//console.log("id:"+e.id)
			//console.log("amount:"+e.amount)	
			//this.getUserInfo() // 获取用户信息
		},
		methods:{
/* 			getUserInfo() { // 获取用户信息
				let data = uni.getStorageSync("userInfo")
				data = JSON.parse(data)
				this.info = data
			}, */
			confirm(e) { // 确认
				//this.shopDefault = e.value[0]
				this.cancel()
			},
			cancel() { // 取消
				this.show = false
			},
			// 购买
			payment(){ 
				let param = {
					storeId:this.storeId,
					userId:this.userInfo.uid,
					couponId:this.couponId,
					couponType:this.type
				}
				console.log("param.storeId:"+param.storeId)
				console.log("param.userId:"+param.userId)
				console.log("param.couponId:"+param.couponId)
				console.log("param.couponType:"+param.couponType)
				userBuyConpon(param).then(res => {
					var payment = res.data.payment;
					weappPay(payment)
						.then(() => {
							
							this.$yrouter.back();
						})
				})
			},
			goPage(url){ // 页面跳转
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.couponDetail {
		width: 100%;
		height: calc(100vh - 20rpx);
		overflow: auto;
		padding-bottom: 20rpx;

		.backBox {
			width: 100%;
			height: 400rpx;
			background: linear-gradient(#e3d1b4, #a77a54);
			position: absolute;
			top: 0rpx;
			z-index: -1;
		}

		.couponLi {
			width: 90%;
			height: auto;
			margin: 100rpx auto 0;
			display: flex;
			border-radius: 10rpx;
			overflow: hidden;

			.left {
				padding: 40rpx 30rpx 30rpx 30rpx;
				background: linear-gradient(to right, #fbdaff, #f082e8);
				display: flex;
				flex-direction: column;

				.time {
					font-size: 55rpx;
					color: #b154aa;
					;
				}

				.icon {
					text-align: center;
					padding: 2rpx 0;
					border: 1rpx solid #b154aa;
					font-size: 24rpx;
					color: #b154aa;
					margin-top: 5rpx;
				}
			}

			.center {
				background: #fff;
				flex: 1;
				padding: 20rpx 30rpx 20rpx 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.name {
					font-size: 35rpx;
				}

				.condition,
				.isMsg {
					font-size: 22rpx;
					color: #999;
				}

				.isMsg {
					display: flex;
					justify-content: space-between;

					.money {
						font-size: 35rpx;
						color: #eb0707;
					}
				}
			}

			.right {
				padding: 0rpx 10rpx;
				background: #b154aa;
				color: #fff;
				font-size: 28rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
			}
		}

		.msgBox {
			width: 100%;
			height: auto;
			margin: 60rpx auto 0;
			border-top-left-radius: 40rpx;
			border-top-right-radius: 40rpx;
			background: #fff;
			overflow: auto;

			.msg {
				width: 90%;
				height: auto;
				margin: 50rpx auto 0;
				display: flex;
				align-items: center;

				image {
					width: 100rpx;
					height: 100rpx;
				}

				.textBox {
					margin-left: 20rpx;

					.title {
						font-size: 32rpx;
						color: #333;
						font-weight: bold;
					}

					.text {
						font-size: 26rpx;
						color: #686868;
						margin-top: 10rpx;
					}
				}
			}

			.formBox {
				width: 90%;
				height: auto;
				margin: 30rpx auto 0;

				.selectBox {
					width: 100%;
					height: auto;
					display: flex;
				}

				.discount {
					justify-content: space-between;
					align-items: center;

					.left {
						font-size: 26rpx;
						color: #333;
					}

					.right {
						font-size: 24rpx;
						padding: 5rpx 20rpx;
						border-radius: 20rpx;
						background: #f2f7fe;
						color: #82a2dc;
						border: 1rpx solid #e8ecf8;
						display: flex;
						align-items: center;
						
						image{
							width: 20rpx;
							height: 20rpx;
						}
					}
				}

				.balance {
					flex-direction: column;
					margin-top: 20rpx;

					.topBox {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.left {
							font-size: 26rpx;
							color: #333;
						}
					}

					.bottomBox {
						display: flex;
						justify-content: flex-end;
						color: #89a8da;
						font-size: 20rpx;
						text-decoration: underline;
						margin-top: 15rpx;
					}
				}
			}

			.button {
				width: 80%;
				height: auto;
				margin: 50rpx auto 0;
				text-align: center;
				background: linear-gradient(#eed2ae, #b154aa);
				padding: 20rpx 0;
				color: #fff;
				border-radius: 50rpx;
				box-shadow: 0rpx 0rpx 10rpx #b154aa;
			}
		}
	}
</style>
