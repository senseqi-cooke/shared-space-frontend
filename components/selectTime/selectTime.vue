<template>
	<view>
		<!-- 预约时间段的写法 -->
		<times @change="getTime" :isMultiple="true" :timeInterval=".5" :isQuantum="true" :beginTime="beginTime"
			:endTime="endTime" :appointTime="appointTime" :subscribe="subscribe" :isOper="isOper" :isShowConfirm="isShowConfirm" ref="times"></times>

		<!-- 多选时间的配置 -->
		<!-- <times @change="getTime" :timeInterval="1" :appointTime="appointTime"
		:isMultiple="true" :disableTimeSlot = "disableTimeSlot"></times> -->

		<!-- 单选的配置 -->
		<!-- <times @change="getTime" :timeInterval="1" :appointTime="appointTime"
		:isMultiple="false" :disableTimeSlot = "disableTimeSlot"></times> -->

		<!-- 预约时间段 -->
		<!-- <times @change="getTime" :timeInterval="1" :appointTime="appointTime"
		:isSection="true" :disableTimeSlot = "disableTimeSlot"></times> -->
	</view>
</template>

<script>
	import times from './pretty-times.vue'
	export default {
		components: {
			times
		},
		props: {
			beginTime: { // 开始时间
				type: String,
			},
			endTime: { // 结束时间
				type: String,
			},
			isShowConfirm: { // 
				type: Number,
			}
		},
		data() {
			return {
				appointTime:["18:30:00"],
				isOper:1,
				isShowConfirm:1,
				hourList:[],
				taocanList:[]
			}
		},
		methods: {
			getTime(e) {
				console.log(e)
			},
			refreshTimeList(isOper){
				
				console.log('isOper:'+isOper);
				this.isOper = isOper;
				this.$refs.times.initOnload();
				this.$refs.times.hourList = this.hourList;
				this.$refs.times.taocanList = this.taocanList;
				console.log("refreshTimeList");
				 
			}
		}
	}
</script>

<style>
</style>
