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
		
<!-- 		<view class="homePageBox">
				<view class="sidebarBox">
					<view class="sidebar one" @click="goPageAdd('/pages/subPack/shop/editCleanStaff')">
						<image src="https://shareadminapi2.tonetn.com/file/pic/20240513152414458143.jpg" mode="heightFix"></image>
						+保洁员
					</view>						
				</view>
		</view> -->
			
		<view class="teamList" v-if="cleaningList.length > 0">
			
			<view class="teamBox" v-for="(item,index) in cleaningList" :key="index">
				
				<view class="left">
					<!-- <image :src="item.icon" mode="widthFix"></image> -->
					<view class="nameBox">
						<view class="name">
							清洁的房间：{{item.teaChildName}}
						</view>
						<view class="teamName">
							清洁员手机号：{{item.cleannerPhone}}
						</view>
						<view class="teamName">
							清洁备注：{{item.remark}}
						</view>	
					</view>
				</view>
				
				<view class="bottom">
					
					<text>清洁时间：{{parseTime1(item.createTime)}}</text>
				</view>

<!-- 				<view class="state" v-if="item.auditedStatus == 'A'">
					启用
				</view>
				
				<view class="state" v-if="item.auditedStatus == 'N'">
					禁止
				</view> -->
						
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
	import { getCleaningList } from '@/api/mtstore';	
	import { parseTime1 } from "@/utils";
	export default {
		data() {
			return {
				navSelect: 0, // 导航栏的选择
				cleaningList: [], // 保洁日志列表
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
			this.getCleaningList();
		},
		methods: {
			parseTime1,
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
			goPageAdd(url) { // 跳转页面
				url = url+'?id=&category=2&mobile='+
				'&realName=&description=&auditedStatus='+
				'&storeId=' + this.storeId
				
				uni.navigateTo({
					url
				})
			},
			goPageEdit(url,item) { // 跳转页面

				url = url+'?id='+item.id + '&category='+item.category +
					'&mobile='+item.mobile + '&realName=' + item.realName + 
					'&description='+item.description+ '&auditedStatus=' + item.auditedStatus +
					'&storeId='+this.storeId
					
				uni.navigateTo({
					url
				})
			},						
			getCleaningList() { // 获取员工列表
				//let i = 0
				let paramData = {
					storeId:this.storeId,
					category:2
				};
				getCleaningList(paramData).then(res => {
					if (res.status == 200) {
						//var orderList = res.data;
						this.cleaningList = res.data;
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
		
	.orderList {
		width: 100%;
		height: auto;
	
		.orderBox {
			width: 90%;
			height: auto;
			padding: 20rpx;
			background: #fff;
			border-radius: 15rpx;
			margin: 20rpx auto 0;
	
			.topBox {
				display: flex;
				align-items: center;
	
				image {
					width: 160rpx;
					height: 160rpx;
					border-radius: 15rpx;
				}
	
				.nameBox {
					margin-left: 20rpx;
					flex: 1;
	
					.name {
						font-size: 30rpx;
						color: #333;
						font-weight: bold;
					}
	
					.msg {
						flex: 1;
						display: flex;
						margin-top: 15rpx;
	
						.icon {
							font-size: 24rpx;
							padding: 3rpx 8rpx;
							color: #fff;
							background: #c1c1c1;
							border-radius: 5rpx;
							margin-right: 15rpx;
						}
					}
	
					.money {
						color: red;
						font-size: 28rpx;
						margin-top: 15rpx;
					}
				}
			}
	
			.bottomBox {
				margin-top: 20rpx;
				display: flex;
				justify-content: flex-end;
	
				.button {
					padding: 10rpx 35rpx;
					color: #fff;
					background: #5bd75b;
					border-radius: 40rpx;
					font-size: 28rpx;
					font-weight: bold;
				}
			}
		}
	}	
		
</style>