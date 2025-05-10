<!--
 优惠中心（卡券、充值、团购兑换）首页
 Created by xunyin 
-->
<template>
	<view class="detailsBox">
		<view v-if="$store.getters.token || userInfo.uid">
			 <view class="navBox">
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
			</view>
			<view class="coupon msgBox" v-if="navStart == 0">
				<coupon ref="couponEl"></coupon>
			</view>
			<view class="topUp msgBox" v-if="navStart == 1">
				<top-up ref="topUpEl"></top-up>
			</view>
			<view class="conversion msgBox" v-if="navStart == 2">
				<conversion ref="conversionEl"></conversion>
			</view>
	   </view>		
	   <Authorization v-else />	
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
	import { getUserInfo, getMenuUser, wxappAuth, bindingPhone, wxappBindingPhone, wxappGetUserInfo } from '@/api/user'
	import { isWeixin, VUE_APP_RESOURCES_URL, parseQuery, getProvider } from '@/utils'
	import coupon from "@/components/discounts_details/coupon.vue" // 卡券组件
	import topUp from "@/components/discounts_details/topUp.vue" // 充值组件
	import conversion from "@/components/discounts_details/conversion.vue" // 团购兑换组件
	import Authorization from '@/pages/authorization/index'
	export default {
/* 	    components: {
		  Authorization,
	    },	 */	
		data() {
			return {
				navStart: 0, // 导航栏状态 (0:卡券,1:充值,2:团购兑换)
				canIUseGetUserProfile: false,
				isWeixin: false,
			}
		},
		computed: mapGetters(['userInfo']),
		onLoad(options) {
			this.navStart = options.nav
			this.setNavStart(options.nav); // 默认选择全部
		},
		components: {
			coupon,
			topUp,
			conversion,
			Authorization
		},
		methods: {
			...mapMutations(['updateAuthorizationPage']),
			setNavStart(start) { // 设置导航栏状态
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
			},
		}
	}
</script>

<style>
	page {
		background: #f8f8fa;
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
