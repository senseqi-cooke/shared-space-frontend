<!--
 包间详情页
 Created by xunyin 
-->
<template>
	
	<view class="details">
		
		<swiper autoplay="true" class="swiper swiperBox" duration="1000" indicatorDots="true" interval="3000">
			<swiper-item class="swiperBox" v-for="banner of bannerList" :key="banner">
				<image class="img swiperBox" mode="heightFix" :src="banner"></image>
			</swiper-item> 
		</swiper>
		
<!-- 		<view
		  class="item"
		  v-for="keywordsKey of keywords"
		  :key="keywordsKey"
		  @click="toSearch(keywordsKey)"
		>{{ keywordsKey }}</view> -->
		
		<view class="headerBox">
			<view class="nameBox">
				{{storeRoomName}}<text>(推荐{{recommended}}人)</text>
			</view>
			<view class="iconBox">
<!-- 				<view class="icon" v-for="icon in iconList" :key="icon.id">
					{{icon.icon}}
				</view> -->
 				<view class="icon" v-for="icon of iconList" :key="icon">
					{{icon}}
				</view>			
				 
			</view>
			<view class="moneyBox">
				<text class="moneyIcon">￥</text>
				<text class="num">{{moneyFilter(price)}}元</text>
				<text class="text">/小时</text>
				<text class="textTwo">续订</text>
				<text class="numTwo">￥{{moneyFilter(repeatPrice)}}</text>
				<text class="text">/小时</text>
			</view>
			<view class="siteBox">
				<image src="../../../static/images/ditu.png" class="back" mode="widthFix"></image>
				<image class="iconImg" src="../../../static/images/detail-local.png" mode=""></image>
				<view class="siteTextBox">
					<view class="site">
						{{address}}
					</view>
					<view class="siteNum">
						<text>距离你{{distance}}km</text>
						<!-- <text>驾车{{teaDetailMsg.siteTime}}</text> -->
					</view>
				</view>
			</view>
			<view class="buttonBox">
				<view class="button one" @click="tenxun()">
					<image src="../../../static/images/detail-navgiate.png" mode=""></image>
					导航
				</view>
				<view class="button two" @click="call(phone)">
					<image src="../../../static/images/mobile.png" mode=""></image>
					电话
				</view>
				<view class="button three" @click="goShop('/pages/category/index')">
					<image src="../../../static/images/diandan.png" mode=""></image>
					点单
				</view>
				
				<view class="button three" @click="show2 = true">
				    <image :src="`${$VUE_APP_RESOURCES_URL}/images/wifi.png`" mode=""></image>
					连接
				</view>

						
			</view>
		</view>

		<view class="timeSelect">
			<view class="title">
				<image src="../../../static/images/detail-time.png" mode=""></image>
				选择预定时间
			</view>
			<view class="selectTimeButton" @click="isShow(true)">
				<!-- 选择预定时间 --> {{selectTimeText}}
				<image src="../../../static/icon/homeDetaBottom.jpg" mode="heightFix"></image>
			</view>
		</view>

		<view class="explainBox">
			<view class="title">
				<image src="../../../static/images/detail-remark.png" mode=""></image>
				使用说明
			</view>
			<view class="content" v-html="instr"></view>
		</view>

		<view class="bottomBox">
			<view class="button">
				<view class="left"> 
					<text class="iconOne">￥</text>
