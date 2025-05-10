<template>
	<view class="formBox">
		<scroll-view  id="scrollview">
		<view class="inputBox">
			<view class="title">
				<text>*</text>房间名称
			</view>
			<u--input
			    placeholder="请输入房间名称"
			    border="bottom"
				placeholderClass="joinPla" v-model="storeRoomName" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text>*</text>推荐人数
			</view>
			<u--input
			    placeholder="请输入推荐人数"
			    border="bottom"
				placeholderClass="joinPla" v-model="recommended" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text>*</text>小时价格
			</view>
			<u--input
			    placeholder="请输入小时价格"
			    border="bottom"
				placeholderClass="joinPla" v-model="price" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text>*</text>续单小时价格
			</view>
			<u--input
			    placeholder="请输入续单小时价格"
			    border="bottom"
				placeholderClass="joinPla" v-model="repeatPrice" required></u--input>
		</view>
		<view class="inputBox">
			<view class="title">
				<text></text>服务设施
			</view>		  
<!-- 			<el-select
				v-model="serviceFacIds"
				style="width: 260px"
				placeholder="服务设施"
				clearable
				filterable
				multiple>
			   <el-option v-for="serviceFac in mtServiceFacList" :key="serviceFac.id" :label="serviceFac.serviceFacName" :value="serviceFac.id"/>
			 </el-select> -->
		 </view>
		 <view style="padding:40rpx 20rpx;">
                    <u-grid :border="false" col="4">
                        <u-grid-item v-for="(item, index) in mtServiceFacList" :key="index" custom-style="opacity:1">
                            <view class="" style="margin:20rpx 10rpx;">
								
                                <u-tag :text="item.serviceFacName" :plain="!item.checked" type="success" size="large" :name="index" @click="checkboxClick2($event, item)"></u-tag>
								
                            </view>  <!--  -->
                        </u-grid-item>
                    </u-grid>
        </view>
		
				
<!-- 		<view class="inputBox">
			<view class="title">
				<text></text>房间主图
			</view>		  
		</view> -->
			
		<view class="evaluate-con" style="padding:40rpx 20rpx;">		
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
		  </view>		
		
<!-- 		<view>
			<MaterialList v-model="iconArr" style="width: 370px" type="image" :num="1" :width="150" :height="150" />
		</view>	 -->	
<!-- 		<view class="inputBox">
			<view class="title marginBottom">
				其他留言
			</view>
			<u--textarea placeholder="请输入其他留言" placeholderClass="joinPla" v-model="leaveMsg" required></u--textarea>
		</view> -->
				
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
	import { trim, chooseImage } from "@/utils";
	import { VUE_APP_API_URL } from "@/config";
	//import MaterialList from '@/components/material'
	export default {
		//components: { MaterialList },
		data() {
			return {
 				storeRoomId: 0,
				storeRoomName:"", 
				recommended: 0,
				price: 0,
				repeatPrice: 0,
				iconArr: "",
				imageArr: "",
				mtServiceFacList: [], // 服务设施
				storeId:0,
				serviceFacIds: [],
				serviceFacNames: [],
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
			//this.serviceFacIds = e.icons ? e.icons.join(",") : '';
			//console.log("e.icons:"+JSON.stringify(e.icons));
			//this.serviceFacIds = e.icons.split(',');
			this.serviceFacNames = e.icons.split(',');
			this.serviceFacIds = e.serviceFacIds ? e.serviceFacIds.split(','): [];
			//console.log("this.serviceFacIds:"+JSON.stringify(this.serviceFacIds));
			this.storeId = e.storeId;
			this.storeRoomId = e.storeRoomId;
			this.storeRoomName = e.storeRoomName;
			this.recommended = e.recommended;
			this.price = e.price;
			this.repeatPrice = e.repeatPrice;
			this.iconArr = e.image;
			this.uploadPictures = e.images ? e.images.split(','): [];
			this.serviceFacList();
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
			checkboxClick2($event, item){
				let that = this;				
				if (item.checked) {
					item.checked = false;
					that.serviceFacIds.forEach(item1 => {
						if(item.id == item1){
							 const idIndex = that.serviceFacIds.indexOf(""+item.id+"");
							if (idIndex !== -1) {
							    that.serviceFacIds.splice(idIndex, 1);
							}
						}	
					});
				}else{
					item.checked = true;
					that.serviceFacIds.push(""+item.id+"");
				}
				
				console.log("that.serviceFacIds:"+JSON.stringify(that.serviceFacIds));	
			},			
			submit() {

			  if(this.storeRoomName===""){
				  uni.showToast({
				    title: '请输入房间名称',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
			  if(this.recommended===""){
				  uni.showToast({
				    title: '请输入推荐人数',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
			  if(this.price===""){
				  uni.showToast({
				    title: '请输入小时价格',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }
			  if(this.repeatPrice===""){
				  uni.showToast({
				    title: '请输入续单小时价格',
				    icon: 'none',
				    duration: 2000,
				  })
				  return false;
			  }											  
			  let data = {
			  	id:this.storeRoomId,
			  	storeId:this.storeId,
			  	storeRoomName:this.storeRoomName,
			  	price:this.price,
				repeatPrice:this.repeatPrice,
				recommended:this.recommended,
				icon:this.iconArr,
				images:this.uploadPictures ? this.uploadPictures.join(",") : '',
				serviceFacIds:this.serviceFacIds ? this.serviceFacIds.join(","): ''
			  }
			  
			  storeoomSave(data).then(res => {			  	
			  	if (res.status == 200) {			  		
			  		uni.showToast({
			  		  title: '提交成功',
			  		  icon: 'success',
			  		  duration: 5000,
			  		})
			  		// 跳转回上一页
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},1000)
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