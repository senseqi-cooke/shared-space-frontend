<template>
	<view class="date-container">
		<view class="date-box" :class="dateInfo.selected ? 'selected': ''" v-for="(dateInfo, index) in dateList" :key="index" @click="selectDate(index)">
			<view class="date-number">{{ dateInfo.day }}</view>
			<view class="date-info">{{ dateInfo.info }}</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				dateList: [],
				selectedIndex: -1,
			};
		},
		props:[
			'selectDate1'
		],
		watch: {
		    selectDate1: function (newVal, oldVal) {
		      console.log('Props changed: ', String(newVal))
			  console.log(this.dateList,this.selectedIndex)
			  this.dateList.map((item,index)=>{
				  if(newVal == item.day){
					  console.log(item.day)
					  // this.selectedIndex = index
					  this.selectDate(index);
					  return
				  }
			  })	  
		    }
		},
		mounted() {
			// 自动计算一周的开始日期和结束日期
			const startDate = new Date();
			const endDate = new Date();
			endDate.setDate(endDate.getDate() + 6); // 结束日期比开始日期晚6天

			this.generateDateList(startDate, endDate);
			const today = new Date();
			const todayIndex = this.dateList.findIndex(
				(dateInfo) => dateInfo.day === this.formatDate(today)
			);

			if (todayIndex !== -1 && this.selectedIndex === -1) {
				this.selectDate(todayIndex);
			}
			this.$on('changeDate', (e) => {
				console.log(888)
			})
			// setTimeout(function() {
			// 	console.log(this.dataList)
			// 	this.$emit('sendTimeList',this.dataList)
			// },2000)
		},
			// created() {
			// 	console.log(this.dateList)
			// 	this.$emit('sendTimeList', this.dateList)
			// },
		methods: {
			generateDateList(startDate, endDate) {
				const dateList = [];

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
				// console.log(this.dateList)
				// this.$emit('sendTimeList', this.dateList)
				
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
			selectDate(index) {
				// 取消之前选中的项
				if (this.selectedIndex !== -1) {
					this.$set(this.dateList, this.selectedIndex, {
						...this.dateList[this.selectedIndex],
						selected: false,
					});
				}

				// 设置当前选中项
				this.$set(this.dateList, index, {
					...this.dateList[index],
					selected: true,
				});

				// 更新 selectedIndex
				this.selectedIndex = index;
				if(index != 0){
					//this.$emit('change-time',true)
					this.$emit('change-time', {
						NotFirst: true,
						selectedIndex: this.selectedIndex
					})

				}else{
					//this.$emit('change-time',false)
					this.$emit('change-time', {
						NotFirst: false,
						selectedIndex: this.selectedIndex
					})
				}
				console.log(this.dateList)
			},
			getDateBoxStyle(index) {
				console.log(this.dateList[index].selected)
				if (this.dateList[index].selected) {
					return {
						background: `linear-gradient(to right, #ff9e02, #fe5f25)`,
						color: '#FFFFFF',
					};
				} else {
					return {
						background: ` #fff`,
						color: '#A8A8A8',
					};
				}
			},
		},
	};
</script>

<style>
	.date-container {
		display: flex;
		justify-content: space-between;
		padding: 20upx 5upx;
		background-color: #fff;
		box-sizing: border-box;
		color: #A8A8A8;
		
	}

	.date-box {
		width: calc(100%/7);
		padding: 30upx 10upx;
		box-sizing: border-box;
		text-align: center;
		border-radius: 4upx;
		cursor: pointer;
		background-color: #fff;
		color: #A8A8A8;
	}

	.date-number {
		font-size: 25upx;
		margin-bottom: 30upx;
		box-sizing: border-box;
	}

	.date-info {
		margin-top: 4px;
		font-size: 12px;
	}
	.selected{
		background: linear-gradient(to right, #ff9e02, #fe5f25);
		color: #FFFFFF;
	}

</style>