<!-- 					<text class="money" v-if="isRepeat == 0">{{moneyFilter(time ? time*price : '0')}}元</text>
					<text class="money" v-if="isRepeat == 1">{{moneyFilter(time ? time*repeatPrice : '0')}}元</text> -->
					<text class="money">{{accountMoney}}元</text>
					<text class="moneyTwo">/共{{time}}小时</text>
				</view>
				<view class="right" @click="goPage('/pages/subPack/orderList/closeAccount')">
					去结算
				</view>
			</view>
		</view>

		<u-popup :show="show" :round="10" mode="bottom" @close="isShow(false)" @open="open">
			<view class="selectBox">
				<view class="titleBox">
					<view class="title">
						预定时间
						<image src="@/static/icon/close.png" mode="" @click="isShow(false)"></image>
					</view>
				</view>
				
				<view class="rollBox">
					
					<swiper class="swiper" circular="true" :autoplay="autoplay" :interval="interval"
						:duration="duration">
						<swiper-item v-for="(item,index) in list" :key="index">
							<view class="swiper-item uni-bg-green">{{item}}</view>
						</swiper-item>
					</swiper>
					
				</view>
				
				<selectTime :beginTime="selectBeginTime" :endTime="selectEndTime" ref="selectTime">
					<!-- 这个地方是时间选择的组件，只需要传两个值 -->
					<!-- selectBeginTime是店铺开始营业的时间 默认值：00:00  格式是 HH:mm -->
					<!-- selectEndTime是店铺结束营业的时间 默认值：24:00  格式是 HH:mm -->
				</selectTime>
				
			</view>
		</u-popup>
		
		<view class="gonggao">
			<u-popup :show="show2" mode="center" height="400px" border-radius="14" @close="show2 = false">
				<view class="gonggao1">
					<p class="gonggao1-tit">门店WIFI</p>
					<p class="roles roles1" v-if="wifiSsid == null">WIFI账号: 门店未设置wifi账号</p>
					<p class="roles roles1" v-if="wifiSsid != null">WIFI账号: {{wifiSsid}}</p>
					<p class="roles" v-if="wifiPassword == null">WIFI密码: 门店未设置wifi密码</p>
					<p class="roles" v-if="wifiPassword != null">WIFI密码: {{wifiPassword}}</p>
					<p class="roles">部分机型不支持一键wifi，可以复制密码去自行连接</p>
					
					<view class="zixi-view1">
						
						<p class="zixi-button1" @click="copyTextWifi(wifiPassword)">复制密码</p>
						
					</view>
					
					<view class="zixi-view2">
						
						<p class="zixi-button2" @click="connectToWiFi(wifiSsid, wifiPassword)">一键连接</p>
						
					</view>
					
				</view>
			</u-popup>
		</view>
		
	</view>
</template>

