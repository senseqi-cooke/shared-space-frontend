<!--
 卡券组件
 Created by xunyin 
-->
<template>
	<view class="couponBox">
		<view class="selectSiteBox" >
			<text>{{shopDefault.storeName ? shopDefault.storeName : '点击选择店铺'}}</text>
			<!-- <image src="../../static/icon/rightTwo.png" mode=""></image> -->
		</view>
		<view class="couponList">
			<view class="couponLi" v-for="item in couponList" :key="item.id">
				<view class="left">
					<view class="time" v-if="item.type === 'H'">
						{{item.hourCount}}小时
					</view>
					<view class="time" v-if="item.type === 'N'">
						{{item.useableCount}}次数
					</view>
					<view class="time" v-if="item.type === 'C'">
						{{item.amount}}元
					</view>											
					<view class="icon" v-if="item.type === 'H'">
						时长券
					</view>
					<view class="icon" v-if="item.type === 'N'">
						次数券
					</view>
					<view class="icon" v-if="item.type === 'C'">
						优惠券
					</view>					
				</view> 
				<view class="center" > <!-- @click="goPage('./couponDetail',item)" -->
					
					<view class="name">
						{{item.name}}
					</view>
					
	 				<view class="condition" v-if="item.availWeekdaysText != null">
						使用条件：{{item.availWeekdaysText}}
					</view>
					
					<view class="isMsg">
	<!-- 					<text style="font-size: 13px;" 
							v-if="item.availTimescaleText != null">
							{{item.availTimescaleText}} - {{item.isNewGive}}
						</text> -->
			<!-- 			<text class="money">
							￥{{item.amount}}
						</text> -->
						
			 			<text style="font-size: 13px;" 
						@click="goSendCoupon('/pages/subPack/shop/sendCoupon',item)">发券>>
						</text> 
						
						<text style="font-size: 13px;" v-if="item.isNewGive == 'A'"
							@click="updateIsNewGiveStatus('D',item.id)"> 新用户不赠送>>
						</text>
												
						<text style="font-size: 13px;" v-if="item.isNewGive == 'D'"
							@click="updateIsNewGiveStatus('A',item.id)"> 新用户赠送>>
						</text>												
												
					</view>
					
				</view>
				<view class="right" @click="goPageEdit(item)">
					<view class="">
						编
					</view>
					<view class="">
						辑
					</view>
				</view>
			</view>
		</view>
		<view class="hideTextBox">
			没有更多了哟~
		</view>
		<u-picker :show="show" :columns="columns" keyName="storeName" @confirm="confirm" @cancel="cancel"></u-picker>
	</view>
</template>

