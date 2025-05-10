<template>
	<view class="inviteBox">
		<view class="backBox">
			<image src="../../../static/tuiguang/promo_friends_bg.png" mode="widthFix"></image>
		</view>
		<view class="contentBox">
			<view class="topBox">
				<view class="left">
					<view class="title">
						好友福利
					</view>
					<view class="imageBox">
						<image src="../../../static/tuiguang/redbag1.png" mode="widthFix"></image>
						<view class="num">
							￥30
						</view>
					</view>
					<view class="textBox">
						首次加入的好友
					</view>
					<view class="textBox">
						可领取<text>30元</text>新人优惠券
					</view>
				</view>
				<view class="right">
					<view class="title">
						我的福利
					</view>
					<view class="imageBox">
						<image src="../../../static/tuiguang/redbag2.png" mode="widthFix"></image>
						<view class="num">
							￥20
						</view>
					</view>
					<view class="textBox">
						邀请的好友首次消费
					</view>
					<view class="textBox">
						我即可得<text>20元</text>优惠券
					</view>
				</view>
			</view>
			<view class="buttonBox">
				<view class="button one">
					<image src="../../../static/tuiguang/wx-ic.png" mode="widthFix"></image>
					<text>微信邀请</text>
				</view>
				<view class="button two">
					<image src="../../../static/tuiguang/toposter_ic.png" mode="widthFix"></image>
					<text>生成海报</text>
				</view>
			</view>
			<view class="ruleBox">
				<view class="title">
					规则说明
				</view>
				<view class="content">
					文字
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style>
	page {
		background: #38c05a;
		padding-bottom: 40rpx;
	}
</style>

<style lang="scss" scoped>
	.inviteBox {
		width: 100%;
		// height: auto;
		position: relative;
		overflow: auto;
		min-height: 100vh;

		.backBox {
			width: 100%;
			height: auto;
			position: absolute;
			top: 0rpx;
			left: 0rpx;
			z-index: -1;

			image {
				width: 100%;
				height: auto;
			}
		}

		.contentBox {
			width: 90%;
			height: auto;
			margin: 820rpx auto 0;

			.topBox {
				display: flex;
				justify-content: space-between;

				.left,.right {
					width: 42%;
					height: auto;
					border-radius: 20rpx;
					background-color: #f9f9fb;
					padding: 20rpx;
					display: flex;
					flex-direction: column;
					.title {
						flex: 1;
						font-size: 35rpx;
						font-weight: bold;
					}

					.imageBox {
						width: 250rpx;
						position: relative;
						margin-top: 20rpx;

						image {
							width: 100%;
						}
						
						.num{
							position: absolute;
							top: 40rpx;
							left:50%;
							transform: translate(-50%,0);
							z-index: 99;
							font-size: 50rpx;
							color: #e33c0b;
						}
					}
					.textBox{
						text-align: center;
						font-size: 24rpx;
						font-weight: bold;
						color: #333;
						
						text{
							color: red;
						}
					}
				}
			}
			.buttonBox{
				width: 100%;
				margin-top: 50rpx;
				height: auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.button{
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 35rpx;
					font-weight: bold;
					padding: 25rpx 0;
					width: 47%;
					border-radius: 50rpx;
					
					image{
						width: 50rpx;
						margin-right: 20rpx;
					}
				}
				
				.one{
					border:1rpx solid #5bd75b;
					background: #fff;
				}
				
				.two{
					border:1rpx solid #5bd75b;
					background: #5bd75b;
					color: #fff;
				}
			}
			
			.ruleBox{
				width: calc(100% - 40rpx);
				height: auto;
				padding: 20rpx;
				background: #fff;
				margin-top: 60rpx;
				border-radius: 15rpx;
				
				.title{
					font-size: 30rpx;
					font-weight: bold;
				}
				.content{
					width: 100%;
					height: auto;
					margin-top: 40rpx;
				}
			}
		}
	}
</style>
