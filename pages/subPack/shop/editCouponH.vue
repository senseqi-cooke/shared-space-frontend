<template>
	<view class="formBox">
		<scroll-view  id="scrollview">
		<view class="inputBox">
			<view class="title">
				<text>*</text>卡券名称
			</view>
			<u--input
			    placeholder="请输入卡券名称"
			    border="bottom"
				placeholderClass="joinPla" v-model="name" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text>*</text>卡券小时数
			</view>
			<u--input
			    placeholder="请输入卡券小时数"
			    border="bottom"
				placeholderClass="joinPla" v-model="hourCount" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text>*</text>卡券面额
			</view>
			<u--input
			    placeholder="请输入卡券面额"
			    border="bottom"
				placeholderClass="joinPla" v-model="amount" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text>*</text>有效期(天数)
			</view>
			<u--input
			    placeholder="请输入有效期(天数)"
			    border="bottom"
				placeholderClass="joinPla" v-model="limitDay" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text>*</text>每个用户限购次数
			</view>
			<u--input
			    placeholder="每个用户限购次数"
			    border="bottom"
				placeholderClass="joinPla" v-model="limitNum" required></u--input>
		</view>
		
		<view class="inputBox">
			<view class="title">
				<text></text>可用星期
			</view>		  
		 </view>
		 <view style="padding:40rpx 20rpx;">
                    <u-grid :border="false" col="4">
                        <u-grid-item v-for="(item, index) in weekDayForList" :key="index" custom-style="opacity:1">
                            <view class="" style="margin:20rpx 10rpx;">
								
                                <u-tag :text="item.name" :plain="!item.checked" type="success" size="large" :name="index" @click="checkboxClickWeekdays($event, item)"></u-tag>
								
                            </view>
                        </u-grid-item>
                    </u-grid>
        </view>
		
		<view class="inputBox">
			<view class="title">
				<text></text>可用时间段
			</view>		  
		 </view>
		 <view style="padding:40rpx 20rpx;">
                    <u-grid :border="false" col="3">
                        <u-grid-item v-for="(item, index) in timeScaleForList" :key="index" custom-style="opacity:1">
                            <view class="" style="margin:20rpx 10rpx;width: 90px;">
								
                                <u-tag :text="item.name" :plain="!item.checked" type="success" size="large" :name="index" @click="checkboxClickTimeScale($event, item)"></u-tag>
								
                            </view>
                        </u-grid-item>
                    </u-grid>
        </view>
				
		<view class="inputBox">
			<view class="title">
				<text></text>适用房间
			</view>		  
		 </view>
<!-- 		 <view style="padding:20rpx 10rpx;">
			 <select
			   v-model="roomIds"
			   style="width: 260px"
			   placeholder="适用房间"
			   clearable
			   filterable
			   multiple>
			   <option v-for="(storeRoomInfo, index) in storeRoomList" :key="storeRoomInfo.roomId" :label="storeRoomInfo.storeRoomName" :value="storeRoomInfo.roomId"/>
			 </select>
		 </view> -->
 		 <view style="padding:20rpx 10rpx;">
                    <u-grid :border="false" col="3">
                        <u-grid-item v-for="(item, index) in storeRoomList" :key="index" custom-style="opacity:1">
                            <view class="" style="margin:15rpx 15rpx;width: 95%;">
								
                                <u-tag :text="item.storeRoomName" :plain="!item.checked" type="success" size="large" :name="index" @click="checkboxClickStoreRoom($event, item)"></u-tag>
								
                            </view>
                        </u-grid-item>
                    </u-grid>
        </view>			

			
<!-- 		<view class="evaluate-con" style="padding:40rpx 20rpx;">		
				<view class="textarea">				  				
					  <view class="list acea-row row-middle">
							<view class="pictrue">
							  <image :src="iconArr" style="width: 150px;height: 150px;"/>
							</view>
							<view style="margin-left: 25px;" class="pictrue uploadBnt acea-row row-center-wrapper row-column" @tap="chooseImage">
							  <text class="iconfont icon-icon25201"></text>
							  <view>上传房间主图</view>
							</view>
					  </view>				
				</view>				
		</view>
												
		<view class="inputBox">
			<view class="title">
				<text></text>房间详情页图
			</view>		  
		</view>
								 
		<view class="evaluate-con" style="padding:40rpx 20rpx;">		
				<view class="textarea">				  				
					  <view class="list acea-row row-middle">
							<view
							  class="pictrue"
							  v-for="(item, uploadPicturesIndex) in uploadPictures"
							  :key="uploadPicturesIndex">
							  <image :src="item" />
							  <text
								class="iconfont icon-guanbi1 font-color-red"
								@click="uploadPictures.splice(uploadPicturesIndex, 1)"
							  ></text>
							</view>
							<view class="pictrue uploadBnt acea-row row-center-wrapper row-column" @tap="chooseImages">
							  <text class="iconfont icon-icon25201"></text>
							  <view>上传房间详情页图</view>
							</view>
					  </view>				
				</view>				
		  </view> -->		
	
		<view style="padding:40rpx 20rpx;width: 300px;">
			<u--textarea placeholder="请输入描述信息" placeholderClass="joinPla" v-model="description" >
				
			</u--textarea>	
		</view>
		<view style="padding:40rpx 20rpx;width: 300px;">
			<u--textarea placeholder="请输入后台备注" placeholderClass="joinPla" v-model="remarks" >
				
			</u--textarea>	
		</view>
		</scroll-view>
		
		<view class="formBox" style="padding-bottom: 20rpx;">
			<view class="button" @click="submit">
				提交
			</view>
		</view>
				
	</view>
	
