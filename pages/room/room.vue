<template>
	<view class="container">
		<view class="port-three-list">
			<view class="port-three-list-one-port">
				<view class="port-three-list-one-port">
<!-- 					<image class="list-one-port-img" src="https://shop.sdxinruan.com/taiqiu/static/fangjian.jpeg"
						mode=""></image> -->
					<image :src="image" mode="" class="list-one-port-img"></image>	
					<!-- <p class="daiqingjie">待清洁</p> -->
				</view>
				<view class="list-one-port-ri">
					<view class="list-one-port-ri-baoming">
						<p class="list-one-port-ri-baoming-p">{{storeRoomName}}<!-- VIP 富豪厅 --></p>
						<!-- <p class="list-one-port-ri-baoming-p1">（商务包）</p> -->
					</view>

					
					<view class="list-one-port-ri-tiaojian">
						<view v-for="icon of iconList" :key="icon">
							<p class="list-one-port-ri-tiaojian-li">{{icon}}</p>
						</view>
					</view>
					
					<view class="tip">
						<view class="type">
							<p>包间类型：商务包</p>
						</view>
						<view class="type">
							<p>注意事项：最低为{{startTimeNum}}小时起订</p>
						</view>
						<view class="type" @click="goShop('/pages/category/index')">
							<p class="yuding" style="width: 35px;font-size: 35upx;">点单</p>
						</view>
					</view>
					<view class="jiage">
						<view class="jiage-le">
							<p class="jiage-le-red">￥{{moneyFilter(price)}}</p>
							<p class="jiage-le-p1">元/小时</p>
						</view>
						<view class="jiage-ri">
							<p class="jiage-ri-p1">续单</p>
							<p class="jiage-ri-p2">￥{{moneyFilter(repeatPrice)}}元</p>
							<p class="jiage-ri-p1">/小时</p>
						</view>
					</view>

				</view>
			</view>

		</view>
		<!-- mode -->
		<view class="mode">
			<u-tabs class="tab-mode" :current="tabsCurrent" :list="list" lineWidth="20" lineHeight="4"
				lineColor="#f56c6c" :activeStyle="{
			        color: '#fd6024',
			        fontWeight: 700,
			    }" :inactiveStyle="{
			        color: '#606266',
			    }" itemStyle="padding-left: 15px; padding-right: 15px; height: 50px;" @click="tabsClick">
			</u-tabs>
		</view>
		<view class="modedateselect-mt">
			<modeDateSelect :selectDate1="selectDate" @change-time="timeEmit"></modeDateSelect>
		</view>
		<view>
			<view class="motaocan">
				<view class="motaocan-text">{{motaocanText}}</view>
				<view class="motaocan-list" v-if="tabsCurrent === 0">
					<view class="motaocan-list-item" :class="{ 'selected': index === selectedIndex }"
						v-for="item,index in taocanList" :key="index" @click="handletaoCan(index,item.hour)">
						<text class="motaocan-list-label">{{ item.label}}</text>
						<text class="motaocan-list-price">￥{{ item.price}}</text>
					</view>
				</view>
				<view class="motaocan-list" v-if="tabsCurrent === 1">
					<view class="motaocan-list-item hour-item" :class="{ 'selected': index === selectedIndex }"
						v-for="item,index in hourList" :key="index" @click="handletaoCan(index,item.hour)">
						<text class="motaocan-list-label">{{ item.label}}</text>
						<!-- <text class="motaocan-list-price">￥{{ item.price}}</text> -->
					</view>
				</view>
			</view>
			<view class="date-select">
				<view class="date-select-text">时间选择</view>
				<view class="date-select-btn">
					<!-- <view class="btn-date" @click="show = true"> -->
					<view class="btn-date bg">
						<text>{{selectTime}}</text>

					</view>
					<view style="text-align: center;color: #000;font-size: 24upx;">
						<p>消费时长</p>
						<p>{{spaceTime}}小时</p>
					</view>
					<view class="btn-date bg">
						<text>{{endSpaceTime}}</text>

					</view>
				</view>
				<!-- 时段 -->
				<div class="shiduan">

					<div class="shiduan-1" v-for="(item,index) in timeList" :key="index">
						
						<view v-if="item.isPre==1">
							<p class="shiduan-1-p1"></p>
						</view>
						
						<view v-if="item.isPre==0">
							<p class="shiduan-1-p1 shiduan-1-p1-gray" ></p>
						</view>
						
						<p class="shiduan-1-p2">{{ item.num }}</p>
						
					</div>
				</div>
				
				<view class="shiduan-2">
					<view class="shiduan-2-view">
						<p class="shiduan-1-p1"></p>
						<p class="shiduan-2-view-p">已预订时段</p>
					</view>
					<view class="shiduan-2-view shiduan-2-view1">
						<p class="shiduan-1-p1 shiduan-1-p1-gray"></p>
						<p class="shiduan-2-view-p">可预订时段</p>
					</view>
				</view>
			</view>
		</view>

		<!-- 使用说明 -->
		<view class="use" style="margin-bottom: 100rpx;">
			<span>使用说明</span>
			<view class="content" v-html="instr" style="margin-top: 30rpx;"></view>
		</view>
		<!-- 预定 -->
		<view class="destined">
			<div class="con">
				<view class="left">
					<p v-if="tabsCurrent != 1">
						<span>￥{{ taocanList[selectedIndex].price }}元</span>/共{{ taocanList[selectedIndex].label }}</p>
					<p v-if="tabsCurrent === 1">
						<span>￥{{ hourList[selectedIndex].price }}元</span>/共{{ hourList[selectedIndex].label }}
					</p>
				</view>
				<view class="right" @click="goPage('/pages/subPack/orderList/closeAccount')">预定</view>
			</div>
		</view>
		<!-- 时间选择器 -->
		<view>

			<u-datetime-picker
					:show="show"
					v-model="value1"
					:minDate="minDate"
					:maxDate="maxDate"
					@confirm="handelConfirm"
					@cancel="handelClose"
					mode="datetime">
			</u-datetime-picker>
		</view>
	</view>
