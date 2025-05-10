<!--
 选择开通城市
 Created by xunyin 
-->
<template>
	<view class="selectCidyBox">
		<view class="cityBox">
			<view class="cityTitle">
				当前定位城市
			</view>
			<view class="cityText" @click="location.city ? setSelectCity(location) : getLocations()">
				{{location.city ? location.city : "位置获取失败,点击重新获取"}}
			</view>
		</view>
		<view class="cityList">
			<view class="cityTitle">
				已开通城市
			</view>
			<view class="cityLiBox">
				<view class="cityLi" v-for="item in openCityList" :key="item.cityCode" @click="setSelectCity(item)">
					{{item.city}}<!-- -{{item.cityCode}}-{{item.lat}}-{{item.lng}} -->
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getLocation} from "@/utils/location/getLocation.js"
	//import {OpenCity} from "../../../utils/request/gather.js"
	import { openCity } from "@/api/mtstore";
	
	export default{
		data(){
			return{
				location:{}, // 位置信息
				openCityList:[], // 城市列表
			}
		},
		mounted() {
			this.setLocations(); // 设置位置信息
			this.getOpenCity(); // 获取开通城市列表
		},
		onShow() {
			//this.getLocations();
		},
		onLoad(e) {
			//this.location=
			//this.getLocation();
			
		},	
		methods:{
			setLocations(){ // 设置位置信息
				this.location = this.$store.getters.getLocation
			},
			getLocations(){ // 获取位置信息
				getLocation();
				this.setLocations()
			},
			getOpenCity(){ // 获取开通城市列表
				let that = this
				let paramData = {
				};	
				openCity(paramData).then(res => {
					that.openCityList = res.data
				})	
/* 				OpenCity().then(res => {
					console.log("openCityList:", res.data.data)
					that.openCityList = res.data.data
				}) */
				
			},
			setSelectCity(cityObj){ // 设置选择的城市
				this.$store.commit("setSelectCity",cityObj)
				setTimeout(()=>{
					uni.navigateBack({
						delta:1
					})
				},500)
			}
		}
	}
</script>

<style>
	page{
		background: #f5f6f8;
	}
</style>
<style lang="scss" scoped>
	.selectCidyBox{
		width: 100%;
		height: auto;
		.cityBox{
			width: 90%;
			height: auto;
			margin: 40rpx auto 0;
			
			.cityTitle{
				color: #666769;
				font-size: 28rpx;
			}
			
			.cityText{
				width: calc(100% - 40rpx);
				height: auto;
				padding: 10rpx 20rpx;
				font-size: 28rpx;
				color: #333;
				margin-top: 30rpx;
				border-bottom: 1rpx solid #e6e7e9;
			}
		}
		
		.cityList{
			width: 90%;
			height: auto;
			margin: 60rpx auto 0;
			
			.cityTitle{
				font-size: 28rpx;
				color: #333;
				font-weight: bold;
			}
			
			.cityLiBox{
				margin-top: 30rpx;
				width: 100%;
				height: auto;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				
				.cityLi{
					width: 31%;
					height: auto;
					padding: 20rpx 0;
					background: #fff;
					font-size: 28rpx;
					color: #333;
					text-align: center;
					margin-bottom: 20rpx;
				}
			}
			
			.cityLiBox::after{
				content: "";
				width: 31%;
				height: auto;
			}
		}
	}
</style>