<script>
/* 	import {
		TeaDetails
	} from "../../../utils/request/gather.js" */
	import selectTime from "../../../components/selectTime/selectTime.vue"
	import { mapGetters } from "vuex";
	import { getUserInfo, getMenuUser, wxappAuth, bindingPhone, wxappBindingPhone, wxappGetUserInfo } from '@/api/user'
	import {
		goTenXunLoca
	} from "@/utils/tenxunLoca.js"
	import Bus from '@/utils/Bus.js'
	import { getTimeListOrder } from '@/api/order';
	import { geStoreDetail,geStoreRoomDetail } from '@/api/store';
	import { urlDecode } from '@/utils/util'
	import { getStoreRoomPackageList,getStoreRoomHourList,storeRoomTimeSlotList } from '@/api/mtstore';
	
	export default {
		data() {
			return {
				//detalisId: null, // 详情id
				//teaDetailMsg: {}, // 详情数据
				accountMoney:0,
				show2: false,
				wifiSsid:"",
				wifiPassword:"",
				packageId:0,
				isPackage:0,
				teaId:0,
				teaChildId:0,
				price:0,
				repeatPrice:0,
				prePrice: 0,
				storeRoomTimeSlotVoList: [],
				startTimeNum:1,
				timeInterval:1,
				isRepeat:0,
				storeName:"",
				storeRoomName:"",
				recommended:1,
				iconList:[],
				address:"",
				distance:1,
				phone:"",
				instr:"",
				bannerList:[],		
				autoplay: true, // 自动滚动
				interval: 1000, // 	自动切换时间间隔
				duration: 10000, // 滑动动画时长
				list: [
					'该包间1小时1起订，续订1小时起享受续订优惠',
				],
				show: false, // 弹出层显示状态
				selectBeginTime: "00:00", // 日期的开始时间
				selectEndTime: "23:59", // 日期的结束时间,ios手机，24：00，打印出来为NAN，所以，处理是加上1000*60
				money: 0, // 金额
				time: 0, // 时长
				selectTimeText: "选择预定时间",
				image:"",
				selTimeData:{},
				parentOrderId:0,
				timeListDoflag:0,
				timeList:[],
				obj:{
				   timeList:[/* {
						date: "05-06", // 月份-日期
						selectBeginTime: "03:00", // 时间的开始时间
						// 时间格式 HH:mm:ss
						selectEndTime: "05:00", // 时间的结束时间
						sweep:1, // 打扫所需的时间段 
					} */]
				},
				// 套餐
				taocanList: [],
				// 小时模式
				hourList: [
					/* {
						index: 1,
						label: '2小时',
						hour: 2,
						price: '70.00'
					},
					{
						index: 2,
						label: '3小时',
						hour: 3,
						price: '105.00'
					},
					{
						index: 5,
						label: '5小时',
						hour: 5,
						price: '175.00'
					}, */
/* 					{
						index: 6,
						label: '6小时',
						hour: 6,
						price: '210.00'
					}, */
				]				
			}
		},
		computed: mapGetters(['location','userInfo']),
		components: {
			selectTime
		},
		onLoad(e) {
			
			let that = this;
			let params = urlDecode(decodeURIComponent(e.scene));
			if(params.storeId == undefined){
				
				console.log("e.images:"+e.images)
				console.log("e.icons:"+e.icons)
				console.log("this.teaId:"+this.teaId)
				console.log("e.image:"+e.image)
				this.teaId = e.teaId
				this.teaChildId = e.teaChildId
				this.storeRoomName = decodeURIComponent(e.storeRoomName)
				this.recommended = e.recommended
				this.address = decodeURIComponent(e.address)
				this.distance = e.distance
				this.phone = e.phone
				this.instr = e.instr
				this.price = e.price
				this.isRepeat = e.isRepeat
				this.image = e.image
				this.storeName = decodeURIComponent(e.storeName)
				this.latitude = e.latitude
				this.longitude = e.longitude
				this.repeatPrice = e.repeatPrice
				this.startTimeNum = e.startTimeNum
				this.list = [
					'该包间'+this.startTimeNum+'小时起订，续订享受续订优惠价',
				]
				console.log("this.latitude:"+this.latitude)
				console.log("this.longitude:"+this.longitude)
				if(e.images!==''||e.images!== null){
					this.bannerList = e.images.split(',');
				}
				if(e.icons!==''||e.icons!== null){
					
					this.iconList = decodeURIComponent(e.icons).split(',');
				}
				this.parentOrderId=e.parentOrderId;
				
				geStoreDetail(this.teaId).then(res => {
					var storeInfor = res.data;
					this.instr = storeInfor.instr
					that.wifiSsid = storeInfor.wifiSsid;
					that.wifiPassword = storeInfor.wifiPassword;	
				})	
				
			}else{
				
				console.log("latitude:"+this.location.latitude)
				console.log("longitude:"+this.location.longitude)
				let paramData = {
					latitude: this.location.latitude, //纬度
					longitude: this.location.longitude, //经度
					storeRoomId: params.storeRoomId
				};
												
				// 根据订单关联的房间Id,查询房间信息
				geStoreRoomDetail(paramData).then(res1 => {
					
					var mtStoreRoomInfor = res1.data;
					let icons = [];
					for (let i = 0; i < mtStoreRoomInfor.iconList.length; i++) {
						icons.push(mtStoreRoomInfor.iconList[i].icon)
					}
					if(icons!==''||icons!== null){
						
						this.iconList = decodeURIComponent(icons).split(',');
					}
					this.teaId = mtStoreRoomInfor.storeId
					this.teaChildId = mtStoreRoomInfor.roomId
					this.storeRoomName = decodeURIComponent(mtStoreRoomInfor.storeRoomName)
					this.recommended = mtStoreRoomInfor.recommended
					this.address = decodeURIComponent(mtStoreRoomInfor.address)
					this.distance = mtStoreRoomInfor.distance
					this.phone = mtStoreRoomInfor.phone
					//this.instr = e.instr
					this.price = mtStoreRoomInfor.price
					this.isRepeat = 0
					this.image = mtStoreRoomInfor.icon
					this.storeName = decodeURIComponent(mtStoreRoomInfor.storeName)
					this.latitude = mtStoreRoomInfor.latitude
					this.longitude = mtStoreRoomInfor.longitude
					this.repeatPrice = mtStoreRoomInfor.repeatPrice
					this.startTimeNum = mtStoreRoomInfor.startTimeNum
					this.list = [
						'该包间'+this.startTimeNum+'小时起订，续订享受续订优惠价',
					]
					console.log("this.latitude:"+this.latitude)
					console.log("this.longitude:"+this.longitude)
					if(mtStoreRoomInfor.images!==''||mtStoreRoomInfor.images!== null){
						this.bannerList = mtStoreRoomInfor.images.split(',');
					}

					//this.parentOrderId=e.parentOrderId;
					
					geStoreDetail(this.teaId).then(res => {
						var storeInfor = res.data;
						this.instr = storeInfor.instr
						that.wifiSsid = storeInfor.wifiSsid;
						that.wifiPassword = storeInfor.wifiPassword;
					})
				})									
			}	
		
			this.timeList = [{
						date: "05-06", // 月份-日期
						selectBeginTime: "03:00", // 时间的开始时间
						// 时间格式 HH:mm:ss
						selectEndTime: "05:00", // 时间的结束时间
						sweep:1, // 打扫所需的时间段 
					}, {
						date: "05-06", // 月份-日期
						selectBeginTime: "13:00", // 时间的开始时间
						selectEndTime: "17:00", // 时间的结束时间
						sweep:1, // 打扫所需的时间段
					} /* , {
						date: "05-06", // 月份-日期
						selectBeginTime: "13:00", // 时间的开始时间
						selectEndTime: "17:00", // 时间的结束时间
						sweep:1, // 打扫所需的时间段
					} */]
					
			this.obj.timeList = [{
						date: "05-06", // 月份-日期
						selectBeginTime: "03:00", // 时间的开始时间
						// 时间格式 HH:mm:ss
						selectEndTime: "05:00", // 时间的结束时间
						sweep:0, // 打扫所需的时间段 
					}, {
						date: "05-06", // 月份-日期
						selectBeginTime: "13:00", // 时间的开始时间
						selectEndTime: "17:00", // 时间的结束时间
						sweep:0, // 打扫所需的时间段
					} /* , {
						date: "05-06", // 月份-日期
						selectBeginTime: "13:00", // 时间的开始时间
						selectEndTime: "17:00", // 时间的结束时间
						sweep:1, // 打扫所需的时间段
					} */]		
/* 			let icons = e.icons;
			if(icons.length>0){
				this.iconList = e.icons.split(',');
			} */
			//this.getDetails()

			Bus.$on('isShow', (res) => {
				this.isShow(res)
			})
			
			Bus.$on('isTime', (res) => {
				this.isTime(res)
			})
			
		},
		onShow() {
			
			this.$refs.selectTime.hourList = this.hourList;
			
			// 根据门店的包间、台桌Id获取包间、台桌的时间段价格
			this.getStoreRoomTimeSlotList();
			// 获取包厢套餐模式设置列表
			this.storeRoomPackageList();
			
			// 获取该包厢小时模式设置列表
			this.storeRoomHourList();
			
			
			
		},		
		provide: function() {
			
			return {
				subscribeObj:this.obj
				//subscribeObj: () => {
					//return this.obj.timeList 
					//console.log("timeList:"+JSON.stringify(this.timeList))
					//return this.timeList
					//setTimeout(function() {
					  
/* 						let param = {
							teaChildId:this.teaChildId
						}
						getTimeListOrder(param).then(res => {
							var timeList = res.data.timeList
							var reTimeList = []
							console.log("timeList:"+JSON.stringify(timeList))
							timeList.forEach(item=>{ */
	/* 						    var reItem = {
									date: item.date, // 月份-日期
									selectBeginTime: item.selectBeginTime, // 时间的开始时间
									// 时间格式 HH:mm:ss
									selectEndTime: item.selectEndTime, // 时间的结束时间
									sweep:1, // 打扫所需的时间段 
								} */
/* 								reTimeList.push({
									date: item.date, // 月份-日期
									selectBeginTime: item.selectBeginTime, // 时间的开始时间
									// 时间格式 HH:mm:ss
									selectEndTime: item.selectEndTime, // 时间的结束时间
									sweep:1, // 打扫所需的时间段 
								})
							})
							console.log("reTimeList:"+JSON.stringify(reTimeList)) */
							//this.timeListDoflag =1;		
							//return reTimeList;
						/* })	 */				  
					  
					//}, 1000);
					

					
/* 					return [{
						date: "05-06", // 月份-日期
						selectBeginTime: "03:00", // 时间的开始时间
						// 时间格式 HH:mm:ss
						selectEndTime: "05:00", // 时间的结束时间
						sweep:1, // 打扫所需的时间段 
					}, {
						date: "05-06", // 月份-日期
						selectBeginTime: "13:00", // 时间的开始时间
						selectEndTime: "17:00", // 时间的结束时间
						sweep:1, // 打扫所需的时间段
					} , {
						date: "05-06", // 月份-日期
						selectBeginTime: "13:00", // 时间的开始时间
						selectEndTime: "17:00", // 时间的结束时间
						sweep:1, // 打扫所需的时间段
					}] */ 
					
				//}
			} 
		},
		methods: {

			storeRoomPackageList() {
				
				let that = this;
				let data = {
					storeRoomId: this.teaChildId
				};
				getStoreRoomPackageList(data).then(res => {
					
					var storeRoomPackageList = res.data;
					if(storeRoomPackageList.length > 0){
						that.taocanList = [];
						for (let i = 0; i < storeRoomPackageList.length; i++) {
							var packageItem = {
								index: storeRoomPackageList[i].id,
								label: storeRoomPackageList[i].packageName,
								price: storeRoomPackageList[i].packagePrice,
								hour: storeRoomPackageList[i].packageHour
							}

							that.taocanList.push(packageItem);
						}
						that.$refs.selectTime.taocanList = that.taocanList;	
					}
					
				})	
			},
			storeRoomHourList() {
				
				let that = this;
				let data = {
					storeRoomId: this.teaChildId
				};
				getStoreRoomHourList(data).then(res => {
					
					var storeRoomHourList = res.data;
					if(storeRoomHourList.length > 0){
						
						that.hourList = [];
						
						for (let i = 0; i < storeRoomHourList.length; i++) {
							var hourItem = {
								index: storeRoomHourList[i].id,
								label: storeRoomHourList[i].hourName,
								hour: storeRoomHourList[i].hourNum,
								price: storeRoomHourList[i].hourNum*this.price
							}
							
							that.hourList.push(hourItem);
						}
						
						that.$refs.selectTime.hourList = that.hourList;	
						
					}
						
				})	
				
			},
			getStoreRoomTimeSlotList() {

				let that = this;
				console.log("that.storeRoomId:" + that.teaChildId);
				let data = {
					storeRoomId: that.teaChildId
				};
				storeRoomTimeSlotList(data).then(res => {

					var mtStoreRoom = res.data;
					that.storeRoomTimeSlotVoList = mtStoreRoom.storeRoomTimeSlotList;
					that.price = mtStoreRoom.price;
					that.prePrice = mtStoreRoom.prePrice;
				})

			},				
			open() {
				// console.log('open');
			},
			formatePrice(money){
				return parseInt(money)
			},
			moneyFilter (value) {
				// 截取当前数据到小数点后两位
				let realVal = parseFloat(value).toFixed(2)
				return realVal
			},
			// 设置选择时间框的显示状态						
			isShow(state) { 
			
				if(state){
					
					let param = {
						teaChildId:this.teaChildId
					}
					getTimeListOrder(param).then(res => {
						
						var timeList = res.data.timeList
						this.obj.timeList = []
						console.log("timeList:"+JSON.stringify(timeList))
						timeList.forEach(item=>{
							
		/* 					var reItem = {
								date: item.date, // 月份-日期
								selectBeginTime: item.selectBeginTime, // 时间的开始时间
								// 时间格式 HH:mm:ss
								selectEndTime: item.selectEndTime, // 时间的结束时间
								sweep:1, // 打扫所需的时间段 
							} */
							
							if(this.isRepeat==1){
								
								this.obj.timeList.push({
									date: item.date,                       // 月份-日期
									selectBeginTime: item.selectBeginTime, // 时间的开始时间
									endDate: item.endDate,                 // 月份-日期
									// 时间格式 HH:mm:ss
									selectEndTime: item.selectEndTime,    // 时间的结束时间
									sweep:0,                              // 打扫所需的时间段 
								})
								
							}else{
								
								this.obj.timeList.push({
									date: item.date,                         // 月份-日期
									selectBeginTime: item.selectBeginTime,   // 时间的开始时间
									endDate: item.endDate,                   // 月份-日期
									// 时间格式 HH:mm:ss
									selectEndTime: item.selectEndTime,      // 时间的结束时间
									sweep:1,                               // 打扫所需的时间段 
								})
								
							}

						})	
						this.show = state
						this.$refs.selectTime.refreshTimeList(1);
					})
				}else{
					this.show = state
				}
				
/* 				this.obj.timeList = [{
							date: "05-06", // 月份-日期
							selectBeginTime: "03:00", // 时间的开始时间
							// 时间格式 HH:mm:ss
							selectEndTime: "05:00", // 时间的结束时间
							sweep:1, // 打扫所需的时间段 
						}, {
							date: "05-06", // 月份-日期
							selectBeginTime: "13:00", // 时间的开始时间
							selectEndTime: "17:00", // 时间的结束时间
							sweep:1, // 打扫所需的时间段
						} ] */
				
						
			},
			// 子组件传来的时间信息
			isTime(time) {
				let that = this;
				this.time = time.timeInterval
				console.log("时常:" + time.timeInterval); // 预定时常
				console.log("预定日期:" + time.deta.date1); // 预定日期
				console.log("预定日期:" + time.deta.date); // 预定日期
				console.log("时间:" + time.startTime.begin + ' - ' + time.endTime.end); // 结束预约时间
				this.selectTimeText = time.deta.date+" " +time.startTime.begin+"~"+time.endTime.end
				//console.log("时间:" + time.startTime.time + ' - ' + time.endTime.time); // 结束预约时间
				this.selTimeData = time;
				this.timeInterval = time.timeInterval;
				 
				console.log("是否选择套餐:" + time.isPackage); 
				console.log("套餐Id:" + time.packageId);
				console.log("套餐价格:" + time.packagePrice);
				
				this.packageId = time.packageId;
				this.isPackage = time.isPackage;
				if(time.isPackage==1){
					
					that.accountMoney = that.moneyFilter(time.packagePrice);
					
				}else{
					
					if(that.isRepeat==0){
						
						that.accountMoney = that.moneyFilter(that.time ? that.time*that.price : '0');
						
					}
					if(that.isRepeat==1){
						
						that.accountMoney = that.moneyFilter(that.time ? that.time*that.repeatPrice : '0');
					}
										
				}
				 
			},
			getDetails() { // 获取详情
/* 				let data = {
					detalisId: this.detalisId
				}
				let that = this
				TeaDetails(data).then(res => {
					that.teaDetailMsg = res.data.data
				}) */
			},
			// 调起导航
			tenxun() { 
					
				goTenXunLoca(this.address, this.latitude, this.longitude);
				
			},
			call(phone) { // 拨打电话
				uni.makePhoneCall({
					phoneNumber: phone,
					success: function() {
						console.log('拨打电话成功');
					},
					fail() {
						uni.showToast({
							title: "拨打电话失败，请确认电话格式是否正确",
							icon: "none"
						})
					}
				})
			},
			copyTextWifi(password){
				
				uni.setClipboardData({
				    data: password,
				    success: function () {
				        uni.showToast({
				            title: '复制成功',
				            icon: 'success',
				            duration: 2000
				        });
				    }
				});
			},
			connectToWiFi(ssid, password) {
			  let that = this;
			  // 启动 Wi-Fi 模块
			  uni.startWifi({
					success: () => {
					  console.log('初始化 Wi-Fi 成功');
					  // 连接指定 Wi-Fi
					  uni.connectWifi({
							forceNewApi: true,  
							SSID: ssid,
							password: password,
							success: () => {
							  uni.showToast({
								title: 'Wi-Fi连接成功',
								icon: 'success'
							  });
							},
							fail: (error) => {
							  console.error('连接 Wi-Fi 失败:', error);
							  uni.showToast({
								title: '连接失败，请检查参数',
								icon: 'none'
							  });
							}
					  });
					},
					fail: (error) => {
					  console.error('初始化 Wi-Fi 失败:', error);
					  uni.showToast({
						title: 'Wi-Fi功能初始化失败',
						icon: 'none'
					  });
					}
			  });
				  
			  that.show2 = !that.show2;
					
			},			
			// 跳转到门店商城
			goShop(url){
				
				url = url+'?teaId='+this.teaId+'&teaChildId='+this.teaChildId;
				
				uni.navigateTo({
					url
				})
				
			},
			// 跳转页面
			goPage(url) {
				
				if (this.time != 0) {
					
					if(this.isRepeat==0){
						
						if(this.startTimeNum > this.timeInterval){
							
							uni.showToast({
								title: this.startTimeNum+"小时起订,请选择小时数大于等于"+this.startTimeNum+"小时哦",
								icon: "none"
							})
							return false;
							
						}
						
					}
					
					//var orderMoney = this.time ? this.time*this.price : 0;
					var orderMoney = this.accountMoney;
					
					console.log("yeardate:"+this.selTimeData.deta.date1)
					console.log("startTime:"+this.selTimeData.startTime.begin)
					console.log("endDate:"+this.selTimeData.endTime.selectDate)
					console.log("endTime:"+this.selTimeData.endTime.end)
					console.log("monthDay:"+this.selTimeData.startTime.selectDate)
					var packMode = 1;
					var packMoney = 0;
					// 是选择套餐
					if(this.isPackage==1){
						
						packMode = 0;
						packMoney = orderMoney;
						
					}
					
					// time.endTime.selectDate
					url = url+'?teaId='+this.teaId + '&teaChildId='+this.teaChildId + '&storeRoomName='+this.storeRoomName +
						'&storeName='+this.storeName + '&image=' + this.image + '&orderMoney=' + orderMoney + '&selectTimeText=' + this.selectTimeText +
						'&price='+this.price +'&timeInterval='+this.timeInterval+'&repeatPrice='+this.repeatPrice +'&isRepeat='+this.isRepeat +
						'&yeardate='+this.selTimeData.deta.date1+'&startTime='+this.selTimeData.startTime.begin+
						'&endDate='+this.selTimeData.endTime.selectDate+
						'&endTime='+this.selTimeData.endTime.end+
						'&monthDay='+this.selTimeData.startTime.selectDate+
						'&parentOrderId='+this.parentOrderId+
						'&packageId='+this.packageId+'&packMode='+packMode+'&packMoney='+packMoney
						
					uni.navigateTo({
						url
					})
					
				} else {
					uni.showToast({
						title: "请选择时间段",
						icon: "none"
					})
				}
			}
		}
	}
