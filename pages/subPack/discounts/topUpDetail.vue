<!--
 优惠中心-充值-详情页
 Created by xunyin 
-->
<template>
	<view class="withdrawBox">
		<view class="titlesBox">
			<view class="title">
				时间
			</view>
			<view class="title">
				充值金额(元)
			</view>
			<view class="title">
				赠送金额(元)
			</view>
		</view>
		<view class="orderList" v-if="moneyBoxList.length>0">
			<view class="orderBox" v-for="item in moneyBoxList" :key="item">
				<view class="time box">
					{{ parseTime(item.createTime) }}
				</view>
				<view class="money box">
					￥{{item.amount}}
				</view>
				<view class="state box">
					￥{{item.giveAmount}}
				</view>
			</view>
		</view>
		<view class="hideBox" v-else>
			<image src="https://shareadminapi2.tonetn.com/file/pic/20240513150419509422.png" mode="widthFix"></image>
			<view class="">
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
	import { parseTime } from "@/utils/index";
	import { myBalanceList } from "@/api/recharge";
	export default {
		data() {
			return {
				moneyBoxList:[] // 充值纪录
			}
		},
		onLoad() {
			this.getMoneyBoxList() // 获取充值纪录
		},
		methods: {
			parseTime,
			getMoneyBoxList(){ // 获取充值纪录
				let that = this
				let param = {}
				myBalanceList(param).then(res => {
					
					that.moneyBoxList = res.data.myBalanceList.content
					
				})
/* 				for(let i = 0;i<=10;i++){
					this.moneyBoxList.push({
						time:"4-15 09:10",
						money:"10",
						moneyTwo:"20",
					})
				} */
			}
		}
	}
</script>

<style>
	page {
		background: #fff;
	}
</style>
<style scoped lang="scss">
	.withdrawBox {
		width: 100%;
		height: auto;

		.titlesBox {
			width: 100%;
			height: auto;
			display: flex;

			.title {
				flex: 1;
				text-align: center;
				background: #f2f2f2;
				padding: 20rpx 0;
				color: #6a6a6a;
				font-size: 28rpx;
			}
		}

		.orderList {
			width: 100%;
			height: auto;

			.orderBox {
				width: 100%;
				height: auto;
				background: #fff;
				border-radius: 15rpx;
				margin: 0rpx auto;
				display: flex;

				.box{
					flex: 1;
					text-align: center;
					font-size: 26rpx;
					padding: 20rpx 0;
					color: #444;
					border-bottom: 1rpx solid #f1f1f1;
				}
				
				.money{
					color: red;
				}
			}
		}

		.hideBox {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #999;
			margin-top: 120rpx;

			image {
				width: 60%;
				height: auto;
			}

			view {
				margin-top: 30rpx;
			}
		}
	}
</style>
