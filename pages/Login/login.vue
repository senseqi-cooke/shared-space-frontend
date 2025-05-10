<template>
	<view class="loginBox">
		<view class="logoBox">
			<image src="../../static/appLogo.png"></image>
		</view>
		<view class="buttonBox" @click="getUserInfo">
			一键登录
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			getUserInfo() {
				uni.getUserInfo({ // 官方已回收获取用户信息的功能
					provider: 'weixin',
					success: function(infoRes) {
						uni.navigateTo({
							url:"./loginPhone"
						})
						console.log("获取用户信息")
						console.log(infoRes);
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.loginBox {
		width: 100%;
		height: calc(100vh - 200rpx);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.logoBox {
			width: 90%;
			height: auto;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.buttonBox {
			display: inline-block;
			padding: 20rpx;
			background: #1aac1b;
			color: #fff;
			border-radius: 12rpx;
			margin-top: 60rpx;
		}
	}
</style>