<script>
	import {
		CouponShop,
		CouponList
	} from "../../utils/request/gather.js"
	import { storeNameList } from "@/api/mtstore";
	import { getCouponList,userBuyConpon,updateIsNewGiveStatus } from "@/api/coupon";
    import { mapGetters } from "vuex";	
	import {weappPay } from "@/libs/wechat";
	import { getUserInfo } from '@/api/user';
	import { geStoreDetail } from '@/api/store';
	export default {
		data() {
			return {
				show: false, // 店铺选择列表的显示状态
				columns: [
					[]
				], // 店铺列表
				storeId:0,
				shopDefault:{}, // 默认选择的店铺
				couponList:[], // 卡券列表
			}
		},
		computed: mapGetters(["userInfo"]),
		methods: {
			
			goSendCoupon(url,item){
				url = url+'?id='+item.id + '&name='+item.name + '&roomIds='+item.roomIds +
						'&storeId=' + this.storeId
				uni.navigateTo({
					url
				})
				
			},
			goPage(url,item) { // 跳转页面
				console.log("item.id:"+item.id)
				 url = url+'?id='+item.id + '&amount='+item.amount + '&everyUseableHourCount='+item.everyUseableHourCount + 
				'&hourCount='+item.hourCount + '&limitDay=' + item.limitDay + '&limitNum=' + item.limitNum + '&name=' + item.name +
				'&roomIds=' + item.roomIds + '&useableCount=' + item.useableCount +'&availWeekdays='+item.availWeekdays +
				'&availTimescale=' + item.availTimescale + '&roomIds=' + item.roomIds + '&storeIds='+item.storeIds +
				'&type=' + item.type +'&storeId=' + this.storeId
				
				uni.navigateTo({
					url
				})
			},
			goPageEdit(item){
				var url = "";
				if(item.type=='H'){
					url = "/pages/subPack/shop/editCouponH"
				}else if(item.type=='N'){
					url = "/pages/subPack/shop/editCouponN"
				}else if(item.type=='C'){
					url = "/pages/subPack/shop/editCouponC"
				}
				url = url+'?id='+item.id + '&amount='+item.amount + '&everyUseableHourCount='+item.everyUseableHourCount + 
					'&hourCount='+item.hourCount + '&limitDay=' + item.limitDay + '&limitNum=' + item.limitNum + '&name=' + item.name +
					'&roomIds=' + item.roomIds + '&useableCount=' + item.useableCount +'&availWeekdays='+item.availWeekdays +
					'&availTimescale=' + item.availTimescale + '&roomIds=' + item.roomIds + '&storeIds='+item.storeIds +
					'&description=' + item.description + '&remarks=' + item.remarks +
					'&beginTime=' + item.beginTime + '&endTime=' + item.endTime +
					'&outRule=' + item.outRule + '&total=' + item.total +
					'&type=' + item.type +'&storeId=' + this.storeId
			
				uni.navigateTo({
					url
				})
			},
			init(storeId) { // 内容初始化
				this.storeId = storeId;
				this.shopDefault.storeId = this.storeId;
				this.getShopInfor();
				//this.getShopList();   // 获取店铺列表
				//this.getCouponList(); // 卡券列表
			},
			getShopInfor(){
				let that = this
				geStoreDetail(this.storeId).then(res => {
					var storeInfor = res.data;
					// console.log("storeInfor.name:"+storeInfor.name);
					that.shopDefault.storeName = storeInfor.name;
					//this.instr = storeInfor.instr
				})
				this.getCouponList();
			},
/* 			getShopList() { // 获取店铺列表
				let that = this
				storeNameList({isAddPlatFlag:0}).then(res => {
					that.shopDefault = res.data[0]
					this.storeId = this.shopDefault.storeId;
					//that.shopDefault.storeName = "所有门店";
					that.columns = [res.data];
					that.getCouponList();
				})	
			}, */
			getCouponList(){ // 卡券列表
				let that = this
				getCouponList({storeId:this.storeId,changeType:1}).then(res => {
					
					that.couponList = res.data.couponList.content
					
				})	
/* 				CouponList().then(res => {
					that.couponList = res.data.data
				}) */
			},
			confirm(e) { // 确认
				this.shopDefault = e.value[0]
				this.storeId = this.shopDefault.storeId;
				this.getCouponList(); // 获取卡券列表
				this.cancel()
			},
			confirmUserBuyConpon(couponId,couponType){
				let param = {
					storeId:this.storeId,
					userId:this.userInfo.uid,
					couponId:couponId,
					couponType:couponType
				}
				console.log("param.storeId:"+param.storeId)
				console.log("param.userId:"+param.userId)
				console.log("param.couponId:"+param.couponId)
				console.log("param.couponType:"+param.couponType)
				userBuyConpon(param).then(res => {
					var payment = res.data.payment;
					weappPay(payment)
						.then(() => {
							
							this.$yrouter.back();
						})
				}) 
					
			},
			updateIsNewGiveStatus(isNewGive,id){
				let param = {
					isNewGive:isNewGive,
					id:id
				};
				updateIsNewGiveStatus(param).then(res => {
					if (res.status == 200) {
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
						this.getCouponList();
					}
				})
			},				
			cancel() { // 取消
				this.show = false
			}
		}
	}
</script>

<style scoped lang="scss">
	.couponBox {
		width: 100%;
		height: auto;

		.selectSiteBox {
			width: calc(90% - 40rpx);
			height: auto;
			padding: 20rpx;
			background: #f7f7f7;
			border-radius: 10rpx;
			box-shadow: 4rpx 6rpx 4rpx #f1f1f1;
			margin: 30rpx auto 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			image{
				width: 60rpx;
				height: 60rpx;
			}

			text {
				font-size: 30rpx;
				color: #333;
			}
		}

		.couponList {
			width: 100%;
			height: auto;

			.couponLi {
				width: 90%;
				height: auto;
				margin: 30rpx auto 0;
				display: flex;
				box-shadow: 4rpx 6rpx 4rpx #f1f1f1;
				border-radius: 10rpx;
				overflow: hidden;

				.left {
					min-width: 170rpx;
					padding: 40rpx 30rpx 30rpx 30rpx;
					background: linear-gradient(to right, #fbdaff, #f082e8);
					display: flex;
					flex-direction: column;
					text-align: center;

					.time {
						font-size: 55rpx;
						color: #b154aa;
					}

					.icon {
						text-align: center;
						padding: 2rpx 0;
						border: 1rpx solid #b154aa;
						font-size: 24rpx;
						color: #b154aa;
						margin-top: 5rpx;
					}
				}

				.center {
					background: #fff;
					flex: 1;
					padding: 20rpx 30rpx 20rpx 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.name {
						font-size: 30rpx;
					}

					.condition,
					.isMsg {
						font-size: 22rpx;
						color: #999;
					}

					.isMsg {
						display: flex;
						justify-content: space-between;

						.money {
							font-size: 28rpx;
							color: #eb0707;
						}
					}
				}

				.right {
					padding: 0rpx 20rpx;
					background: #b154aa;
					color: #fff;
					font-size: 28rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
				}
			}
		}
		
		.hideTextBox{
			margin: 40rpx auto 30rpx;
			text-align: center;
		}
	}
</style>
