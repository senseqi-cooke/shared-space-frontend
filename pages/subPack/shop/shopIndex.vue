<template>
	<view class="promotionBox">
		<view class="backBox"></view>
		<view class="headerBox">
			<!-- <image :src="info.image" mode=""></image> -->
			<image :src="userInfo.avatar" mode=""></image>
			<view class="name" v-if="category == 1">
				<!-- {{info.name}} -->
				<!-- 绑定用户手机号：{{mobile}} -->
				门店管理人员
			</view>
			<view class="name" v-if="category == 2">
				门店保洁人员
		    </view> 		
		</view>
		
		<view class="moneyBox" v-if="category == 1">
			
			<image src="https://shareadminapi2.tonetn.com/file/pic/20240513151317646575.png" class="moneyBack" mode="widthFix"></image>
			
			<view class="topBox">
				<view class="left">
					<view class="text">
						总营收
					</view>
					<view class="money">
						{{moneyFilter(totalMoney)}}
					</view>
				</view>
				
				
			</view>
			
			<view class="bottomBox">
				<view class="numBox">
					<view class="text">
						订单金额
					</view>
					<view class="num">
						{{moneyFilter(yuyueOrderMoney)}}
					</view>
				</view>
				<view class="numBox">
					<view class="text">
						订单实付金额
					</view>
					<view class="num">
						{{moneyFilter(realOrderMoney)}}
					</view>
				</view>
				<view class="numBox">
					<view class="text">
						购买卡券金额
					</view>
					<view class="num">
						{{moneyFilter(couponOrderMoney)}}
					</view>
				</view>
				<view class="numBox" @click="goPage('./rechargeDetail?storeId='+storeId)">
					<view class="text">
						充值金额
					</view>
					<view class="num">
						{{moneyFilter(rechargeOrderMoney)}}
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="FunsBox">
			
			<!-- 管理员进入的订单列表 -->
			<view class="fun three" @click="goPage('./managerOrder1')" v-if="category == 1">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic1.png" mode=""></image>
					<text>门店订单</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>
			<view class="fun three" @click="goPage('./managerRoom?storeId='+storeId)" v-if="category == 1">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic1.png" mode=""></image>
					<text>房间管理</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>
			<view class="fun three" @click="goPage('./balanceSetting?storeId='+storeId)" v-if="category == 1">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic1.png" mode=""></image>
					<text>充值设置</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>
			<view class="fun three" @click="goPage('./managerCoupon?storeId='+storeId)" v-if="category == 1">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic1.png" mode=""></image>
					<text>卡券管理</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>
			
			<view class="fun three" @click="goPage('./managerCleanStaff?storeId='+storeId)" v-if="category == 1">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic1.png" mode=""></image>
					<text>保洁员管理</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>
										
			<view class="fun three" @click="goPage('./managerCleanLog1?storeId='+storeId)" v-if="category == 1">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic1.png" mode=""></image>
					<text>保洁日志</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>
			
			<view class="fun three" @click="goPage('./userCoupon?storeId='+storeId)" v-if="category == 1">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic1.png" mode=""></image>
					<text>用户卡券</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>
														
			<view class="fun three" @click="goPage('./userCoupon1?storeId='+storeId)" v-if="category == 1">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic1.png" mode=""></image>
					<text>用户优惠券</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>														
			
			<!-- 保洁员进入的订单列表 -->
			<view class="fun one" @click="goPage('./cleanOrder')" v-if="category == 2">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic1.png" mode=""></image>
					<text>门店订单</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>
			

			
<!-- 			<view class="fun one" @click="goPage('./distribution/distribution')">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic1.png" mode=""></image>
					<text>分销订单</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>
			
			<view class="fun two" @click="goPage('./withdraw/withdraw')">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic2.png" mode=""></image>
					<text>提现明细</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view>
			
			<view class="fun three" @click="goPage('./team/team')">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic3.png" mode=""></image>
					<text>我的团队(0人)</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode=""></image>
				</view>
			</view> -->
			
