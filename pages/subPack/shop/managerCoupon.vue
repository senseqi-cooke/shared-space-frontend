<!--
 优惠中心（卡券、充值、团购兑换）首页
 Created by xunyin 
-->
<template>
	
	<view class="detailsBox">
		<view class="homePageBox">
		
				<view class="sidebarBox">
					<view class="sidebar one" @click="goPageAdd('/pages/subPack/shop/editCouponH','H')">
						<image src="https://shareadminapi2.tonetn.com/file/pic/20240513152414458143.jpg" mode="heightFix"></image>
						+小时卡
					</view>
					<view class="sidebar one" @click="goPageAdd('/pages/subPack/shop/editCouponN','N')">
						<image src="https://shareadminapi2.tonetn.com/file/pic/20240513152414458143.jpg" mode="heightFix"></image>
						+次卡
					</view>
					<view class="sidebar one" @click="goPageAdd('/pages/subPack/shop/editCouponC','C')">
						<image src="https://shareadminapi2.tonetn.com/file/pic/20240513152414458143.jpg" mode="heightFix"></image>
						+优惠券
					</view>							
		<!-- 			<view class="sidebar two" @click="openDoor(0,0)">
						<image src="https://shareadminapi2.tonetn.com/file/pic/20240513152426119225.jpg" mode="heightFix"></image>
						开大门
					</view> -->
				</view>
		</view>	
		<view v-if="$store.getters.token || userInfo.uid">
<!-- 			 <view class="navBox">
				<view :class="[navStart == 0 ? 'selectNav' : '' ,'nav']" @click="setNavStart(0)">
					卡券
					<view class="icon"></view>
				</view>
				<view :class="[navStart == 1 ? 'selectNav' : '' ,'nav']" @click="setNavStart(1)">
					充值
					<view class="icon"></view>
				</view>
				<view :class="[navStart == 2 ? 'selectNav' : '' ,'nav']" @click="setNavStart(2)">
					团购兑换
					<view class="icon"></view>
				</view>
			</view> -->
			<view class="coupon msgBox" >
				<coupon ref="couponEl"></coupon>
			</view>
<!-- 			<view class="topUp msgBox" v-if="navStart == 1">
				<top-up ref="topUpEl"></top-up>
			</view>
			<view class="conversion msgBox" v-if="navStart == 2">
				<conversion ref="conversionEl"></conversion>
			</view> -->
	   </view>		
	   <Authorization v-else />	
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
	import { getUserInfo, getMenuUser, wxappAuth, bindingPhone, wxappBindingPhone, wxappGetUserInfo } from '@/api/user'
	import { isWeixin, VUE_APP_RESOURCES_URL, parseQuery, getProvider } from '@/utils'
	import coupon from "@/components/discounts_details/mgrCoupon.vue" // 卡券组件
	//import topUp from "@/components/discounts_details/topUp.vue" // 充值组件
	//import conversion from "@/components/discounts_details/conversion.vue" // 团购兑换组件
	import Authorization from '@/pages/authorization/index'

	export default {
/* 	    components: {
		  Authorization,
	    },	 */	
		data() {
			return {
				//navStart: 0, // 导航栏状态 (0:卡券,1:充值,2:团购兑换)
				canIUseGetUserProfile: false,
				isWeixin: false,
				storeId: 0
			}
		},
		computed: mapGetters(['userInfo']),

		onLoad(options) {
			this.storeId = options.storeId;
			//console.log("options.storeId:"+options.storeId);
			//this.$refs.couponEl.init(options.storeId);
			//this.navStart = options.nav
			//this.setNavStart(options.nav); // 默认选择全部
		},
		onShow() {
			this.$refs.couponEl.init(this.storeId);
		},
		components: {
			coupon,
/* 			topUp,
			conversion, */
			Authorization
		},
		methods: {
			...mapMutations(['updateAuthorizationPage']),
			goPageAdd(url,type) { // 跳转页面
				//url = url+'?storeId=' + this.storeId +'&type=' + type
				url = url+'?id=&amount=&everyUseableHourCount='+
				'&hourCount=&limitDay=&limitNum=&name=&total=&outRule='+
				'&roomIds=&useableCount=&availWeekdays=' +
				'&availTimescale=&roomIds=&storeIds=' +
				'&beginTime=&endTime=' +
				'&type=' + type +'&storeId=' + this.storeId
				
				uni.navigateTo({
					url
				})
			},			
/* 			setNavStart(start) { // 设置导航栏状态
				this.navStart = start
				let that = this
				start = parseInt(start)
				switch (start) {
					case 0:
						wx.nextTick(() => {
							that.$refs.couponEl.init()
						})
						break;
					case 1:
						wx.nextTick(() => {
							that.$refs.topUpEl.init()
						})
						break;
					case 2:
						wx.nextTick(() => {
							that.$refs.conversionEl.init()
						})
						break;
				}
			}, */
		}
	}
</script>

<style>
	page {
		background: #f8f8fa;
	}
</style>
<style lang="scss" scoped>
	.homePageBox {
		width: 100%;
		height: auto;
		padding-bottom: 20rpx;
	
		.selectCityBox {
			width: 100%;
			height: auto;
			padding: 20rpx 0;
			background: #fff;
	
			.selectCity {
				width: 92%;
				height: auto;
				margin: 0rpx auto;
	
				.inputBox {
					display: flex;
					justify-content: space-between;
					align-items: center;
	
					.leftBox {
						display: flex;
						background: #f8f8f8;
						align-items: center;
						flex: 1;
						border-radius: 10rpx;
	
						.cityBox {
							padding: 20rpx;
							font-size: 28rpx;
							color: #333;
	
							image {
								width: 20rpx;
								margin-left: 10rpx;
							}
						}
	
						.input {
							flex: 1;
							padding-left: 20rpx;
							border-left: #f1f1f1 1rpx solid;
	
							input {
								flex: 1;
								font-size: 28rpx;
								color: #333;
							}
						}
					}
	
					.rightBox {
						margin-left: 40rpx;
					}
				}
			}
		}
	
		.sidebarBox {
			position: fixed;
			bottom: 10%;
			right: 10rpx;
			z-index: 99;
	
			.sidebar {
				width: 100rpx;
				height: 100rpx;
				background: #ce53b5;
				border-radius: 50%;
				margin-top: 20rpx;
				color: #fff;
				font-size: 24rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
	
				image {
					height: 35rpx;
					width: auto;
					margin-bottom: 5rpx;
				}
			}
		}
	
		.sidebarBox>.sidebar:first-child {
			margin-top: 0;
		}
		
	}	
</style>
<style scoped lang="scss">
	.detailsBox {
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
				font-size: 30rpx;
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

		.msgBox {
			width: 100%;
			height: auto;
		}
	}
</style>
