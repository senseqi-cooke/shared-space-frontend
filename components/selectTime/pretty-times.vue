<template>
	<view class="content">
		<view class="container">
			
			<!-- 日期列表 -->
			<view class="scroll-view_H b-t b-b">
				<block v-for="(item,index) in dateArr" :key="index">
					<div class="flex-box" @click="selectDateEvent(index,item)"
						:class="{ borderb: index==dateActive,noBorderb: index != dateActive}">
						<view class="date-box" :style="{color:index==dateActive?selectedTabColor:'#666'}">
							<text>{{item.date}}</text>
							<text class="fontw">{{item.week}}</text>
						</view>
					</div>
				</block>
			</view>
						
			<view class="selectTimeContent" v-if="taocanList.length > 0">
				套餐模式	
			</view>
			
			<view class="selectTimeContent" v-if="taocanList.length > 0">
				<view class="two Hour" v-for="item,index in taocanList" :key="index" @click="selectHour(item.hour,1,item.index,item.price)" v-if="index <= 2">
					{{ item.label}}
					<view style="color: red;">￥{{ item.price}}</view>
				</view>
			</view>
			
			<view class="selectTimeContent" v-if="taocanList.length > 0">
				<view class="two Hour" v-for="item,index in taocanList" :key="index" @click="selectHour(item.hour,1,item.index,item.price)" v-if="index > 2">
					{{ item.label}}
					<view style="color: red;">￥{{ item.price}}</view>
				</view>
			</view>			

			<view class="selectTimeContent" v-if="taocanList.length > 0">
				小时模式
			</view>
					
			<view class="selectTimeContent" v-if="isOper==1">
								
				<view class="two Hour" v-for="item,index in hourList" :key="index" @click="selectHour(item.hour,0,0,0)" v-if="index <= 2">
					{{ item.label}}
				</view>	
<!-- 				<view class="two Hour" @click="selectHour(2)">
					2小时
				</view>
				<view class="four Hour" @click="selectHour(4)">
					4小时
				</view>
				<view class="six Hour" @click="selectHour(6)">
					6小时
				</view> -->
				
			</view>
			
			<view class="selectTimeContent" v-if="isOper==1">
				<view class="two Hour" v-for="item,index in hourList" :key="index" @click="selectHour(item.hour,0,0,0)" v-if="index > 2">
					{{ item.label}}
				</view>	
			</view>

			<!-- 时间选项 -->
			<view class="time-box" v-if="!isSection || isQuantum">
				<template v-for="(item,_index) in timeArr">
					<view class="item" :key="_index" v-if="!item.disable">
						
						<!-- 原版: <view class="item-box" :class="{'disable':item.disable,
						'active':isMultiple ? item.isActive : _index==timeActive}" :style="{color:isMultiple?item.isActive? selectedItemColor:'#333'
						 :_index==timeActive?selectedItemColor:'#333'}" @click="selectTimeEvent(_index,item)">
							<text v-if="isQuantum">{{item.begin}}~{{item.end}}</text>
							<text v-else>{{item.time}}</text>
							<text class="all">{{item.disable?disableText:undisableText}}</text>
						</view> -->

<!-- 						<view class="item-box"
							:class="[selectMinTime!=null&&selectMaxTime!=null ?( _index>=selectMinTime && _index<=selectMaxTime ? 'active' : '' ):selectTimeNum == _index ? 'active' : '',beginIndex!=null&&endIndex!=null&&item.dateState ? ( _index>=beginIndex && _index<=endIndex ? 'makeActive' : '' ) : '',beginIndex!=0&&endIndex!=0&&endIndex+sweepTime == _index ? 'sweepClass' : '']"
							@click="_index>=beginIndex && _index<=endIndex+1 && item.dateState ? '' : selectTimes(_index,item)"
							style="padding: 0;">
							
							<text v-if="isQuantum">{{item.begin}}~{{item.end}}</text>
							<text v-else>{{item.time}}</text>
							<text class="all"
								v-if="endIndex==0 || endIndex+sweepTime != _index">{{item.disable? disableText : (_index>=beginIndex && _index<=endIndex && item.dateState ? '已预定' : undisableText)}}</text>
							<text class="all"
								v-if="beginIndex!=0&&endIndex!=0&&endIndex+sweepTime == _index">预留打扫时间</text>
								
						</view> -->
						
						<view class="item-box"
							:class="[selectMinTime!=null&&selectMaxTime!=null&&item.isSub == 0 ?( _index>=selectMinTime && _index<=selectMaxTime ? 'active' : '' ):selectTimeNum == _index ? 'active' : '',item.isSub == 1 ? 'makeActive' : '',item.isSub == 2 ? 'sweepClass' : '']"
							@click="item.isSub == 1 || item.isSub == 2 ? '' : selectTimes(_index,item)"
							style="padding: 0;">
							
							<text v-if="isQuantum">
								
								<text v-if="item.nextDay == 1">
									次日 {{item.begin}}~{{item.end}}
								</text>
								
								<text v-if="item.nextDay == 0">
									{{item.begin}}~{{item.end}}
								</text>								
								
							</text>
							
							<text v-else>
								{{item.time}}
							</text>
							
							<text class="all"
								v-if="item.isSub == 0 || item.isSub == 1">
								
								{{item.disable? disableText : (item.isSub == 1 ? '已预定' : undisableText)}}
								
							</text>
							
							<text class="all" v-if="item.isSub == 2">
								预留打扫时间
							</text>
								
						</view>
						
					</view>
					
				</template>
				
			</view>
			
			<!-- 预约时间段 -->
			<view class="time-box" v-else>
				<template v-for="(item,_index) in timeArr">
					<view class="item" :key="_index" v-if="!item.disable">
						<view class="item-box" :class="{'disable':item.disable || item.isInclude,
						'active':item.time == timeQuanBegin || item.time == timeQuanEnd }"
							:style="{color:item.time == timeQuanBegin || item.time == timeQuanEnd? selectedItemColor:'#333'}"
							@click="handleSection(_index,item)">
							
							<text>{{item.time}}</text>
							
							<text class="all">{{item.disable?disableText:undisableText}}</text>
							
						</view>
					</view>
				</template>
			</view>
			
		</view>
		
		<view class="bottom" v-if="isOper==1">
			<!-- <view class="show-time" v-if="!isMultiple && !isSection && !isQuantum">
				预约时间：{{orderDateTime}}
			</view>
			<button form-type="submit" type="default" size="mini" class="submit-btn" @click="handleSubmit">
				确认预约
			</button> -->
			<view class="clear button" @click="select(false)">
				取消
			</view>

			<view class="isOk button" @click="select(true)">
				确认
				{{selectMaxTime - selectMinTime > 0 ? '('+timeInterval*(selectMaxTime - selectMinTime+1)+'小时)' : selectTimeNum!=null ? '('+(timeInterval)+'小时)' : ''}}
			</view>
			
		</view>
	</view>
