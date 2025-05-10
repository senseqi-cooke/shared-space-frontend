<template>
	<view class="inteGralList">
		<view class="headerBox">
			
			<view class="content">
				<view class="bottom-view" style="display: flex; justify-content: center; align-items: center;">
					<view class=""
						style="position: relative; width: 90px; height: 90px; display: flex; justify-content: center; align-items: center;">
						<view class="centerText"
							style="position: absolute; display: flex; justify-content: center; align-items: center;">
							{{integralNum}}
						</view>
						<canvas class="progress_bg" canvas-id="cpbg"></canvas>
						<canvas class="progress_bg" canvas-id="cpbar"></canvas>
					</view>
				</view>
			</view>
			
			<view class="iconBox">
				我的积分
			</view>
		</view>
		<view class="listBox">
			<view class="integralBox" v-for="(item,index) in integralList" :key="index">
				<view class="topBox">
					<text>{{item.name}}</text>
					<text>+{{item.money}}</text>
				</view>
				<view class="timeBox">
					{{item.time}}
				</view>
			</view>
		</view>
		<!-- <view class="hideBox">
			<image src="https://shareadminapi2.tonetn.com/file/pic/20240513150411766342.png" mode=""></image>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				maxIntegralNum:100, // 最大值积分
				integralNum:10, // 当前积分
				integralList:[], // 积分列表
			}
		},
		onLoad() {
			this.drawProgressbg() // 绘制环形图
			this.getintegralList() // 获取积分列表
		},
		methods: {
			getintegralList(){ // 获取积分列表
				for (let i = 0; i <= 10; i++) {
					this.integralList.push({
						name: "积分名称",
						money: 79,
						time:"2020-1-1 1:1"
					})
				}
			},
			// 绘制路径线
			drawProgressbg: function() {
				var ctx = uni.createCanvasContext('cpbg', this);
				ctx.setLineWidth(8);
				ctx.setStrokeStyle('#b3845d');
				ctx.setLineCap('round');
				ctx.beginPath();
				ctx.arc(45, 45, 40, 0, 2 * Math.PI, false);
				ctx.stroke();
				ctx.draw();
				this.drawCircle(this.integralNum/this.maxIntegralNum)
			},
			// 动态绘制圆环
			drawCircle: function(step) {
				var ctx = uni.createCanvasContext('cpbar', this);
				ctx.setLineWidth(8);
				ctx.setStrokeStyle('#FF5B45');
				ctx.setLineCap('butt');
				ctx.beginPath();
				// 参数step 为绘制的百分比
				if (step >= 1) {
					step = 2;
				} else {
					step = step * 2
				}
				// console.log(step);
				ctx.arc(45, 45, 40, 0, step * Math.PI, false);
				ctx.stroke();
				ctx.draw();
			},
		}
	}
</script>

<style>
	page {
		background: #f8f8fa;
	}
</style>

<style lang="scss" scoped>
	.inteGralList {
		width: 100%;
		height: auto;

		.headerBox {
			width: 90%;
			height: auto;
			padding: 30rpx 0;
			background: #fff;
			border-radius: 10rpx;
			box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(9, 9, 9, .2);
			margin: 30rpx auto 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.content {
				width: 90px;
				height: 90px;
				z-index: 9999;

				.progress_bg {
					position: absolute;
					top: 0;
					left: 0;
					width: 90px;
					height: 90px;
					transform: rotate(-90deg);
				}

				.centerText {
					color: #b3845d;
					font-weight: bold;
				}
			}
			
			.iconBox{
				padding: 5rpx 30rpx;
				border:1rpx solid #b3845d;
				border-radius: 40rpx;
				margin-top: 10rpx;
				color: #b3845d;
				font-size: 28rpx;
			}
		}
		
		.listBox{
			width: 100%;
			height: auto;
			margin: 0rpx auto;
			
			.integralBox{
				width: calc(90% - 20rpx);
				height: auto;
				background: #fff;
				margin: 20rpx auto 0;
				background: #fff;
				padding: 20rpx 10rpx;
				box-shadow: 0 0 10rpx 0 rgba(9, 9, 9, .2);
				border-radius: 10rpx;
				
				.topBox{
					display: flex;
					justify-content: space-between;
				}
				
				.topBox>text:nth-child(1){
					color: #333;
					font-size: 28rpx;
					font-weight: bold;
				}
				.topBox>text:nth-child(2){
					color: red;
					font-size: 28rpx;
				}
				
				.timeBox{
					margin-top: 10rpx;
					display: flex;
					justify-content: flex-end;
					font-size: 26rpx;
				}
			}
		}
		
		.hideBox{
			width: 100%;
			height: auto;
			overflow: auto;
			image{
				display: block;
				margin: 160rpx auto 0;
			}
		}
	}
</style>
