<template>
	<view class="loginBox">
		<view class="logoBox">
			<image src="../../static/appLogo.png"></image>
		</view>
		<view class="textBox">
			为了提供更好的售后服务<br />
			我们希望获取到您的手机号码。
		</view>
		<button class="buttonBox" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
			<view @click="getPhoneInfo">
				授权手机号
			</view>
		</button>
	</view>
</template>

<script>
	export default {
		methods: {
			// 获取用户手机号的操作
			getPhoneNumber(e) {
				if (e.detail.errMsg == "getPhoneNumber:ok"){
					// 这个地方需要根据返回的信息走接口获取用户手机号
					console.log("获取用户手机号")
					console.log(e)
					uni.setStorageSync("token","测试的token值")
					uni.switchTab({
						url: "/pages/homePage_V2/homePage_V2"
					})
				}
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

		.textBox {
			text-align: center;
			font-size: 32rpx;
			color: #333;
			margin-top: 40rpx;
		}

		.buttonBox {
			display: inline-block;
			background: #1aac1b;
			color: #fff;
			border-radius: 12rpx;
			margin-top: 40rpx;
		}
	}
</style>