</template>
<style scoped lang="less">
.evaluate-con .score .textarea .list .pictrue.uploadBnt {
  border: 1px solid #ddd;
}
</style>
<script>
	import attrs, { required, chs_phone } from '@/utils/validate'
	import { validatorDefaultCatch } from '@/utils/dialog'
	import { getServiceFacList,storeoomSave} from '@/api/mtstore'
	import { getCouponBaseList,saveCoupon} from '@/api/coupon'
	import { trim, chooseImage } from "@/utils";
	import { VUE_APP_API_URL } from "@/config";
	//import MaterialList from '@/components/material'
	export default {
		//components: { MaterialList },
		data() {
			return {
				id:0,
 				name: "",
				hourCount:0, 
				amount: 0,
				limitDay: 0,
				limitNum: 0,
				description: "",
				remarks: "",
				iconArr: "",
				imageArr: "",
				storeId:0,
				weekDayForList: [],    // 星期列表
				timeScaleForList: [],  // 时间段列表
				storeRoomList: [],     // 门店所属的房间列表
				availWeekdays: [],
				availTimescale: [],
				roomIds: [],
				uploadPictures: []
			}
		},
	    onReady() {  // 生命周期事件，页面装载完成后执行
			uni.createSelectorQuery().select('#scrollview').fields({
			  size: true,
			}, data => {
			  const height = data.height; // 获取scroll-view组件高度
			  uni.pageScrollTo({  // 设置滚动条位置
				scrollTop: height,
				duration: 300,
			  });
			}).exec();
		},		
		created() {
			
		},
		onLoad(e) {

			this.availWeekdays = e.availWeekdays ? e.availWeekdays.split(','): [];
			this.availTimescale = e.availTimescale ? e.availTimescale.split(','): [];
			this.roomIds = e.roomIds ? e.roomIds.split(','): [];
			this.storeId = e.storeId;
			this.id = e.id;
			this.name= e.name;
			this.hourCount=e.hourCount;
			this.amount= e.amount;
			this.limitDay= e.limitDay;
			this.limitNum= e.limitNum;
			this.description= e.description;
			this.remarks= e.remarks;
			this.getCouponBaseList();
		},
		methods: {
			// 获取服务设施列表
			serviceFacList() {
				let that = this;
			  //this.loading = true;
			  let dataParam = {};
			  getServiceFacList(dataParam).then( response => {
				  //this.mtServiceFacList = response.data;
				  var tempServiceFacList = response.data;
				  for (let i = 0; i < tempServiceFacList.length; i++) {
					  //console.log('tempServiceFacList:'+tempServiceFacList[i].serviceFacName);
					  that.serviceFacNames.forEach(item => {
					    //console.log(item);
							if(tempServiceFacList[i].serviceFacName == item){
								tempServiceFacList[i].checked = true;
							}	
					  });
				  }
				  this.mtServiceFacList = tempServiceFacList;
				  // this.loading = false;
				}
			  );
			},
			getCouponBaseList(){
				let that = this;
				let dataParam = {storeId:that.storeId};
				getCouponBaseList(dataParam).then(response => {
					var tempWeekDayForList = response.data.weekDayForList;
					var tempTimeScaleForList = response.data.timeScaleForList;
					var tempStoreRoomList = response.data.storeRoomList;
					
					for (let i = 0; i < tempWeekDayForList.length; i++) {
						that.availWeekdays.forEach(item => {
							//console.log("tempWeekDayForList[i].key-item:"+tempWeekDayForList[i].key+"-"+item)
							if(tempWeekDayForList[i].key == item){
								tempWeekDayForList[i].checked = true;
							}	
						});
					}
					
					for (let i = 0; i < tempTimeScaleForList.length; i++) {
						that.availTimescale.forEach(item => {
							if(tempTimeScaleForList[i].key == item){
								tempTimeScaleForList[i].checked = true;
							}	
						});
					}
										
					for (let i = 0; i < tempStoreRoomList.length; i++) {
						that.roomIds.forEach(item => {
							//console.log("tempStoreRoomList[i].roomId-item:"+tempStoreRoomList[i].roomId+"-"+item)
							if(tempStoreRoomList[i].roomId == item){
								tempStoreRoomList[i].checked = true;
							}	
						});
					}										
						
					that.weekDayForList  = tempWeekDayForList;
					that.timeScaleForList = tempTimeScaleForList;
					that.storeRoomList = tempStoreRoomList;
				});	
			},
			chooseImage() {
			  chooseImage((img) => {
				this.iconArr = img;
			  });
			},
			chooseImages() {
			  chooseImage(img => {
			    this.uploadPictures.push(img);
			  });
			},
			checkboxClickWeekdays($event, item){
				let that = this;				
				if (item.checked) {
					item.checked = false;
					that.availWeekdays.forEach(item1 => {
						if(item.key == item1){
							 const idIndex = that.availWeekdays.indexOf(""+item.key+"");
							if (idIndex !== -1) {
							    that.availWeekdays.splice(idIndex, 1);
							}
						}	
					});
				}else{
					item.checked = true;
					that.availWeekdays.push(""+item.key+"");
				}
				
				console.log("that.availWeekdays:"+JSON.stringify(that.availWeekdays));	
			},
			checkboxClickTimeScale($event, item){
				let that = this;
				if (item.checked) {
					item.checked = false;
					that.availTimescale.forEach(item1 => {
						if(item.key == item1){
							 const idIndex = that.availTimescale.indexOf(""+item.key+"");
							if (idIndex !== -1) {
							    that.availTimescale.splice(idIndex, 1);
							}
						}	
					});
				}else{
					item.checked = true;
					that.availTimescale.push(""+item.key+"");
				}
				
				console.log("that.availTimescale:"+JSON.stringify(that.availTimescale));	
			},
			checkboxClickStoreRoom($event, item){
				let that = this;
				if (item.checked) {
					item.checked = false;
					that.roomIds.forEach(item1 => {
						if(item.roomId == item1){
							 const idIndex = that.roomIds.indexOf(""+item.roomId+"");
							if (idIndex !== -1) {
							    that.roomIds.splice(idIndex, 1);
							}
						}	
					});
				}else{
					item.checked = true;
					that.roomIds.push(""+item.roomId+"");
				}
				
				console.log("that.roomIds:"+JSON.stringify(that.roomIds));
			},				
			submit() {

			  if(this.name===""){
				  uni.showToast({
				    title: '请输入卡券名称',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
			  if(this.hourCount===""){
				  uni.showToast({
				    title: '请输入卡券小时数',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
			  if(this.amount===""){
				  uni.showToast({
				    title: '请输入卡券面额',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
			  if(this.limitDay===""){
				  uni.showToast({
				    title: '请输入有效期(天数)',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
			  if(this.limitNum===""){
				  uni.showToast({
				    title: '请输入每个用户限购次数',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }															
			  let data = {
			  	id:this.id,
			  	storeIds:this.storeId,
			  	name:this.name,
			  	hourCount:this.hourCount,
				amount:this.amount,
				limitDay:this.limitDay,
				limitNum:this.limitNum,
				type:'H',
				//icon:this.iconArr,
				//images:this.uploadPictures ? this.uploadPictures.join(",") : '',
				availWeekdays:this.availWeekdays ? this.availWeekdays.join(","): '',
				availTimescale:this.availTimescale ? this.availTimescale.join(","): '',
				roomIds:this.roomIds ? this.roomIds.join(","): '',
				description:this.description,
				remarks:this.remarks
			  }
			  
			  saveCoupon(data).then(res => {
				  
				//console.log("saveCoupon:"+res.msg);
				  
			  	if (res.status == 200) {
			  		
			  		uni.showToast({
			  		  title: res.msg,
			  		  icon: 'success',
			  		  duration: 5000,
			  		})
					
					if(res.msg=='保存成功'){
						// 跳转回上一页
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},1000)
					}
					
			  	}	
			  })	
			}				  
		}
	}	
</script>

<style>
	page{
		background: #f8f8fa;
	}
	.joinPla{
		color: #d8d8d8;
		font-size: 24rpx;
	}
</style>

<style lang="scss" scoped>
	.formBox{
		width: 100%;
		height: auto;
		
		.inputBox{
			width: 90%;
			height: auto;
			margin: 50rpx auto 0;
			
			.marginBottom{
				margin-bottom: 20rpx !important;
			}
			
			.title{
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
				text{
					color: red;
				}
			}
		}
		
		.buttonBox{
			position: fixed;
			bottom: 90rpx;
			display: flex;
			width: 100%;
			height: auto;
			
			.button{
/* 				padding: 30rpx 0;
				flex: 1;
				height: auto;
				color: #fff;
				text-align: center; */
				width: 60%;
				height: auto;
				padding: 25rpx 0;
				border-radius: 50rpx;
				background: linear-gradient(to right,#f082e8,#b3835b);
				text-align: center;
				color: #fff;
				margin: 60rpx auto 0;
			}
			
		}
		
		.buttonBox>.button:nth-child(1){
			background: #f082e8;
		}
		
		.buttonBox>.button:nth-child(2){
			background: #b154aa;
		}
		
		.button{
			width: 60%;
			height: auto;
			padding: 25rpx 0;
			border-radius: 50rpx;
			background: linear-gradient(to right,#f082e8,#b3835b);
			text-align: center;
			color: #fff;
			margin: 60rpx auto 0;
		}		
	}
</style>