<!--
 充值组件
 Created by xunyin 
-->
<template>
	<view class="topUpBox">
		<view class="selectSiteBox" @click="show = true">
			<text>{{shopDefault.storeName ? shopDefault.storeName : '点击选择'}}</text>
			<image src="../../static/icon/rightTwo.png" mode=""></image>
		</view>
		<view class="balance">
			<view class="numBox">
				<view class="text">
					我的余额
				</view>
				<view class="num">
					<!-- {{userInfo.nowMoney}} -->{{userBalanceMoney}}元
				</view>
			</view>
			<view class="right" @click="goPage('/pages/subPack/discounts/topUpDetail')">
				<image src="../../static/giftCardList.png" mode=""></image> 充值记录
			</view>
		</view>
		<view class="selectMoney">
			<view class="title">
				选择充值金额
			</view>
			<view class="selects">
				<view :class="[selectId == item.rechargeAmount ? '' : 'selectBoxTwo','selectBox']" v-for="item in topUpList" :key="item.rechargeAmount" @click="selectMoney(item.rechargeAmount,item.totalRechargeAmount)">
					<view class="money">
						￥{{item.rechargeAmount}}元
					</view>
					<view class="moneyTwo" v-if="item.giveAmount <= 0">
						 到账 {{item.totalRechargeAmount}}
					</view>
					<view class="moneyTwo" v-if="item.giveAmount > 0">
						赠送{{item.giveAmount}} 到账 {{item.totalRechargeAmount}}
					</view>
					<image class="sanjiao" src="../../static/sanjiao.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="topUpButton" @click="confirmRechargeMoney()">
			充值
		</view>
		<view class="noticeBox">
			<view class="title">
				储值须知
			</view>
			<view class="content" v-html="content"></view>
		</view>
		<u-picker :show="show" :columns="columns" keyName="storeName" @confirm="confirm" @cancel="cancel"></u-picker>
	</view>
</template>