</template>

<script>
	import {
		initData,
		initTime,
		timeStamp,
		currentTime,
		computeNextDate,
		initNextTime,
		formatTodayDate,
		computePreDate
	} from './utils/date.js'
	import Bus from '@/utils/Bus.js'
	export default {
		name: 'times',
		model: {
			prop: "showPop",
			event: "change"
		},
		props: {
			isQuantum: {
				type: Boolean,
				default: false
			},
			isMultiple: { //是否多选
				type: Boolean,
				default: false
			},
			isSection: { //预约时间段
				type: Boolean,
				default: false
			},
			disableText: { //禁用显示的文本
				type: String,
				default: "已约满"
			},
			undisableText: { //未禁用显示的文本
				type: String,
				default: "空闲"
			},
			timeInterval: { // 时间间隔，小时为单位
				type: Number,
				default: 1
			},
			selectedTabColor: { // 日期栏选中的颜色
				type: String,
				default: "#fff"
			},
			selectedItemColor: { // 时间选中的颜色
				type: String,
				default: "#FB4B5C"
			},
			beginTime: {
				type: String,
			},
			endTime: {
				type: String,
			},
			appointTime: { // 预约的时间
				type: Array,
				default () {
					return []
				}
			},
			isOper: { // 是否操作标识
				type: Number,
				default: 1
			},
			isShowConfirm: { // 是否显示确认按钮
				type: Number,
				default: 1
			},
			occupyTime: {}
/* 			 disableTimeSlot: { // 预约开始和结束时间，来禁用时间段
			 	type: Array,
			 	default () {
			 		return []
			 	}
			 }, */
		},
		watch: {
			appointTime: {
				handler(val) {
					console.log(val);
					if (val && val.length) {
						this.initOnload()
					}
				}
			}
		},
		data() {
			return {
				orderDateTime: '暂无选择', // 选中时间
				orderTimeArr: {}, //多选的时间
				dateArr: [], //日期数据
				timeArr: [], //时间数据
				nowDate: "", // 当前日期
				dateActive: 0, //选中的日期索引
				timeActive: 0, //选中的时间索引
				timeQuanBeginIndex: 0, //时间段开始的下标
				selectDate: "", //选择的日期
				timeQuanBegin: "", //时间段开始时间
				timeQuanEnd: "", //时间段结束时间
				selectTimeNum: null, // 单个选择的下标记
				selectMinTime: null, // 开始值
				selectMaxTime: null, // 结束值
				disableTimeSlot: [], // 日期时间段
				beginIndex: 0, // 预约时间开始的下标
				endIndex: 0, // 预约时间结束的下标
				sweepTime: 0, // 打扫所需的时间段
				// 套餐
				taocanList: [],
				// 小时模式
				hourList: [],
				isPackage: 0,
				packageId: 0,
				packagePrice: 0
			}
		},
		inject: ['subscribeObj'],
		computed: {
			subscribeObjs() {
				return this.subscribeObj.timeList
				//return this.subscribeObj()
			}
		},
		created(props) {
			this.selectDate = this.nowDate = currentTime().date
			this.initOnload()
		},
		methods: {
			
			// 选择时间
			selectHour(hour,isPackage,packageId,packagePrice) { 
				
				this.isPackage = isPackage;
				this.packageId = packageId;
				this.packagePrice  = packagePrice;
				
				this.selectMinTime = null
				this.selectMaxTime = null
				let minIndex = 0;
				let maxIndex = this.timeArr.length - 1;
								
				for (let a = 0; a <= maxIndex; a++) {
					 //console.log("this.timeArr[a]-begin-disable-isSub:"+this.timeArr[a].begin+"-"+this.timeArr[a].disable+"-"+this.timeArr[a].isSub); 
					// 表示当天没过期的时间点开始
					if (this.timeArr[a].disable == false) {
						 // 表示空闲的时间点开始
						 if (this.timeArr[a].isSub == 0){
							 minIndex = a;
							 break;
						 }	 
					}	 
				}
				
				var tmpMaxIndex = minIndex;
				for (var i = minIndex; i <= maxIndex; i++) {
					if (this.timeArr[i].isSub == 0){
						tmpMaxIndex++;
					}else{
						break;
					}	
				}
	
				if(hour > (tmpMaxIndex - minIndex) * this.timeInterval){
					
					this.setMinAndMaxIndex(tmpMaxIndex,hour);
					
				}else{
					
					let startTime = minIndex;
					let endTime = startTime + (hour / this.timeInterval) - 1;
					console.log("startTime:"+startTime);
					console.log("endTime:"+endTime);
					console.log("hour:"+hour);
					this.selectMinTime = startTime;
					this.selectMaxTime = endTime;
					//this.changeHour(startTime, endTime, hour);
				}	
				
				
/* 				if (hour > (maxIndex - minIndex) * this.timeInterval) {
					
					uni.showToast({
						title: "今日时间不足",
						icon: "none"
					})
					
				} else {
					
					let startTime = minIndex;
					let endTime = startTime + (hour / this.timeInterval) - 1;
					console.log("startTime:"+startTime);
					console.log("endTime:"+endTime);
					console.log("hour:"+hour);
					this.changeHour(startTime, endTime, hour);
				} */
				
			},
			setMinAndMaxIndex(startNextIndex,hour){
				
				var maxIndex = this.timeArr.length - 1;
				console.log("startNextIndex:"+startNextIndex);
				console.log("maxIndex:"+maxIndex);	
					
				var tmpMinIndex = 0;
				var tmpMaxIndex = 0;
					
				// 找到下一个isSub == 0最小值与最大值
				for(var j=startNextIndex;j<=maxIndex;j++){
					// 下一个空闲的时间点开始
					if (this.timeArr[j].isSub == 0){
						tmpMinIndex = j;
						break;
					}
				}
					
				tmpMaxIndex = tmpMinIndex;
				for (var i = tmpMinIndex; i <= maxIndex; i++) {
					if (this.timeArr[i].isSub == 0){
						tmpMaxIndex++;
					}else{
						break;
					}	
				}
					
				if(hour > (tmpMaxIndex - tmpMinIndex) * this.timeInterval){
						
						if (hour > (maxIndex - tmpMaxIndex) * this.timeInterval) {
							
							uni.showToast({
								title: "今日时间不足",
								icon: "none"
							})
							
						}else{
							this.setMinAndMaxIndex(tmpMaxIndex,hour);
						}	
				}else{
						
					let startTime = tmpMinIndex;
					let endTime = startTime + (hour / this.timeInterval) - 1;
					console.log("startTime:"+startTime);
					console.log("endTime:"+endTime);
					console.log("hour:"+hour);
					this.selectMinTime = startTime;
					this.selectMaxTime = endTime;
					//this.changeHour(startTime, endTime, hour);
				}	

			},
			
			// 选择时间段
			changeHour(minIndex, maxIndex, hour) { 
				
				if (maxIndex >= this.timeArr.length) {
					
					maxIndex = this.timeArr.length - 1;
					
				}
				// console.log("changeHour-minIndex:"+minIndex);
				// console.log("changeHour-maxIndex:"+maxIndex);
				// console.log("hour:"+hour);
				let lock = true; // 当前时间段是否通过
				for (let a = minIndex; a <= maxIndex; a++) {
					//if (a >= this.beginIndex && a <= (this.endIndex + this.sweepTime)) {
						if(!this.isLock(a)){
							lock = false
							break;
						}
					//}
				}
				
				if (lock) {
					
					if(minIndex==1){
						if(this.timeArr[0].isSub==0){
							minIndex = 0;
							maxIndex = maxIndex-1;
						}
					}
					this.selectMinTime = minIndex;
					this.selectMaxTime = maxIndex;
					console.log("this.selectMinTime:"+this.selectMinTime);
					console.log("this.selectMaxTime:"+this.selectMaxTime);
					
				} else {
					
					minIndex = this.endIndex + this.sweepTime + 1
					maxIndex = minIndex + (hour / this.timeInterval) - 1
					this.changeHour(minIndex, maxIndex, hour)
				}
				
			},
			
			isLock(a){
				
				let that = this;
				var lockFlag = true;
				// 是否在被预约的时间段中
				this.subscribeObjs.forEach(sub => {
					
					that.beginIndex = 0    // 预约时间开始的下标
					that.endIndex = 0     // 预约时间结束的下标
					that.sweepTime = 0   // 打扫所需的时间段
					
					// 不是跨天订单：开始时间是当前选择的日期，结束时间也是当前选择的日期				
					if (sub.date == this.dateArr[this.dateActive].date 
						&& sub.endDate == this.dateArr[this.dateActive].date) {
							
						this.timeArr.forEach((item, index) => {	
							
							// 表示当日的才设置预定标识
							if(item.nextDay == 0){								
								item.dateState = true
								that.sweepTime = sub.sweep								
								if (item.dateState) {
									if (sub.selectBeginTime == item.begin) {
										that.beginIndex = index
									}
									if (sub.selectEndTime == item.end) {
										that.endIndex = index
									}
									// return false
								}
							}
						})

						// 表示当日的才设置预定标识
/* 						if (a >= that.beginIndex && a <= (that.endIndex + that.sweepTime)) {
							lockFlag = false;
						} */						
						
/* 						
						// 不是跨天订单
						if(sub.date == sub.endDate){
							// 表示当日的才设置预定标识
							if (a >= that.beginIndex && a <= (that.endIndex + that.sweepTime)) {
								lockFlag = false;
							}
						}
							
						// 如果是跨天订单
						if(sub.date != sub.endDate){
							
							if (a >= that.beginIndex && a <= (48 + that.sweepTime)) {
								lockFlag = false;
							}
						} */	

					}
					
					var selNextDate = computeNextDate(this.dateArr[this.dateActive].date);
					
					// 跨天订单：开始时间是选择的日期，结束时间是选择日期的后一天
					if (sub.date == this.dateArr[this.dateActive].date
						&& sub.endDate == selNextDate) {
						
						this.timeArr.forEach((item, index) => {							
							// 开始时间 nextDay == 0，表示选择日期时间点
							if(item.nextDay == 0){								
								item.dateState = true								
								if (item.dateState) {
									if (sub.selectBeginTime == item.begin) {
										that.beginIndex = index
									}
								}
							}
							
							// 结束时间 nextDay == 1，表示选择日期后一天的时间点
							if(item.nextDay == 1){
								item.dateState = true
								that.sweepTime = sub.sweep								
								if (item.dateState) {
									if (sub.selectEndTime == item.end) {
										that.endIndex = index
									}
								}								
							}
							
						})
						
/* 						if (a >= that.beginIndex && a <= (that.endIndex + that.sweepTime)) {
							lockFlag = false;
						} */	
						
							
					}		
					
					// 跨天订单：开始时间是选择日期的前一天，结束时间是当前选择的日期
					// 开始时间 = 选择日期减一日（开始时间是选择日期的前一天）
					var preMonthDayDate = computePreDate(this.dateArr[this.dateActive].date);					
					if (sub.date == preMonthDayDate
						&& sub.endDate == this.dateArr[this.dateActive].date) {
						
						var tmpBeginTime = "00:00";
						that.beginIndex = 0;
						this.timeArr.forEach((item, index) => {
							if(item.nextDay == 0){
								item.dateState = true
								that.sweepTime = sub.sweep								
								if (item.dateState) {
									if (sub.selectEndTime == item.begin) {
										that.endIndex = index
									}
								}
							}
						})								
					}		
					
					//console.log("sub.endDate:"+sub.endDate);
					
					
					
					//console.log("this.dateArr[this.dateActive].date:"+selNextDate);
					
/* 					// 次日有没有被预约
					if (sub.endDate == selNextDate) {
						
						console.log("sub:"+JSON.stringify(sub));
						//console.log("endDate:"+sub.endDate);						
						//sub.selectBeginTime = "00:00";
						var tmpNextBeginTime = sub.selectBeginTime;
						var firstBeginIndex = 0;
						var firstEndIndex = 0;						
						this.timeArr.forEach((item, index) => {							
							//console.log("item, index:"+index+"-"+JSON.stringify(item));
							// 表示当日的才设置预定标识
							if(item.nextDay == 1){
								
								item.dateState = true
								that.sweepTime = sub.sweep
								if (item.dateState) {
									
									if (tmpNextBeginTime == item.begin) {
										if(firstBeginIndex ==0){
											that.beginIndex = index
											firstBeginIndex = 1;
										}
									}
									
									if (sub.selectEndTime == item.end) {
										if(firstEndIndex ==0){
											that.endIndex = index
											firstEndIndex = 1;
										}	
									}
								}	
							}	
						})
					} */
					
					// 表示当日的才设置预定标识
					if (a >= that.beginIndex && a <= (that.endIndex + that.sweepTime)) {
						lockFlag = false;
					}	
						
				})
				
				
				return lockFlag;
			},
			
			select(state) {
				
				let data = {
					timeInterval: null,
					deta: this.dateArr[this.dateActive],
					startTime: null,
					endTime: null,
					isPackage: this.isPackage,
					packageId: this.packageId,
					packagePrice: this.packagePrice
				}
				
				if (state && this.selectMaxTime - this.selectMinTime > 0 || this.selectTimeNum != null) {
					
					if (this.selectTimeNum != null) {
						
						data.timeInterval = this.timeInterval
						data.startTime = this.timeArr[this.selectTimeNum]
						data.endTime = this.timeArr[this.selectTimeNum]
						
					}
					
					if (this.selectMinTime != null && this.selectMaxTime != null) {
						
						data.timeInterval = this.timeInterval * (this.selectMaxTime - this.selectMinTime + 1)
						data.startTime = this.timeArr[this.selectMinTime]
						data.endTime = this.timeArr[this.selectMaxTime]
						
					}
					
					Bus.$emit('isTime', data)
					
				} else {
					
					uni.showToast({
						title: "请确认是否选择了时间段",
						icon: "none"
					})
					
				}
				
				Bus.$emit('isShow', false)
				
			},
			
			initOnload() {
				
				console.log("initOnload:"+this.selectDate);
				this.dateArr = initData(); // 日期栏初始化
				this.timeArr = initTime(this.selectDate,this.beginTime, this.endTime, this.timeInterval, this.isQuantum); // 时间选项初始化
				var selNextDate = computeNextDate(this.selectDate);
				// 00:00~08:30
				var nextTimeArr = initNextTime(selNextDate,"00:00", "08:30", this.timeInterval, this.isQuantum);
				
				// 今天的时间点与明天的00:00~08:30时间点合并
				this.timeArr = this.timeArr.concat(nextTimeArr);
				
				// console.log("timeArr_initTime:"+this.timeArr);
				this.timeQuanBegin = ""
				this.timeQuanEnd = ""
				this.beginIndex = 0    // 预约时间开始的下标
				this.endIndex = 0     // 预约时间结束的下标
				this.sweepTime = 0   // 打扫所需的时间段
				let that = this
				let isFullTime = true
/* 				this.disableTimeSlot.push({
					begin_time: "18:00:00",
					end_time: "21:00:00"
				}) */
				
				// 被预约的时间段的操作
				this.subscribeObjs.forEach(sub => {
					
					//console.log("sub.selectBeginTime:" + sub.selectBeginTime);
					//console.log("sub.selectEndTime:" + sub.selectEndTime);
					
					that.beginIndex = 0;    // 预约时间开始的下标
					that.endIndex = 0;     // 预约时间结束的下标
					that.sweepTime = 0;   // 打扫所需的时间段
					
					var todayBeginIndex = 0;
					var todayEndIndex = 0;
					var todaySweepTime = 0;
					
					// 当天预定的订单
					if (sub.date == this.dateArr[this.dateActive].date) {
						
						console.log("sub:"+JSON.stringify(sub));
						
						this.timeArr.forEach((item, index) => {
							// 表示当日的才设置预定标识
							if(item.nextDay == 0){
								item.dateState = true
								that.sweepTime = sub.sweep
								if (item.dateState) {
									
									if (sub.selectBeginTime == item.begin) {
										that.beginIndex = index
									}
									
									if (sub.selectEndTime == item.end) {
										that.endIndex = index
									}
									//return false
								}
							}

						})
						
						//console.log("that.beginIndex:" + that.beginIndex);
						//console.log("that.endIndex:" + that.endIndex);
						// 如果是跨天订单，则当天的时间要设置为已预定
						//if(sub.date != sub.endDate){
						//	that.endIndex = 48
						//}
												
						this.timeArr.forEach((item, index) => {
							//if(that.beginIndex!=0&&that.endIndex!=0){
							// 表示当日的才设置预定标识	
							if(item.nextDay == 0){
								
								// 不是跨天订单
								if(sub.date == sub.endDate){
									//if(that.endIndex!=0){
										//console.log("timeArr_item_" +"index:"+ index+"item_begin:"+item.begin+"item_end:"+item.end);									
										// 表示当前遍历item,在已预定的时间区间内
										if(index>=that.beginIndex && index<=that.endIndex){
											item.isSub=1;
										}
										
										if(that.sweepTime==1){
											// 表示当前遍历item-index 等于已预定的区间结束+加打扫时间index,则设置打扫状态
											if(that.endIndex+that.sweepTime == index){
												item.isSub=2;
											}
										}	

									//}
								}
								
								// 如果是跨天订单
 	 							if(sub.date != sub.endDate){
									
									if(index>=that.beginIndex && index<=48){
										item.isSub=1;
									}
									
									if(that.sweepTime==1){
										
										if(48+that.sweepTime == index){
											item.isSub=2;
										}
									}
									
								} 	 
							}
								
							// 如果不是跨天订单，刚刚好到23:00~00:00,不是续单的情况下，
							// 则设置次日的00:00~00:30设置预留打扫时间
							console.log("刚刚好到23:30~00:00 that.endIndex:"+that.endIndex)
							if(item.nextDay == 1){
								if(that.endIndex==47 && that.sweepTime==1){
									if(index==48){
										item.isSub=2;
									}	
								}	
							}
								
						})
											
					}
				
					var selNextDate = computeNextDate(this.dateArr[this.dateActive].date);
					
					// 次日有没有被预约
					if (sub.endDate == selNextDate) {	
						//console.log("sub:"+JSON.stringify(sub));
						//console.log("endDate:"+sub.endDate);						
						//sub.selectBeginTime = "00:00";
						// var tmpNextBeginTime = "00:00";
						var tmpNextBeginTime = sub.selectBeginTime;
						var firstBeginIndex = 0;
						var firstEndIndex = 0;
						this.timeArr.forEach((item, index) => {
							
							//console.log("item, index:"+index+"-"+JSON.stringify(item));
							if(item.nextDay == 1){
								
								item.dateState = true
								that.sweepTime = sub.sweep
								
								if (item.dateState) {
									
									if (tmpNextBeginTime == item.begin) {
										if(firstBeginIndex ==0){
											that.beginIndex = index
											firstBeginIndex = 1;
										}
									}
									
									if (sub.selectEndTime == item.end) {
										if(firstEndIndex ==0){
											that.endIndex = index
											firstEndIndex = 1;
										}	
									}
									//return false
								}
							}
								

						})
						
						//console.log("that.beginIndex:"+that.beginIndex);
						//console.log("that.endIndex:"+that.endIndex);
												
						this.timeArr.forEach((item, index) => {
							//if(that.beginIndex!=0&&that.endIndex!=0){								
							if(item.nextDay == 1){
								
								if(that.endIndex!=0){
									
									//console.log("timeArr_item_" +"index:"+ index+"item_begin:"+item.begin+"item_end:"+item.end);						
									if(index>=that.beginIndex && index<=that.endIndex){
										item.isSub=1;
									}
									
									if(that.sweepTime==1){
										
										if(that.endIndex+that.sweepTime == index){
											item.isSub=2;
										}
									}									
								}								
							}
						})						
					}
					
					
					// 主要是点下个日期时，处理有隔天订单情况
					var todayMonthDayDate = formatTodayDate();
					// 开始时间 = 选择日期减一日
					var preMonthDayDate = computePreDate(this.dateArr[this.dateActive].date);
					
					// 选择不是当天的日期，判断前一日订单是否刚刚好到23:30~00:00
					// 如果不是跨天订单，,不是续单的情况下，
					// 则设置次日的00:00~00:30设置预留打扫时间
					// console.log("刚刚好到23:30~00:00 that.endIndex:"+that.endIndex)
					if(sub.endDate == preMonthDayDate){
						
					   // console.log("sub.endDate == preMonthDayDate-sub.selectEndTime:"+sub.selectEndTime);
					   if(sub.selectEndTime =="00:00"){
						   
						  // console.log("sub.endDate == preMonthDayDate-sub.selectEndTime:"+sub.selectEndTime);
						  
						   this.timeArr.forEach((item, index) => {
							   
							   if(index == 0 && sub.sweep==1){
								   // console.log("sub.endDate == preMonthDayDate-index:"+index);
								   item.isSub=2;
							   }
						   })   
					   }
					}
					

					
					// 切换下一天有没有被预约,但不是当天的，这样不会冲突
					if (sub.endDate == this.dateArr[this.dateActive].date
						&& sub.date == preMonthDayDate) {
							
						// && sub.endDate != todayMonthDayDate	
						//console.log("preMonthDayDate:"+preMonthDayDate);
						
						//console.log("sub:"+JSON.stringify(sub));
						
						// console.log("endDate:"+sub.endDate);						
						// sub.selectBeginTime = "00:00";
						var tmpBeginTime = "00:00";
						var firstBeginIndex = 0;
						var firstEndIndex = 0;
						console.log("切换下一天有没有被预约");
						console.log("sub.selectEndTime:"+sub.selectEndTime);
						this.timeArr.forEach((item, index) => {							
							//console.log("item, index:"+index+"-"+JSON.stringify(item));
							if(item.nextDay == 0){								
								item.dateState = true;
								that.sweepTime = sub.sweep;								
								if (item.dateState) {
									
									if (tmpBeginTime == item.begin) {
										if(firstBeginIndex ==0){
											that.beginIndex = index;
											firstBeginIndex = 1;
										}
									}
									
									//console.log("item.end:"+item.end);
									if (sub.selectEndTime == item.end) {
										if(firstEndIndex ==0){
											that.endIndex = index;
											firstEndIndex = 1;
										}	
									}
									//return false
								}
							}								
						})
						
						
						 console.log("that.beginIndex:"+that.beginIndex);
						 console.log("that.endIndex:"+that.endIndex);
						//that.endIndex = 1;												
						this.timeArr.forEach((item, index) => {
							//if(that.beginIndex!=0&&that.endIndex!=0){
								
							

							//console.log("item.nextDay："+item.nextDay);
								
							if(item.nextDay == 0){								
								//if(that.endIndex!=0){
									
									//console.log("timeArr_item_" +"index:"+ index+"item_begin:"+item.begin+"item_end:"+item.end);						
	 								
									if(index>=that.beginIndex && index<=that.endIndex){
										item.isSub=1;
									}
									
									if(that.sweepTime==1){
										
										if(that.endIndex+that.sweepTime == index){
											item.isSub=2;
										}
										
									}
																		
								//}								
							}	
						})
						
												
					}					
				
				})
				
				// 设置当天过期的时间不显示
				this.timeArr.forEach((item, index) => {
					
					for (let time of this.disableTimeSlot) {
						
						//const [begin_time = "", end_time = ""] = time
						let begin_time = time.begin_time;
						let end_time = time.end_time;
						begin_time = `${this.selectDate} ${begin_time}`
						end_time = `${this.selectDate} ${end_time}`
						console.log("begin_time:" + begin_time);
						console.log("end_time:" + end_time);
						
						if (begin_time && end_time && (begin_time <= cur_be_time && cur_end_time <= end_time)) {
							item.disable = true
						}
						
					}
					
					if(item.nextDay == 0){
						
						if (this.selectDate == this.nowDate && currentTime().time > `${item.begin}:00`) {
								
							item.disable = true
						}
					}
					
			})	
	
/* 				this.timeArr.forEach((item, index) => {
					
					// 时间段
					if (this.isQuantum) { */
						//const cur_be_time = `${this.selectDate} ${item.begin}:00`
						//const cur_end_time = `${this.selectDate} ${item.end}:00`
/* 						const cur_be_time = `${this.selectDate} ${item.begin}`
						const cur_end_time = `${this.selectDate} ${item.end}`	 */					
						//console.log("cur_be_time:" + cur_be_time);
						//console.log("cur_end_time:" + cur_end_time);
/* 						for (let time of this.disableTimeSlot) {
	 						//const [begin_time = "", end_time = ""] = time
							let begin_time = time.begin_time;
							let end_time = time.end_time;
							begin_time = `${this.selectDate} ${begin_time}`
							end_time = `${this.selectDate} ${end_time}`
							console.log("begin_time:" + begin_time);
							console.log("end_time:" + end_time);
							if (begin_time && end_time && (begin_time <= cur_be_time && cur_end_time <=
									end_time)) {
								item.disable = true
							}
						}
 						if (this.selectDate == this.nowDate && currentTime().time > `${item.begin}:00`) {
							item.disable = true
						} */
						//const cur_be_time1 = `${item.begin}:00`
						//const cur_end_time1 = `${item.end}:00`
						// 被预约的时间段的操作
/* 						this.subscribeObjs.forEach(sub => {
							//console.log("sub.selectBeginTime:" + sub.selectBeginTime);
							//console.log("sub.selectEndTime:" + sub.selectEndTime);
							if (sub.date == this.dateArr[this.dateActive].date) {
								item.dateState = true
								that.sweepTime = sub.sweep
								if (item.dateState) {
									if (sub.selectBeginTime == item.begin) {
										that.beginIndex = index
									}
									if (sub.selectEndTime == item.end) {
										that.endIndex = index
									}
									return false
								}
							}
						}) */
						

/* 					} else {
						//判断是当前这一天，选中时间小于当前时间则禁用

						if (this.selectDate == this.nowDate && currentTime().time > item.time) {
							item.disable = true
						}
						// 被预约的时间段的操作
						this.subscribeObjs.forEach(sub => {
							console.log("subscribeObjs_item.time:" + item.time);
							if (sub.date == this.dateArr[this.dateActive].date) {
								item.dateState = true
								that.sweepTime = sub.sweep
								if (item.dateState) {
									if (sub.selectBeginTime == item.time) {
										that.beginIndex = index
									}
									if (sub.selectEndTime == item.time) {
										that.endIndex = index
									}
									return false
								}
							}
						})

						// 将预约的时间禁用
						this.appointTime.forEach(t => {
							let [date, time] = t.split(' ')
							if (date == this.selectDate && item.time == time) {
								item.disable = true
							}
						})

						// 禁用时间段 
						const cur_time = `${this.selectDate} ${item.time}`

						for (let time of this.disableTimeSlot) {
							const [begin_time = "", end_time = ""] = time
							if (begin_time && end_time && (begin_time <= cur_time && cur_time <= end_time)) {
								item.disable = true
							}
						}

						// 判断是否当前日期时间都被预约
						if (!item.disable) {
							isFullTime = false
						}
						this.isSection && (item.isInclude = false)

						// 对多选操作的已选时间的回显
						if (this.isMultiple && (this.orderTimeArr[this.selectDate] || []).includes(item.time)) {
							item.isActive = true
						}
					}
				}) */
				
 				this.orderDateTime = isFullTime ? "暂无选择" : this.selectDate
				this.timeActive = -1
				for (let i = 0, len = this.timeArr.length; i < len; i++) {
					if (!this.timeArr[i].disable) {
						this.orderDateTime = `${this.selectDate} ${this.timeArr[i].time}`
						this.timeActive = i
						return
					}
				}
				
				 
			},

			// 日期选择事件
			selectDateEvent(index, item) {
				this.selectMinTime = null // 开始值
				this.selectMaxTime = null // 结束值
				this.selectTimeNum = null // 单个选择的下标记
				this.beginIndex = 0       // 预约时间开始的下标
				this.endIndex = 0         // 预约时间结束的下标
				this.dateActive = index
				this.selectDate = item.date
				this.initOnload()
			},

			// 时间段的时间选择器
			selectTimes(index, item) {
				
				// console.log("selectTimes_index:"+index);
				
				if (this.selectTimeNum != null) {
					
					if (this.selectMinTime == null && this.selectMaxTime == null) {
						if (index == this.selectTimeNum) {
							this.selectTimeNum = null
							return false
						}
						if (index < this.selectTimeNum) {
							this.selectMinTime = index
							this.selectMaxTime = this.selectTimeNum
						} else {
							this.selectMinTime = this.selectTimeNum
							this.selectMaxTime = index
						}
					} else {
						if (index == this.selectMinTime - 1) {
							this.selectMinTime = this.selectMinTime - 1
							return false
						}
						if (index == this.selectMinTime) {
							this.selectMinTime = this.selectMinTime + 1
							return false
						}
						if (index == this.selectMaxTime + 1) {
							this.selectMaxTime = this.selectMaxTime + 1
							return false
						}

						this.selectTimeNum = index
						this.selectMinTime = null
						this.selectMaxTime = null
					}
					
				} else {

					this.selectTimeNum = index
				}

			},

			// 时间选择事件
			selectTimeEvent(index, item) {
				if (this.isQuantum) {
					return this.handleSelectQuantum(index, item)
				}
				if (item.disable) return
				if (this.isMultiple) {
					item.isActive = !item.isActive
					this.timeArr = this.timeArr.slice()
					this.orderTimeArr[this.selectDate] = this.timeArr.reduce((prev, cur) => {
						cur.isActive && prev.push(cur.time)
						return prev
					}, [])
				} else {
					this.timeActive = index
					this.orderDateTime = `${this.selectDate} ${item.time}`
				}
			},

			// 选择时间段
			handleSection(index, item) {
				
				if (item.disable) return

				function clearTime() {
					this.timeQuanBeginIndex = index
					this.timeQuanBegin = item.time
					this.timeQuanEnd = ""
				}

				if (!this.timeQuanBegin) {
					clearTime.call(this)
					return
				}
				if (!this.timeQuanEnd && this.timeQuanBegin) {
					let isDisble = false
					let start = this.timeQuanBeginIndex
					let end = index
					start > end && ([start, end] = [end, start])
					for (let i = start + 1; i < end; i++) {
						if (this.timeArr[i].disable) {
							isDisble = true
							clearTime.call(this)
							return
						}
					}
					if (!isDisble) {
						for (let i = start + 1; i < end; i++) {
							this.timeArr[i].isInclude = true
						}
					}
					this.timeQuanEnd = item.time
					return
				}

				if (this.timeQuanBegin && this.timeQuanEnd) {
					this.timeArr.forEach(t => {
						t.isInclude = false
					})
					clearTime.call(this)
				}
				

			},
			handleSelectQuantum(index, item) {
				if (item.disable) return
				if (this.isMultiple) {
					item.isActive = !item.isActive
					this.timeArr = this.timeArr.slice()
					this.orderTimeArr[this.selectDate] = this.timeArr.reduce((prev, cur) => {
						const cur_be_time = `${this.selectDate} ${cur.begin}:00`
						const cur_end_time = `${this.selectDate} ${cur.end}:00`
						cur.isActive && prev.push([cur_be_time, cur_end_time])
						return prev
					}, [])
				} else {
					this.timeActive = index
					this.orderDateTime = {
						begin: `${this.selectDate} ${item.begin}:00`,
						end: `${this.selectDate} ${item.end}:00`,
					}
				}

			},
			handleChange() {
				this.timeQuanBegin > this.timeQuanEnd && ([this.timeQuanBegin, this.timeQuanEnd] = [this.timeQuanEnd, this
					.timeQuanBegin
				])
			},
			handleSubmit() {
				if (this.isSection) {
					this.handleChange()
					this.$emit('change', {
						beginTime: `${this.selectDate} ${this.timeQuanBegin}`,
						endTime: `${this.selectDate} ${this.timeQuanEnd}`
					})
					return
				}

				if (this.isMultiple) {
					let time = []
					for (let date in this.orderTimeArr) {
						this.orderTimeArr[date].forEach(item => {
							this.isQuantum ? time.push(item) : time.push(`${date} ${item}`)
						})
					}
					this.$emit('change', time)
				} else {
					this.$emit('change', this.orderDateTime)
				}

			}
		}
	}
