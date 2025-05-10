<template>
	<view class="formBox">
		<view class="inputBox">
			<view class="title marginBottom">
				<text>*</text>建议留言
			</view>
			<u--textarea placeholder="请输入您的宝贵建议" placeholderClass="joinPla"></u--textarea>
		</view>
		<view class="msg">
			提交申请后，工作人员将尽快与您取得联系
		</view>
		<view class="button">
			提交建议
		</view>
	</view>
</template>

<script>
</script>

<style>
	page{
		background: #f8f8fa;
	}
</style>

<style lang="scss" scoped>
	.formBox{
		width: 100%;
		height: auto;
		
		.inputBox{
			width: 90%;
			height: auto;
			margin: 20rpx auto 0;
			
			.marginBottom{
				margin-bottom: 20rpx !important;
			}
			
			.title{
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
				text{
					color: red;
				}
			}
		}
		
		.msg{
			width: 90%;
			height: auto;
			margin: 20rpx auto 0;
			font-size: 28rpx;
			color: #666666;
		}
		
		.button{
			width: 60%;
			height: auto;
			padding: 25rpx 0;
			border-radius: 50rpx;
			background: linear-gradient(to right,#f082e8,#b3835b);
			text-align: center;
			color: #fff;
			margin: 60rpx auto 0;
		}
	}
</style>