<!-- 			<view class="fun four" @click="posterState = true">
				<view class="left">
					<image src="../../../static/tuiguang/promo_ic4.png" mode=""></image>
					<text>推广海报</text>
				</view>
				<view class="right">
					<image src="../../../static/icon/right.png" mode="widthFix"></image>
				</view>
			</view> -->
			
		</view>
		
		<view class="posterBox" v-if="posterState" @click="posterState = false">
			<view class="bodyBox">
				<image :src="posterImage"
					mode="widthFix" @click.stop=""></image>
				<view class="button" @click.stop="baoCun">
					保存图片到本地相册
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
	import Authorization from '@/pages/authorization/index'
	import { getStoreStat } from '@/api/mtstore';
	//import {subscribeOrderEndMessage} from "@/api/user"; //动态时需要把requestSubscribeMessage提出来
	export default {
	    components: {
		  Authorization,
	    },		
		data() {
			return {
				info: {},
				posterState: false, // 推广海报的显示状态
				totalMoney: 0, // 总营收
				yuyueOrderMoney: 0,      // 预约订单金额
				realOrderMoney: 0,       // 预约订单实付金额
				couponOrderMoney: 0,     // 购买卡券金额
				rechargeOrderMoney: 0,   // 充值金额
				category: 1,
				storeId: 0,
				mobile: "",
				posterImage:"https://img1.baidu.com/it/u=148348468,955530427&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=600", // 推广海报地址
			}
		},
		computed: mapGetters(['userInfo']),
		onLoad(e) {
			this.category = e.category;
			this.storeId = e.storeId;
			this.mobile = e.mobile;
			let that = this;
			if(this.category==1){
				// 获取门店 总营收(元)、预约订单金额(元)、购买卡券金额(元)、充值金额(元)
				let paramData = {
					storeId:that.storeId
				};
				getStoreStat(paramData).then(res => {
					if (res.status == 200) {
						that.totalMoney = res.data.totalMoney;                  // 总营收
						that.yuyueOrderMoney = res.data.yuyueOrderMoney;        // 预约订单金额
						that.realOrderMoney = res.data.realOrderMoney;          // 预约订单实付金额
						that.couponOrderMoney = res.data.couponOrderMoney;      // 购买卡券金额
						that.rechargeOrderMoney = res.data.rechargeOrderMoney;  // 充值金额
					}
				})
			}	
		},
		methods: {
			baoCun() { // 保存到相册
				let that = this;
				// 向用户发起授权请求
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success: () => {
						// 已授权
						that.downLoadImg();
					},
					fail: () => {
						// 拒绝授权，获取当前设置
						uni.getSetting({
							success: (result) => {
								if (!result.authSetting['scope.writePhotosAlbum']) {
									that.isAuth()
								}
							}
						});
					}
				})
			},
			downLoadImg() {
				uni.showLoading({
					title: '加载中'
				});
				uni.downloadFile({
					url: this.posterImage,
					success: (res) => {
						uni.hideLoading();
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: "保存成功",
										icon: "none"
									});
								},
								fail: function() {
									uni.showToast({
										title: "保存失败，请稍后重试",
										icon: "none"
									});
								}
							});
						}
					},
					fail: (err) => {
						uni.showToast({
							title: "失败啦",
							icon: "none"
						});
					}
				})
			},
			isAuth() {
				uni.showModal({
					content: '由于您还没有允许保存图片到您相册里,无法进行保存,请点击确定允许授权',
					success: (res) => {
						if (res.confirm) {
							uni.openSetting({
								success: (result) => {
									console.log(result.authSetting);
								}
							});
						}
					}
				});
			},
			getUserInfo() { // 获取用户信息
				let data = uni.getStorageSync("userInfo")
				data = JSON.parse(data)
				this.info = data
			},
			goPage(url) { // 跳转订单
				
				url = url+'?storeId='+this.storeId;
				console.log(url);
				uni.navigateTo({
					url
				})
			},
			moneyFilter(value) {
				// 截取当前数据到小数点后两位
				let realVal = parseFloat(value).toFixed(2)
				return realVal
			}
		}
	}
</script>

<style lang="scss" scoped>
	.promotionBox {
		width: 100%;
		height: auto;

		.backBox {
			width: 100%;
			height: 377rpx;
			padding: 60rpx 30rpx;
			background: linear-gradient(#f082e8, #fff);
			position: absolute;
			top: 0;
			z-index: -1;
		}

		.headerBox {
			width: 100%;
			height: auto;
			margin: 80rpx auto 0;
			display: flex;
			align-items: center;

			image {
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
			}

			.name {
				margin-left: 40rpx;
				color: #fff;
				font-weight: bold;
				font-size: 35rpx;
			}
		}

		.moneyBox {
			width: 95%;
			height: auto;
			margin: 40rpx auto 0;
			background: #fff;
			border-radius: 20rpx;
			box-shadow: 0 0 15rpx 0 rgba(0, 0, 0, .2);
			position: relative;
			min-height: 350rpx;
			overflow: auto;

			.moneyBack {
				width: 100%;
				height: auto;
				position: absolute;
			}

			.topBox {
				width: 90%;
				height: auto;
				margin: 40rpx auto 0;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left {
					position: relative;
					z-index: 99;
					
					.text {
						color: #bd6b39;
						font-size: 28rpx;
					}

					.money {
						color: #85370d;
						font-size: 60rpx;
						font-weight: bold;
					}
				}

				.right {
					background: #ff501d;
					padding: 20rpx 65rpx;
					font-size: 30rpx;
					color: #fff;
					font-weight: bold;
					border-radius: 50rpx;
					position: relative;
					z-index: 99;
				}
			}

			.bottomBox {
				width: 100%;
				height: auto;
				margin: 100rpx auto 35rpx;
				display: flex;

				.numBox {
					flex: 1;
					height: auto;
					text-align: center;

					.text {
						font-size: 28rpx;
						color: #333;
					}

					.num {
						font-size: 28rpx;
						font-weight: bold;
						margin-top: 10rpx;
					}
				}
			}
		}

		.FunsBox {
			width: 95%;
			height: auto;
			margin: 20rpx auto 0;

			.fun {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 40rpx 0;
				border-bottom: 1rpx solid #ececec;

				.left {
					display: flex;
					align-items: center;

					image {
						width: 60rpx;
						height: 60rpx;
						margin-right: 20rpx;
					}

					text {
						font-size: 28rpx;
					}
				}

				.right {
					image {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}

		.posterBox {
			width: 100%;
			height: 100vh;
			background: rgba(0, 0, 0, .5);
			position: fixed;
			top: 0rpx;
			left: 0rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.bodyBox {
				width: 100%;
				height: auto;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				image {
					width: 80%;
				}

				.button {
					background: #5bd75b;
					width: 75%;
					padding: 20rpx 0;
					border-radius: 50rpx;
					text-align: center;
					margin-top: 70rpx;
					font-size: 28rpx;
					color: #fff;
					font-weight: bold;
				}
			}
		}
	}
</style>
