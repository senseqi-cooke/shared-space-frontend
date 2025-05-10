<template>
	<view class="couponBox">
		<view class="navBox">
			<view :class="[navStart == 0 ? 'selectNav' : '' ,'nav']" @click="setNavStart(0)">
				未使用
				<view class="icon"></view>
			</view>
			<view :class="[navStart == 1 ? 'selectNav' : '' ,'nav']" @click="setNavStart(1)">
				已使用
				<view class="icon"></view>
			</view>
			<view :class="[navStart == 2 ? 'selectNav' : '' ,'nav']" @click="setNavStart(2)">
				已过期
				<view class="icon"></view>
			</view>
		</view>
		<view class="couponList"> <!-- @click="goPage('/pages/subPack/discounts/couponDetail')" -->
			<view class="couponLi" 
				v-for="(item,index) in couponList" :key="index">
				<view class="left">
					<view class="time" v-if="item.type === 'C'">
						{{item.amount}}元
					</view>				
					<view class="icon" v-if="item.type === 'C'">
						优惠券
					</view>				
				</view>
				<view class="center">
					<view class="name">
						{{item.name}}
					</view>
					<view class="condition" v-if="item.type === 'C'">
						使用条件：满{{item.reachMoney}}金额可用
					</view>
					<view class="isMsg">
						<!-- <text>查看详情></text> -->
						<!-- <text class="money">￥{{item.amount}}</text> -->
						<text>用户手机号：{{item.mobile}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		CouponList
	} from '../../../utils/request/gather';
	import { myCouponList } from "@/api/coupon";
	import { mapGetters } from "vuex";
	import { getUserInfo } from '@/api/user';
	export default {
		data() {
			return {
				navStart: 0, // 导航栏状态 (0:未使用,1:已使用,2:已过期)
				couponList: [] // 优惠券列表
			}
		},
		computed: mapGetters(["userInfo"]),
		created() {
			this.setNavStart(0); // 默认选择全部
			this.getCouponList()
		},
		methods: {
			getCouponList() { // 获取卡券列表
/* 				for (let i = 0; i <= 10; i++) {
					this.couponList.push({
						time: 2,
						iconName: "时常券",
						name: "优惠券名称",
						tiaojian: "3小时内使用",
						money: 79
					})
				} */
				let that = this
				let status='A'
				if(this.navStart==0){
					status='A'
				}else if(this.navStart==1){
					status='B'
				}else if(this.navStart==2){
					status='C'
				}
				let param = {
					status:status,
					//userId:this.userInfo.uid,
					queryTypeScope:2
				}
				myCouponList(param).then(res => {
					
					that.couponList = res.data.myCouponList.content
					
				})
			},
			setNavStart(start) { // 设置导航栏状态
				this.navStart = start;
				this.getCouponList();
			},
			goPage(url) { // 页面跳转
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.couponBox {
		width: 100%;
		height: auto;

		.navBox {
			width: 100%;
			padding: 20rpx 0;
			background: #fff;
			display: flex;
			border-top: #f6f6f6 2rpx solid;
			box-shadow: 4rpx 6rpx 4rpx #f1f1f1;

			.nav {
				flex: 1;
				text-align: center;
				font-size: 26rpx;
				color: #333;
				position: relative;

				.icon {
					display: none;
				}
			}

			.selectNav {
				color: #b28159;

				.icon {
					width: 90rpx;
					height: 6rpx;
					background: #b18059;
					position: absolute;
					display: block;
					bottom: -20rpx;
					left: 50%;
					transform: translate(-50%, 0);
					border-radius: 50rpx;
				}
			}
		}

		.couponList {
			width: 100%;
			height: auto;

			.couponLi {
				width: 90%;
				height: auto;
				margin: 30rpx auto 0;
				display: flex;
				box-shadow: 4rpx 6rpx 4rpx #f1f1f1;
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
						font-size: 30rpx;
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
							font-size: 28rpx;
							color: #eb0707;
						}
					}
				}
			}
		}
	}
</style>