</template>

<script>
	//  引入日期时间格式代码
	import modeDateSelect from '@/components/modeDateSelect/modeDateSelect.vue';
	import { geStoreDetail } from '@/api/store';
	import { getStoreRoomPackageList,getStoreRoomHourList,storeRoomTimeSlotList } from '@/api/mtstore';
	import { getTimeListOrderV2 } from '@/api/order';
	export default {
		data() {
			return {
				show: false,
				selectTime: '22:15',
				// tabs 切换数组
				list: [{
					name: '套餐模式'
				}, {
					name: '小时模式'
				}],
				selectModeDesc: [{
					name: '套餐选择'
				}, {
					name: '消费时间'
				}],
				motaocanText:'套餐选择',
				tabsCurrent: 0,
				value1: '',
				spaceTime: 3,
				endSpaceTime: '',
				// 套餐
				taocanList: [{
						index: 1,
						label: '3小时套餐',
						price: '90.0',
						hour: 3
					},
					{
						index: 2,
						label: '5小时套餐',
						price: '150.0',
						hour: 5
					},
					{
						index: 3,
						label: '6小时套餐',
						price: '180.0',
						hour: 6
					},
					{
						index: 4,
						label: '8小时套餐',
						price: '240.0',
						hour: 8
					},
				],
				// 小时模式
				hourList: [{
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
						index: 3,
						label: '4小时',
						hour: 4,
						price: '140.00'
					},
					{
						index: 4,
						label: '5小时',
						hour: 5,
						price: '175.00'
					},
					{
						index: 5,
						label: '6小时',
						hour: 6,
						price: '210.00'
					},
				],
				selectedIndex: 0,
				selectedDayIndex:0,
				timeArray: [ // 存放时间段的起始时间
					1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
					13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
					23, 24
				],
				today:"",
				tomoday:"",
				timeList:[],
				sortedTimeArray: [], // 排序后的时间数组
				currentTimeIndex: 0, // 当前时间在数组中的索引
				moreList: {},
				dateList: [[],[],[1]],
				minDate: '',
				maxDate: '',
				sevenDay: '',
				selectDate: '',
				currentSelectTime: '',
				NotFirst:false,
				storeName:'',
				storeRoomName:'',
				iconList:[],
				startTimeNum:1,
				price:0,
				repeatPrice:0,
				prePrice: 0,
				instr:"",
				storeId:0,
				storeRoomId:0,
				image:"",
				dayHourArr:[],
				timeList:[],
				currentTime:'',
				isRepeat:0,
				orderMoney:0,
				selectTimeText:'',
				selectAllBeginTime:'',
				selectAllEndTime:'',
				parentOrderId:0,
				storeRoomTimeSlotVoList: []
			}
		},
		onLoad(e){

			this.storeName = decodeURIComponent(e.storeName);
			this.storeRoomName = decodeURIComponent(e.storeRoomName);
			if(e.icons!==''||e.icons!== null){
				this.iconList = decodeURIComponent(e.icons).split(',');
			}
			this.startTimeNum = e.startTimeNum
			this.price = e.price
			this.storeId = e.storeId
			this.image = e.image
			this.storeRoomId = e.storeRoomId
			this.isRepeat = e.isRepeat
			this.repeatPrice = e.repeatPrice
			this.parentOrderId = e.parentOrderId

			geStoreDetail(this.storeId).then(res => {
				var storeInfor = res.data;
				this.instr = storeInfor.instr
			})
			
		},
		onShow() {
			
			console.log("onShow");
			// this.getSelectCity(); // 获取选择的城市的信息
			//this.getStoreList();
			this.getTodayAndTomoDay(0,1);
			this.getTimeListOrder(this.storeRoomId);
			// 根据门店的包间、台桌Id获取包间、台桌的时间段价格
			this.getStoreRoomTimeSlotList();
			// 获取包厢套餐模式设置列表
			this.storeRoomPackageList();
			// 获取该包厢小时模式设置列表
			this.storeRoomHourList();
			
		},		
		created() {

			
			this.currentTime = `${this.padZero(new Date().getHours())}:${this.padZero(new Date().getMinutes())}`;
			
			this.sortTimeArray(); // 初始排序
			//setInterval(() => {
			//	this.sortTimeArray(); // 定时排序
			//}, 1000 * 60); // 每分钟更新一次
			// 时间选择器
			const startDate = new Date();
			const endDate = new Date();
			endDate.setDate(endDate.getDate() + 6);
			this.generateDateList(startDate, endDate);
			this.currentSelectTime = new Date();

		},
		methods: {
			
			storeRoomPackageList() {
				
				let that = this;
				let data = {
					storeRoomId: this.storeRoomId
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
					}
					
				})	
			},
			storeRoomHourList() {
				
				let that = this;
				let data = {
					storeRoomId: this.storeRoomId
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
					}
						
				})	
				
			},
			getStoreRoomTimeSlotList() {

				let that = this;
				console.log("that.storeRoomId:" + that.storeRoomId);
				let data = {
					storeRoomId: that.storeRoomId
				};
				storeRoomTimeSlotList(data).then(res => {

					var mtStoreRoom = res.data;
					that.storeRoomTimeSlotVoList = mtStoreRoom.storeRoomTimeSlotList;
					that.price = mtStoreRoom.price;
					that.prePrice = mtStoreRoom.prePrice;
				})

			},
			// 跳转到门店商城
			goShop(url){
				
				console.log("this.storeId:" + this.storeId);
				console.log("this.storeRoomId:" + this.storeRoomId);
				url = url+'?teaId='+this.storeId+'&teaChildId='+this.storeRoomId;
				
				uni.navigateTo({
					url
				})
				
			},						
			// 跳转页面
			goPage(url) {
								
				console.log("this.orderMoney:"+this.orderMoney);
				console.log("selectAllBeginTime:"+this.selectAllBeginTime);
				console.log("selectAllEndTime:"+this.selectAllEndTime);
				console.log("tabsCurrent:"+this.tabsCurrent);
				
				var selectTimeText = this.selectAllBeginTime.substring(5,10)+" " +this.selectTime+"~"+this.endSpaceTime;
				var yeardate = 	this.selectAllBeginTime.substring(0,10);
				var monthDay = this.selectAllBeginTime.substring(5,10);
				var startTime = this.selectTime;
				var endDate = this.selectAllEndTime.substring(5,10);
				var endTime = this.endSpaceTime;
				var packMoney = 0;
				if(this.tabsCurrent == 0){
					packMoney = this.taocanList[this.selectedIndex].price;
				}
				console.log("packMoney:"+packMoney);
 			 	url = url+'?teaId='+this.storeId + '&teaChildId='+this.storeRoomId + '&storeRoomName='+this.storeRoomName +
					'&storeName='+this.storeName + '&image=' + this.image + '&orderMoney=' + this.orderMoney + '&selectTimeText=' + selectTimeText +
					'&price='+this.price +'&timeInterval='+this.spaceTime+'&repeatPrice='+this.repeatPrice +'&isRepeat='+this.isRepeat +
					'&yeardate='+yeardate+'&startTime='+startTime+'&endDate='+endDate+'&packMode='+this.tabsCurrent +'&packMoney='+packMoney+
					'&endTime='+endTime+'&monthDay='+monthDay+'&parentOrderId='+this.parentOrderId
								
 				uni.navigateTo({
					url
				})
				
			},
			getTodayAndTomoDay(todayAddNum,addNum){
				
				const startDate = new Date();
				const currentDate = new Date(startDate);
				const currentDate1 = new Date(startDate);
				
				currentDate.setDate(startDate.getDate() + todayAddNum);
				this.today = this.formatDate(currentDate);
				
				currentDate1.setDate(startDate.getDate() + addNum);				
				this.tomoday = this.formatDate(currentDate1);
				
				console.log("today:"+this.today);
				
				console.log("tomoday:"+this.tomoday);
				
			},
			
			getTimeListOrder(storeRoomId){
				let that = this;
				let data = {
					teaChildId: storeRoomId
				};
				getTimeListOrderV2(data).then(res => {
					that.dayHourArr = res.data;
					var tmpTimeList = [];
					for (let i = 0; i < that.sortedTimeArray.length; i++) {
						var isPre = 0;
						// 遍历今天的点
						if(i <= that.twenfourTimeIndex){
							// 遍历包间每天及存放的小时数
							for(let n=0;n < that.dayHourArr.length;n++){
								var dayHourList = that.dayHourArr[n].hourList;
								var orderDate = that.dayHourArr[n].orderDate;
								// 是今天存放的已预定的小时列表
								if(orderDate == that.today){
									// 遍历今天已预定的小时数
									for(let m=0;m<dayHourList.length;m++){
										var tmpHour = dayHourList[m];
										if(that.sortedTimeArray[i] == tmpHour){
											isPre = 1;
										}	
									}	
								}	
							}
						}
						
						if(i > that.twenfourTimeIndex){
							// 遍历包间每天及存放的小时数
							for(let n=0;n < that.dayHourArr.length;n++){
								var dayHourList = that.dayHourArr[n].hourList;
								var orderDate = that.dayHourArr[n].orderDate;
								if(orderDate == that.tomoday){
									// 遍历今天已预定的小时数
									for(let m=0;m<dayHourList.length;m++){
										var tmpHour = dayHourList[m];
										if(that.sortedTimeArray[i] == tmpHour){
											isPre = 1;
										}	
									}	
								}	
							}	
						}
						
						
						tmpTimeList.push({
							num: that.sortedTimeArray[i],     
							isPre:isPre                              
						})
							
							
					}
					
					that.timeList = tmpTimeList;
					
					this.getMaxSelectTime(that.dayHourArr);	
					
				})	
			},
			getMaxSelectTime(dayHourArr){
				
				let that = this;
				var currentHourMin = `${this.padZero(new Date().getMonth()+1)}-${this.padZero(new Date().getDate())} ${this.padZero(new Date().getHours())}:${this.padZero(new Date().getMinutes())}`;
				var isOrderFlag = 0; // 当前是否有预定的订单小时数
				for(let n=0;n < dayHourArr.length;n++) {
					var orderDate = dayHourArr[n].orderDate;
					var maxOrderHourMin = orderDate+' '+dayHourArr[n].maxOrderHourMin;
					if(orderDate == that.today){
						isOrderFlag = 1;
						// 比较两个时间/日期的大小
						let obj1 = new Date(currentHourMin) //当前时间
						let obj2 = new Date(maxOrderHourMin) 
						console.log("currentHourMin:"+currentHourMin)
						console.log("maxOrderHourMin:"+maxOrderHourMin)
						console.log("obj1.getTime():"+obj1.getTime())
						console.log("obj2.getTime():"+obj2.getTime())
						if (obj1.getTime() > obj2.getTime()) {
							
							console.log('最后预定时间已过')
							
							that.selectTime = `${that.padZero(new Date().getHours())}:${that.padZero(new Date().getMinutes())}`
							that.selectAllBeginTime = `${this.padZero(new Date().getFullYear())}-${this.padZero(new Date().getMonth()+1)}-${this.padZero(new Date().getDate())} ${this.padZero(new Date().getHours())}:${this.padZero(new Date().getMinutes())}`;
							
							that.endSpaceTime = `${that.padZero(new Date(new Date().getTime() + that.spaceTime*60*60*1000).getHours())}:${that.padZero(new Date().getMinutes())}`
							var addTime = new Date().getTime() + that.spaceTime*60*60*1000;
							that.selectAllEndTime = `${this.padZero(new Date(addTime).getFullYear())}-${this.padZero(new Date(addTime).getMonth()+1)}-${this.padZero(new Date(addTime).getDate())} ${this.padZero(new Date(addTime).getHours())}:${this.padZero(new Date().getMinutes())}`;
						} else {
	
							if(that.selectedDayIndex==0){
								
								for(let m=0;m < dayHourArr.length;m++) {
									var orderDate1 = dayHourArr[m].orderDate;
									var maxOrderHourMin1 = orderDate1+' '+dayHourArr[m].maxOrderHourMin;
									if(orderDate1 == that.tomoday){
										 obj2 = new Date(maxOrderHourMin1);
									}	
								}	
							}
							
							// 上一次预定时间后30分钟开始，中间预留30分钟保洁时间
							let addMaxOrderHourMin = obj2.getTime() +  30 * 60 * 1000;
							
							that.selectTime = `${that.padZero(new Date(addMaxOrderHourMin).getHours())}:${that.padZero(new Date(addMaxOrderHourMin).getMinutes())}`;
							that.selectAllBeginTime = `${this.padZero(new Date(addMaxOrderHourMin).getFullYear())}-${this.padZero(new Date(addMaxOrderHourMin).getMonth()+1)}-${this.padZero(new Date().getDate(addMaxOrderHourMin))} ${that.padZero(new Date(addMaxOrderHourMin).getHours())}:${that.padZero(new Date(addMaxOrderHourMin).getMinutes())}`;
							
							var addTime = addMaxOrderHourMin + that.spaceTime*60*60*1000;
							that.endSpaceTime = `${that.padZero(new Date(addTime).getHours())}:${that.padZero(new Date(addMaxOrderHourMin).getMinutes())}`
							that.selectAllEndTime = `${this.padZero(new Date(addTime).getFullYear())}-${this.padZero(new Date(addTime).getMonth()+1)}-${this.padZero(new Date(addTime).getDate())} ${this.padZero(new Date(addTime).getHours())}:${this.padZero(new Date(addMaxOrderHourMin).getMinutes())}`;
							console.log('最后预定时间比当前时间大')
							
							//that.enrollIsEnd = false
						}
					}	
				}
				
				// 表示选择的日期没订单小时数
				if(isOrderFlag == 0){
					// 是否是当日
					if(that.selectedDayIndex==0){
						
						that.selectTime = `${that.padZero(new Date().getHours())}:${that.padZero(new Date().getMinutes())}`
						that.selectAllBeginTime = `${this.padZero(new Date().getFullYear())}-${this.padZero(new Date().getMonth()+1)}-${this.padZero(new Date().getDate())} ${this.padZero(new Date().getHours())}:${this.padZero(new Date().getMinutes())}`;
							
						that.endSpaceTime = `${that.padZero(new Date(new Date().getTime() + that.spaceTime*60*60*1000).getHours())}:${that.padZero(new Date().getMinutes())}`
						var addTime = new Date().getTime() + that.spaceTime*60*60*1000;
						that.selectAllEndTime = `${this.padZero(new Date(addTime).getFullYear())}-${this.padZero(new Date(addTime).getMonth()+1)}-${this.padZero(new Date(addTime).getDate())} ${this.padZero(new Date(addTime).getHours())}:${this.padZero(new Date().getMinutes())}`;
						
					}else{
						
						that.selectTime = "00.00";
						
						let zeroTime = new Date(new Date().toLocaleDateString())
						
						that.selectAllBeginTime = `${this.padZero(new Date(zeroTime).getFullYear())}-${this.padZero(new Date(zeroTime).getMonth()+1)}-${this.padZero(new Date(zeroTime).getDate())} ${this.padZero(new Date(zeroTime).getHours())}:${this.padZero(new Date(zeroTime).getMinutes())}`;
						
						var addTime = zeroTime.getTime() + that.spaceTime*60*60*1000;
						that.endSpaceTime = `${that.padZero(new Date(addTime).getHours())}:${that.padZero(zeroTime.getMinutes())}`
						that.selectAllEndTime = `${this.padZero(new Date(addTime).getFullYear())}-${this.padZero(new Date(addTime).getMonth()+1)}-${this.padZero(new Date(addTime).getDate())} ${this.padZero(new Date(addTime).getHours())}:${this.padZero(new Date(zeroTime).getMinutes())}`;
					}
				}
					
					
					
			},						
			formatDate(date) {
				const month = date.getMonth() + 1;
				const day = date.getDate();
				return `${this.padZero(month)}-${this.padZero(day)}`;
			},
			padZero(value) {
				return value < 10 ? `0${value}` : value;
			},
			formatePrice(money){
				return parseInt(money)
			},
			moneyFilter (value) {
				// 截取当前数据到小数点后两位
				let realVal = parseFloat(value).toFixed(2)
				return realVal
			},
			// 接受子组件传递的时间值
			timeEmit(e){
				
				var n = e.NotFirst;
				this.NotFirst = n;
				this.selectedDayIndex = e.selectedIndex;
				console.log("selectedDayIndex:"+this.selectedDayIndex);
				var addDayNum = e.selectedIndex+1;
				this.getTodayAndTomoDay(e.selectedIndex,addDayNum);
				if(n){

					this.sortedTimeArray = [ // 存放时间段的起始时间
						0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
						13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
						23
					] // 归零
					// 如果是明天以后的日期选择标签不可能大于24
					this.twenfourTimeIndex = 24;  
				}else{
					this.sortTimeArray();
				}
				
				this.refreshTimeList(e.selectedIndex);
				
				if(this.tabsCurrent == 0) {
					this.spaceTime = 3
				} else {
					this.spaceTime = 2
				}
				this.handletaoCan(0,this.spaceTime);
				
			},
			// 刷新已预定的时间点
			refreshTimeList(selectedIndex){
				let that = this;
				var tmpTimeList = [];
				for (let i = 0; i < that.sortedTimeArray.length; i++) {
						var isPre = 0;
						// 遍历今天的点
						if(i <= that.twenfourTimeIndex){
							// 遍历包间每天及存放的小时数
							for(let n=0;n < that.dayHourArr.length;n++){
								var dayHourList = that.dayHourArr[n].hourList;
								var orderDate = that.dayHourArr[n].orderDate;
								// 是今天存放的已预定的小时列表
								if(orderDate == that.today){
									// 遍历今天已预定的小时数
									for(let m=0;m<dayHourList.length;m++){
										var tmpHour = dayHourList[m];
										if(that.sortedTimeArray[i] == tmpHour){
											isPre = 1;
										}	
									}	
								}	
							}
						}
						
						if(i > that.twenfourTimeIndex){
							// 遍历包间每天及存放的小时数
							for(let n=0;n < that.dayHourArr.length;n++){
								var dayHourList = that.dayHourArr[n].hourList;
								var orderDate = that.dayHourArr[n].orderDate;
								if(orderDate == that.tomoday){
									// 遍历今天已预定的小时数
									for(let m=0;m<dayHourList.length;m++){
										var tmpHour = dayHourList[m];
										if(that.sortedTimeArray[i] == tmpHour){
											isPre = 1;
										}	
									}	
								}	
							}	
						}
											
						tmpTimeList.push({
							num: that.sortedTimeArray[i],     
							isPre:isPre                              
						})	
				}
					
				that.timeList = tmpTimeList;
			},
						
			// 获取时间列表
			getTimeList(e) {
				console.log(111)
				console.log(e)
				const year = new Date().getFullYear()
				e.map(item => {
					const vitem = `${year}/${item.split('-')[0]}/${item.split('-')[0]}`
					this.moreList[0].push(vitem)
				})
				console.log(222);
				console.log(this.moreList);
			},
			generateDateList(startDate, endDate) {
				
				const dateList = [];
				const currentDate1 = new Date(startDate)
				currentDate1.setDate(startDate.getDate() + 6);
				// const month = this.
				const day1 = `${currentDate1.getFullYear()}-${currentDate1.getMonth()+1}-${currentDate1.getDate()}`
				this.sevenDay = day1
				for (let i = 0; i < 7; i++) {
					const currentDate = new Date(startDate);
					currentDate.setDate(startDate.getDate() + i);					
					const day = this.formatDate(currentDate);
					let info = this.getDateInfo(currentDate);
			
					dateList.push({
						day,
						info
					});
				}
			
				this.dateList = dateList;
				console.log(this.dateList)
				const year = new Date().getFullYear()
				this.moreList[0] = []
				this.dateList.map(item => {
					const vitem = `${year}-${item.day.split('-')[0]}-${item.day.split('-')[1]}`
					this.moreList[0].push(vitem)
				})
				console.log(222)
				console.log(this.moreList)
				this.minDate = new Date().getTime()
				this.maxDate = new Date(`${this.sevenDay} 22:15:00`).getTime()
				console.log(`${this.moreList[0][0]} 22:15:00`,`${this.sevenDay} 23:55:59`)
			},			
			formatDate(date) {
				const month = date.getMonth() + 1;
				const day = date.getDate();
				return `${this.padZero(month)}-${this.padZero(day)}`;
			},
			padZero(value) {
				return value < 10 ? `0${value}` : value;
			},
			getDateInfo(date) {
				const today = new Date();
				const isToday = date.toDateString() === today.toDateString();
			
				if (isToday) {
					return '今天';
				} else {
					const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
					const dayOfWeek = weekDays[date.getDay()];
					return `周${dayOfWeek}`;
				}
			},
			tabsClick(item) {
				console.log('item', item);
				this.tabsCurrent = item?.index
				this.motaocanText=this.selectModeDesc[this.tabsCurrent].name;
				// 切换前，不是选择第一项
				if(item.index == 0) {
					this.spaceTime = 3
				} else {
					this.spaceTime = 2
				}
				console.log("tabsClick-this.spaceTime:"+this.spaceTime);
				this.handletaoCan(0,this.spaceTime);

			},
			handletaoCan(taoCanIndex,space) {
				let that = this;
				this.selectedIndex = taoCanIndex;
				this.spaceTime = space;				
				var tmpPrice = that.price;
				if(this.isRepeat==1){
					tmpPrice = that.repeatPrice;
				}
				// var tmpTotalMoney
				// 选择小时模式
				if(that.tabsCurrent==1){
					
					that.orderMoney = that.hourList[that.selectedIndex].hour*tmpPrice;
					that.hourList[that.selectedIndex].price = that.orderMoney;
					
				} else if(that.tabsCurrent==0){
					
					that.orderMoney = that.taocanList[that.selectedIndex].price;
				}

				console.log("this.spaceTime:"+this.spaceTime);
				this.getMaxSelectTime(this.dayHourArr);

			},
			sortTimeArray() {
				
				console.log(this.currentTime.split(":")[0],new Date().getHours());
				
				const currentHour = parseInt(this.currentTime.split(":")[0]); // 获取当前小时数
				
				console.log(currentHour);
				this.currentTimeIndex = this.timeArray.indexOf(currentHour); // 获取当前时间在数组中的索引
				console.log(this.currentTimeIndex)
				if (this.currentTimeIndex === -1) {
					return; // 当前时间不在数组中，不需要排序
				}
				const newTimeArray = this.timeArray.slice(this.currentTimeIndex).concat(this.timeArray.slice(0, this
					.currentTimeIndex)); // 将早于当前时间的时间段移到数组末尾
				this.sortedTimeArray = newTimeArray; // 保存排序后的数组
				this.twenfourTimeIndex = this.sortedTimeArray.indexOf(24);
				console.log("twenfourTimeIndex:"+this.twenfourTimeIndex);
				
			},
			handelConfirm(date) {
				console.log(date)
				date = new Date(date.value)
				this.currentSelectTime = date
				this.selectTime = `${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}`
				this.endSpaceTime = `${this.padZero(new Date(date.getTime() + this.spaceTime*60*60*1000).getHours())}:${this.padZero(date.getMinutes())}`
				this.selectDate = `${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}`
				this.$emit('changeDate', this.selectDate)
				console.log(this.selectTime)
				this.show = false
			},
			handelClose() {
				this.show = false
			}
	
		},
		components: {
			modeDateSelect
		}
	}
