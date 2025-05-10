<template>
	<view class="teamPage">
		
<!-- 		<view class="topBox">
			<view class="inputBox">
				<u--input placeholder="请输入关键词" prefixIcon="search" v-model="teamValue"
					prefixIconStyle="font-size: 22px;color: #919191">
				</u--input>
			</view>
			<view class="text" @click="search">
				搜索
			</view>
		</view> -->

		<view class="teamList" v-if="orderList.length > 0">
			
			<view class="teamBox" v-for="(item,index) in orderList" :key="index">
				
				<view class="left">
					<image :src="item.icon" mode="widthFix"></image>
					<view class="nameBox">
						<view class="name">
							{{item.storeRoomName}}
						</view>
						<view class="teamName">
							{{item.teaServerTime}}
						</view>
					</view>
				</view>
				
				<view class="bottom">
					<text class="leftText">订单金额：{{item.orderMondey}}</text> <text class="rightText">实付金额：<text class="money">{{item.payMoney}}</text>元</text>
				</view>
				
				<view class="state" v-if="item.orderStatus == 1">
					<!-- 订单状态： --> 未开始
				</view>
				
				<view class="state" v-if="item.orderStatus == 2">
					服务中
				</view>
				
				<view class="state" v-if="item.orderStatus == 4">
					已完成
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
	
	import { mapGetters } from "vuex";
	import { getManagerStoreOrder } from '@/api/order';	
	
	export default {
		data() {
			return {
				navSelect: 0, // 导航栏的选择
				orderList: [], // 订单列表
				teamValue: "", // 关键词
				storeId: 0,
				orderStatus: 0				
			}
		},
		onLoad(e) {
			this.storeId = e.storeId;
			//this.getTeamList()
		},
		computed: mapGetters(["userInfo"]),
		onShow: function () {
			this.getOrderList();
		},
		methods: {
			search() { // 搜索
				if (this.teamValue == "") {
					uni.showToast({
						title: "请输入关键词",
						icon: 'none'
					})
					return false
				} else {
					console.log(this.teamValue);
				}
			},
			setNavSelect(nav) { // 选择导航栏
				this.navSelect = nav
			},
			getOrderList() { // 获取订单列表
				//let i = 0
				let paramData = {
					storeId:this.storeId,
					orderStatus:this.orderStatus
				};
				getManagerStoreOrder(paramData).then(res => {
					if (res.status == 200) {
						//var orderList = res.data;
						this.orderList = res.data;
					}
				})	
			}			
/* 			getTeamList() { // 获取团队列表
				for (let i = 0; i <= 10; i++) {
					this.teamList.push({
						image: "https://img0.baidu.com/it/u=3390723537,4167208270&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
						name: "名称",
						time: "绑定时间：2023-01-17 10:50",
						orderNum:"0",
						money:"0.00",
						stateNum:"0"
					})
				}
			} */
		}
	}
</script>

<style>
	page {
		background: #f0f0f0;
	}
</style>
<style scoped lang="scss">
	.teamPage {
		width: 100%;
		height: auto;

		.topBox {
			display: flex;
			align-items: center;
			width: 90%;
			margin: 30rpx auto 0;

			.inputBox {
				background: #fff;
				flex: 1;
				border-radius: 10rpx;
			}

			.text {
				margin-left: 20rpx;
			}
		}

		.teamList {
			width: 90%;
			height: auto;
			margin: 20rpx auto;

			.teamBox {
				width: calc(100% - 40rpx);
				height: auto;
				margin-bottom: 20rpx;
				background: #fff;
				padding: 20rpx;
				border-radius: 20rpx;
				position: relative;
				.state{
					position: absolute;
					right: 0rpx;
					top:0rpx;
					padding: 10rpx 30rpx;
					background: #5bd75b;
					color: #fff;
					font-size: 24rpx;
					border-top-right-radius: 20rpx;
					border-bottom-left-radius: 20rpx;
					font-weight: bold;
					
				}

				.left {
					display: flex;
					flex: 1;
					align-items: center;

					image {
						width: 120rpx;
						height: 120rpx;
						border-radius: 50%;
						border: 4rpx solid #fff;
						display: block;
					}

					.nameBox {
						margin-left: 20rpx;

						.name {
							color: #333;
							font-size: 35rpx;
							margin-top: 8rpx;
							font-weight: bold;
						}

						.teamName {
							color: #a3a3a3;
							font-size: 24rpx;
							margin-top: 6rpx;
						}
					}
				}

				.bottom {
					width: 100%;
					height: auto;
					margin-top: 10rpx;
					color: #808080;
					font-weight: bold;
					font-size: 26rpx;
					display: flex;
					
					.leftText{
						padding-right: 20rpx;
						border-right: 1rpx solid #dedede;
					}
					
					.rightText{
						padding-left: 20rpx;
					}
					
					.money{
						font-size: 24rpx;
						color: #fa6e1c;
					}
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
				flex: 1;
				height: auto;
			}

			view {
				margin-top: 30rpx;
			}
		}
	}
</style>