<script>
	import {
		TopUpSelect,
		TopUpList,
		TopUpText
	} from "../../utils/request/gather.js"
	import { storeNameList } from "@/api/mtstore";
	import { rechargeRuleList,userBalanceList,doRecharge } from "@/api/recharge";
    import { mapGetters } from "vuex";
	import {weappPay } from "@/libs/wechat";
	import { getUserInfo } from '@/api/user';
	import {add,sub} from "@/utils/bc";
			
	export default {
		data() {
			return {
				show: false, // 店铺选择列表的显示状态
				columns: [
					[]
				], // 店铺列表
				shopDefault:{}, // 默认选择的店铺
				info: {}, // 用户信息
				topUpList:[], // 充值金额列表
				storeId:0,
				userBalanceMoney:0,
				rechargeAmount:0, // 选择充值金额
				totalRechargeAmount:0, // 选择充值总金额=充值金额+赠送金额
				selectId:null, // 当前选择的充值套餐
				content:"" // 储值须知
			}
		},
		computed: mapGetters(["userInfo"]),
		onShow: function () {
			console.log("this.userInfo:"+this.userInfo)
		},	
		methods: {
			selectMoney(rechargeAmount,totalRechargeAmount){ // 选择金额
				this.selectId = rechargeAmount;
				this.rechargeAmount = rechargeAmount;
				this.totalRechargeAmount = totalRechargeAmount;
			},
			goPage(url) { // 跳转页面
				uni.navigateTo({
					url
				})
			},
			init() { // 内容初始化
				console.log("init")
 			/*	console.log("this.userInfo.uid:"+this.userInfo.uid)
				console.log("this.userInfo.nickname:"+this.userInfo.nickname)
				console.log("this.userInfo.phone:"+this.userInfo.phone)
				console.log("this.userInfo.nowMoney:"+this.userInfo.nowMoney) */
				this.getShopList(); // 获取店铺列表
				//this.getUserInfo() // 获取用户信息
				this.getTopUpList(); // 获取充值金额列表
				//this.getTopUpText(); // 获取储值须知

			},
/* 			getUserInfo() { // 获取用户信息
				let data = uni.getStorageSync("userInfo")
				data = JSON.parse(data)
				this.info = data
			}, */
			getShopList() { // 获取店铺列表
				let that = this
				storeNameList({isAddPlatFlag:1}).then(res => {
					//that.storeList = res.data
					that.shopDefault = res.data[0]
					//console.log("storeNameList:"+JSON.parse(res.data));
					//JSON.parse(res.data)
					//let tmpList = res.data;
	/* 				tmpList.forEach(item=>{
						console.log("item:"+item);
						 that.columns.push(item);
					}) */
					//console.log(that.columns)
					
					//console.log(res.data.value)
					//that.columns.a
					that.columns = [res.data]
				})

 				//TopUpSelect().then(res => {
					//console.log("storeNameList:"+JSON.parse(res.data));
					//that.shopDefault = res.data.data[0] // 默认选择第一个
					//console.log(res.data.data.value)
					//that.columns = [res.data.data]
				//}) 
			},
			getTopUpList() { 
				let that = this
				// 充值金额列表
				rechargeRuleList({storeId:this.storeId}).then(res => {
					// 如果商家没有设置充值信息，则给用户提示
					if(res.data.rechargeRuleList.length <= 0){
						uni.showToast({
						  title: '商家未设置充值信息',
						  icon: 'none',
						  duration: 2000,
						})
						that.topUpList = []
						that.selectId = -1
						that.content = ""
					}else{
						that.topUpList = res.data.rechargeRuleList
						// 默认选择第一项充值金额
						let tmpRechargeAmount = res.data.rechargeRuleList[0].rechargeAmount;
						let tmpTotalRechargeAmount = res.data.rechargeRuleList[0].totalRechargeAmount;
						that.selectId = tmpRechargeAmount
						this.selectMoney(tmpRechargeAmount,tmpTotalRechargeAmount);
						that.content = res.data.remark
					}
				})
					
				// 根据门店Id与当前登录用户Id-获取用户在对应门店的余额
				if(this.storeId>0){

					userBalanceList({storeId:this.storeId,userId:this.userInfo.uid}).then(res => {
						that.userBalanceMoney = res.data[0].userBalance;
					})
					
				// 平台默认取用户表的nowMoney
				}else{
					this.getUserPlatBalanceInfo();
				}

				
/* 				TopUpList().then(res => {
					that.topUpList = res.data.data
					that.selectId = res.data.data[0].id
				}) */
			},
			getUserPlatBalanceInfo(){
				getUserInfo().then(res => {
					//res.data.uid
					this.userBalanceMoney = res.data.nowMoney;
				})
			},
			getTopUpText() {
/* 				let that = this
				TopUpText().then(res => {
					that.content = res.data.data.content
				}) */
			},
			confirm(e) { // 确认
				this.shopDefault = e.value[0]
				this.storeId = this.shopDefault.storeId;
				this.getTopUpList();
				console.log("this.shopDefault.storeId:"+this.shopDefault.storeId)
				console.log("this.shopDefault.storeName:"+this.shopDefault.storeName)
				this.cancel()
			},
			// 充值提交
			confirmRechargeMoney(){
				let that = this
				if(this.topUpList.length<=0){
					uni.showToast({
					  title: '商家未设置充值信息',
					  icon: 'none',
					  duration: 2000,
					})
				}else{
					// this.storeId
					// this.userInfo.uid
					 console.log("this.storeId:"+this.storeId)
					 console.log("this.userInfo.uid:"+this.userInfo.uid)
					 console.log("this.rechargeAmount:"+this.rechargeAmount)
					 console.log("this.totalRechargeAmount:"+this.totalRechargeAmount)
					 let doRechargeParam = {
						 storeId:this.storeId,
						 userId:this.userInfo.uid,
						 rechargeAmount:this.rechargeAmount
					 }
					 doRecharge(doRechargeParam).then(res => {
					 	//that.userBalanceMoney = res.data[0].userBalance;
						var payment = res.data.payment;
						console.log("doRecharge_payment: "+payment);
						weappPay(payment)
						  .then(() => {
						    //prices = add(prices, paid_price);
						    //that.now_money = add(prices, parseFloat(that.userInfo.nowMoney));
/* 						    uni.showToast({
						      title: "支付成功",
						      icon: "success",
						      duration: 2000,
						    }); */
						    // #ifdef MP-WEIXIN
						    //subscribeMessage()
						    // #endif
						    this.$yrouter.back();
						  })
/* 						  .finally((res) => {
						    //if(typeof(res) == "undefined") return
						    uni.showToast({
						      title: res.msg,
						      icon: "none",
						      duration: 2000,
						    });
						  })
						  .catch(function () {
						    uni.showToast({
						      title: "支付失败",
						      icon: "none",
						      duration: 2000,
						    });
						  }); */
					 })
/* 					 .catch((err) => {
					   console.log(err);
					   uni.showToast({
					     title: err.errorMsg || err.response.data.msg || err.response.data.message,
					     icon: "none",
					     duration: 2000,
					   });
					 }); */
					 					 
				}

			},
			cancel() { // 取消
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topUpBox{
		width: 100%;
		height: auto;
		
		.selectSiteBox{
			width: calc(90% - 40rpx);
			height: auto;
			padding: 20rpx;
			background: #f7f7f7;
			border-radius: 10rpx;
			box-shadow:4rpx 6rpx  4rpx #f1f1f1;
			margin: 30rpx auto 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			image{
				width: 60rpx;
				height: 60rpx;
			}
			
			text{
				font-size: 30rpx;
				color: #333;
			}
		}
		
		.balance{
			margin:35rpx auto 0;
			width: 90%;
			height: auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.numBox{
				display: flex;
				align-items: center;
				.text{
					font-size:38rpx;
					color: #333;
				}
				
				.num{
					font-size: 45rpx;
					color: #eb0707;
					margin-left: 20rpx;
				}
			}
			
			.right{
				display: flex;
				align-items: center;
				image{
					width: 25rpx;
					height: 25rpx;
					margin-right: 5rpx;
				}
				
				font-size: 24rpx;
				color: #b154aa;
			}
		}
		
		.selectMoney{
			width: 90%;
			height: auto;
			margin: 50rpx auto 0;
			
			.title{
				font-size: 28rpx;
				color: #333;
			}
			
			.selects::after{
				content: '';
				width: 31%;
				height: auto;
			}
			
			.selects{
				width: 100%;
				height: auto;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				margin-top: 25rpx;
				
				.selectBox{
					width: 31%;
					height: auto;
					padding: 20rpx 0;
					display: flex;
					align-items: center;
					flex-direction: column;
					border: 1rpx solid #b154aa;
					border-radius: 15rpx;
					margin-bottom:20rpx;
					position: relative;
					
					.sanjiao{
						width: 30rpx;
						height: auto;
						position: absolute;
						bottom: 0rpx;
						right: 0rpx;
					}
					
					.money{
						font-size: 35rpx;
						color: #b154aa;
						font-weight: bold;
					}
					
					.moneyTwo{
						font-size: 20rpx;
						color: #b154aa;
						font-weight: 400;
						margin-top: 10rpx;
					}
				}
				
				.selectBoxTwo{
					border:#999999 solid 1rpx !important;
					
					.sanjiao{
						display: none;
					}
				}
			}
		}
		
		.topUpButton{
			width: 90%;
			height: auto;
			margin: 40rpx auto 0;
			padding: 20rpx 0;
			background: linear-gradient(to right,#f1d1a4,#b78963);
			text-align: center;
			color: #fff;
			font-size: 35rpx;
			border-radius: 50rpx;
		}
		
		.noticeBox{
			width: 90%;
			height: auto;
			margin: 25rpx auto 0;
			.title{
				font-size: 32rpx;
				color: #333;
			}
			
			.content{
				margin-top: 20rpx;
			}
		}
	}
</style>