</script>

<style>
	@import url(./room.css);

	/* 模式 */
	.mode {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 30upx;
		background-color: #fff;
	}

	/* 日期选择组件引入 */
	.modedateselect-mt {
		/* margin-bottom: 20upx; */
		padding-bottom: 20upx;
		background-color: #fff;
		border-bottom: 1px solid #f0f0f0;
	}

	/* 穿透tabs 文字 */
	.mode /deep/ .u-tabs__wrapper__nav__item__text {
		font-size: 30upx;
	}

	/* 套餐模式 */
	.motaocan {
		padding: 10upx;
		background-color: #fff;
	}
.motaocan-text {
			font-size: 35upx;
			color: #131214;
			font-weight: 700;
			margin-bottom: 20upx;
		}
	.motaocan-list {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.motaocan-list .hour-item{
		height: 60upx;
		border-radius: 10upx;
	}
	.motaocan-list-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 136upx;
		height: 120upx;
		margin-right: 20upx;
		font-size: 24upx;
		color: #666;
		background-color: #e6e6e6;
	}

	.selected {
		color: #FF5B27;
		border: 1upx solid #FF5B27;
		/* 选中时的边框颜色 */
		background-color: #fffffd;
		/* 选中时的背景颜色 */
	}
	/* 时间选择 */
	.date-select {
		background-color: #fff;
		padding-top: 10upx;

	}
	.date-select-text {
		font-size: 35upx;
		color: #131214;
		font-weight: 700;
		margin-bottom: 20upx;
		margin-left: 10upx;
	}
	.date-select-btn{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx;
		font-size: 26upx;
	}
	.btn-date{
		padding: 20upx;
		border: 1px solid #FF5B27;
		border-radius: 30upx;
		width: 180upx;
		height:30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
	}
	.btn-date .bg{
		background-color: #eeecea;
	}
	.btn-date.bg{
		background-color: #eeecea;
		border-color: #D4D3D2;
	}
	.bg text{
		width: 180upx;
		text-align: center;
	}
	.use{
		height: 200upx;
		margin: 30upx 0 30upx;
		padding-top: 20upx;
		padding-left: 10upx;
		background-color: #fff;
	}
	.use span{
		display: block;
		padding-left: 10upx;
		font-size: 34upx;
		line-height: 34upx;
		font-weight: 550;
		border-left: 3px solid #FB5A26;
	}
	.destined{
		position: fixed;
		bottom: 20upx;
		left: 0;
		height: 90upx;
		width: 100%;
		color: #fff;
		line-height: 90upx;
	}
	.destined .con{
		width: 90%;
		height: 100%;
		margin: 0 auto;
		display: flex;
		border-radius: 90upx;
		overflow: hidden;
	}
	.destined .left{
		width: 70%;
		background-color: #474747;
	}
	.destined .left span{
		color: #DC3D3D;
		padding-left: 20upx;
	}
	.destined .right{
		width: 30%;
		text-align: center;
		background: linear-gradient(to right, rgb(255, 158, 2), rgb(254, 95, 37));
	}
</style>