</script>

<style>
	page {
		background: #f2f3f7;
	}
</style>

<style lang="scss" scoped>
	.details {
		width: 100%;
		height: auto;

		.swiper {
			background: #f5f5f5;
			height: 414rpx;
		}

		.swiperBox {
			display: flex;
			justify-content: center;

			.img {
				height: 414rpx;
				width: 100%;
			}
		}

		.headerBox {
			width: calc(100% - 60rpx);
			height: auto;
			background: #fff;
			padding: 30rpx;

			.nameBox {
				font-size: 32rpx;
				color: #333;

				text {
					font-size: 28rpx;
					margin-left: 30rpx;
				}
			}

			.iconBox {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				margin-top: 30rpx;

				.icon {
					padding: 2rpx 20rpx;
					border-radius: 5rpx;
					background: #f0f0f0;
					font-size: 24rpx;
					color: #6a5d6a;
					margin-right: 20rpx;
				}
			}

			.moneyBox {
				margin-top: 10rpx;

				.moneyIcon {
					color: #eb0707;
					font-size: 20rpx;
				}

				.num {
					color: #eb0707;
				}

				.text {
					font-size: 28rpx;
					color: #9999a6;
				}

				.textTwo {
					margin-left: 15rpx;
					font-size: 28rpx;
					color: #666;
				}

				.numTwo {
					color: #eb0707;
					font-size: 28rpx;
				}
			}

			.siteBox {
				flex: 1;
				min-height: 90rpx;
				margin-top: 10rpx;
				display: flex;
				align-items: center;
				position: relative;
				padding: 20rpx;
				// background: #f7f8fc;
				z-index: 999;
				border-radius: 15rpx;
				position: relative;

				.back {
					width: 690rpx;
					position: absolute;
					top: 0rpx;
					left: 0rpx;
					z-index: -1;
				}

				.iconImg {
					width: 40rpx;
					height: 40rpx;
				}

				.siteTextBox {
					flex: 1;
					height: auto;
					margin-left: 20rpx;

					.site {
						color: #333;
						font-size: 32rpx;
					}

					.siteNum {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 15rpx;
						font-size: 22rpx;
						color: #316750;
					}
				}
			}

			.buttonBox {
				width: 100%;
				height: auto;
				display: flex;
				margin-top: 20rpx;

				.button {
					display: flex;
					align-items: center;
					justify-content: center;
					flex: 1;

					image {
						width: 50rpx;
						height: 50rpx;
						margin-right: 10rpx;
					}
				}

				.one {
					color: #333;
					border-right: 2rpx solid #d8d8d8;
				}

				.two {
					color: #3e715c;
				}
				.three {
					color: #ff5500;
					border-left: 2rpx solid #d8d8d8;
				}
			}
		}

		.timeSelect {
			width: calc(100% - 60rpx);
			height: auto;
			background: #fff;
			margin-top: 20rpx;
			padding: 20rpx 30rpx;

			.title {
				display: flex;
				align-items: center;

				image {
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
				}
			}

			.selectTimeButton {
				width: 80%;
				padding: 10rpx 0;
				height: auto;
				background: #fbdaff;
				text-align: center;
				margin: 20rpx auto 0;
				border-radius: 10rpx;
				color: #b154aa;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					height: 20rpx;
					margin-left: 10rpx;
				}
			}
		}

		.explainBox {
			width: calc(100% - 60rpx);
			height: auto;
			background: #fff;
			margin-top: 20rpx;
			padding: 20rpx 30rpx 120rpx;

			.title {
				display: flex;
				align-items: center;

				image {
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
				}
			}

			.content {
				margin-top: 60rpx;
			}
		}

		.bottomBox {
			width: 100%;
			height: auto;
			position: fixed;
			bottom: 20rpx;
			display: flex;
			justify-content: center;

			.button {
				width: 85%;
				height: 94rpx;
				background: #fff;
				display: flex;
				border-radius: 50rpx;
				overflow: hidden;

				.left {
					flex: 1;
					padding-left: 30rpx;
					display: flex;
					align-items: center;

					.iconOne {
						font-size: 20rpx;
						color: #eb0707;
					}

					.money {
						color: #eb0707;
					}

					.moneyTwo {
						font-size: 28rpx;
						color: #acacac;
					}
				}

				.right {
					width: 35%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #fff;
					background: linear-gradient(#f082e8, #b4845c);
				}
			}
		}

		.selectBox {
			width: auto;
			height: 75vh;
			overflow: auto;

			.titleBox {
				width: 100%;
				height: auto;
				margin-top: 25rpx;
				text-align: center;
				font-size: 34rpx;
				position: relative;

				image {
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					right: 20rpx;
				}
			}

			.rollBox {
				width: 100%;
				height: auto;

				.swiper {
					width: 90%;
					height: 35rpx;
					padding: 15rpx 0;
					margin: 40rpx auto 0;
					border-radius: 15rpx;
					font-size: 28rpx;
					background: #d8e2de;
					color: #316750;
					text-align: center;

					.swiper-item {
						width: 100%;
						white-space: nowrap;
					}
				}
			}
		}
	}
	