</script>
<style lang="scss" scoped>
	@import './pretty-times.scss';

	page {
		height: 100%;
		
		.time-box{
			height: 450rpx;
			overflow: scroll;
		}

		.selectTimeContent {
			display: flex;
			width: 100%;
			padding: 15rpx 23rpx 0rpx;
			justify-content: space-between;

			.Hour {
				width: 28%;
				height: auto;
				padding: 10rpx 0;
				border: 1rpx solid #8bccc4;
				border-radius: 15rpx;
				font-size: 24rpx;
				color: #999;
				text-align: center;
			}
		}
	}

	.makeActive,
	.sweepClass {
		background: #d7d7d7 !important;
		color: #858585 !important;
	}

	.content {
		text-align: center;
		height: 100%;

		.container {
			margin-bottom: 20rpx;
		}
	}

	/* 两个按钮 */
	.bottom {
		display: flex;
		flex-direction: row;
		position: fixed;
		bottom: 8px;
		top: auto;
		left: 0px;
		width: 100%;
		background-color: #fff;
		justify-content: space-around;

		.button {
			width: 40%;
			height: auto;
			padding: 15rpx 0;
			border-radius: 50rpx;
		}

		.clear {
			border: 1rpx solid #979797;
			background: #fff;
			color: #979797;
		}

		.isOk {
			color: #fff;
			background: linear-gradient(to right, #f082e8, #b3835b);
			box-shadow: 0 0 15rpx 0 rgba(0, 0, 0, .3);
		}
	}

	.show-time {
		width: 70%;
		height: 47px;
		color: #505050;
		background-color: rgba(255, 255, 255, 1);
		font-size: 15px;
		line-height: 47px;
		text-align: center;
	}

	.submit-btn {
		width: 25%;
		height: 40px;
		color: white;
		background-color: #CA89FF;
		font-size: 15px;
		line-height: 40px;
		text-align: center;
		margin: auto;
		padding: 0;
	}

	.fontw {
		// font-weight: bold;
		font-size: 26rpx;
	}

	.borderb {
		// border-bottom: 2px solid #FB4B5C;
		background: #b154aa;

	}

	.noBorderb {
		background: #f2f3f7;
	}
</style>