/deep/ .gonggao .u-popup__content {
	border-radius: 30upx;
}

.gonggao1 {
	width: 550upx;
	padding: 20upx;
	background: linear-gradient(to bottom, #FFFBF0, #FFFFFD);
	border-radius: 30upx;
}

.gonggao1-tit {
	font-weight: 700;
	text-align: center;
}

.gonggao1-tit1 {
	margin-top: 30upx;
}

.roles {
	color: #888888;
	font-size: 26upx;
	margin-top: 10upx;
	line-height: 48upx;
}

.roles1 {
	margin-top: 20upx;
}

.zixi-button {
	background: linear-gradient(to left, #F65B25, #FEA101);
	color: #fff;
	width: 280upx;
	font-size: 28upx;
	border-radius: 10upx;
	padding: 20upx 30upx;
}

.zixi-button1 {
	background: linear-gradient(to left, #ffaa00, #ff9e01);
	color: #fff;
	width: 150upx;
	font-size: 28upx;
	border-radius: 10upx;
	padding: 20upx 30upx;
}

.zixi-button2 {
	background: linear-gradient(to left, #F65B25, #FEA101);
	color: #fff;
	width: 150upx;
	font-size: 28upx;
	border-radius: 10upx;
	padding: 20upx 30upx;
}

.zixi-view {
	text-align: center;
	margin-left: 112upx;
	margin-top: 20upx;
}

.zixi-view1 {
	text-align: center;
	margin-left: 50upx;
	margin-top: 20upx;
}

.zixi-view2 {
	text-align: center;
	margin-left: 290upx;
	margin-top: -70upx;
}	
</style>
