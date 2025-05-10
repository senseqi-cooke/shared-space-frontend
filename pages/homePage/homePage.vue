<!--
 小程序首页
 Created by xunyin 
-->
<template>
  <view class="homePageBox">
    <view class="selectCityBox">
      <view class="selectCity">
        <view class="inputBox">
          <view class="leftBox">
            <view
              class="cityBox"
              @click="goSelCityPage(`/pages/subPack/homePage/selectCity`)"
            >
              <text>{{ selectCity.city ? selectCity.city : "选择城市" }}</text>
              <image
                src="../../static/icon/MPIS-CaretBottom.png"
                mode="widthFix"
              ></image>
            </view>
            <!-- 						<view class="input">
							<input type="text" placeholder="搜索门店" placeholder-class="cityPla" value=""
								@input="selectTeaList">
						</view> -->
          </view>
          <!-- 					<view class="rightBox">
						地图
					</view> -->
        </view>
      </view>
    </view>
    <view class="sidebarBox">
      <view
        class="sidebar one"
        @click="goTabPage('/pages/orderList/orderList')"
      >
        <!-- <image src="https://shareadminapi2.tonetn.com/file/pic/20240513152414458143.jpg" mode="heightFix"></image> -->
        订单
      </view>
      <view class="sidebar two" @click="repeatOrder(1)">
        <!-- <image src="https://shareadminapi2.tonetn.com/file/pic/20240513152426119225.jpg" mode="heightFix"></image> -->
        开门
      </view>
      <view class="sidebar three" @click="repeatOrder(2)">
        <!-- <image src="https://shareadminapi2.tonetn.com/file/pic/20240513152419884243.jpg" mode="heightFix"></image> -->
        续订
      </view>

      <!-- 			<view class="sidebar four">
				<image src="https://shareadminapi2.tonetn.com/file/pic/20240513152406418397.jpg" mode="heightFix"></image>
				分享
			</view> -->
    </view>
    <view class="teaBox" v-for="item in storeList" :key="item.id">
      <view class="topBox">
        <view class="icon"> {{ item.startTimeNum }}小时起订 </view>
        <view class="title">
          {{ item.name }}
        </view>
        <image :src="item.image" mode=""></image>
      </view>
      <view class="centerBox">
        <view class="leftBox">
          <view class="time">
            <image src="../../static/icon/time.png" mode=""></image>营业时间：{{
              item.hours
            }}
          </view>
          <view class="site">
            <image src="../../static/icon/local.png" mode=""></image>
            {{ item.address }}
          </view>
        </view>
        <view class="rightBox">
          <view class="icon">
            <image
              src="../../static/images/navigate.png"
              mode=""
              @click="tenxun(item)"
            ></image>
            <image
              src="../../static/images/mobile.png"
              mode=""
              @click="call(item.phone)"
            ></image>
          </view>
          <view class="siteIcon"> 距离{{ item.distance }}km </view>
        </view>
      </view>
      <view class="showRoom roomListBox">
        <view
          class="roomBox"
          v-for="data in item.storeRoomList"
          :key="data.roomId"
          @click="
            data.storeRoomStatus != 2
              ? goPage(`/pages/subPack/homePage/details`, item, data)
              : ''
          "
        >
          <image :src="data.icon" mode=""></image>
          <view class="nameBox">
            <view class="name">
              {{ data.storeRoomName }}
            </view>
            <view class="iconBox">
              <view class="icon" v-for="icon in data.iconList" :key="icon.id">
                {{ icon.icon }}
              </view>
            </view>
            <view class="moneyBox">
              <view class="money">
                <text class="num">{{ moneyFilter(data.price) }}元</text>
                <text class="text">/时</text>
                <!-- ￥ -->
              </view>
              <view class="timeBox">
                <text class="one">续订￥</text>
                <text>{{ moneyFilter(data.repeatPrice) }}元/时</text>
                <!-- <text>{{data.renewMoney}}元/小时</text> -->
              </view>
            </view>
          </view>
          <view class="buttonBox">
            <view
              :class="[
                data.storeRoomStatus == 0 ? 'default' : 'gray',
                'button',
              ]"
            >
              <view class="top"
                ><!-- data.start.time+ -->
                火爆中
                <!-- {{data.storeRoomStatus == 0 ? '空闲中' : data.storeRoomStatus == 1 ? data.serverEndTimeStr+'结束' : '停用'}} -->
              </view>
              <view class="bottom">
                <!-- {{data.storeRoomStatus == 0 || data.storeRoomStatus == 2 ? '预定' : '使用中'}} -->
                去下单
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="bottomBox" @click="lookTeaRoom(item.id)">
				{{lookTeaId.indexOf(item.id) != -1 ? '收起馆' : '查看馆'}}
				<image :class="lookTeaId.indexOf(item.id) != -1 ? 'showIcon' : 'icon'"
					src="../../static/images/iconBottom.png" mode=""></image>
			</view> -->
    </view>
    <view class="bottomText" v-if="!storeList || storeList.length == 0">
      没有更多了哟~
    </view>
  </view>
</template>

<script>
//import { mapState, mapMutations, mapActions } from 'vuex'
import { TeaList, selectTea } from "@/utils/request/gather.js";
import { goTenXunLoca } from "@/utils/tenxunLoca.js";

import { storeListApi } from "@/api/mtstore";
import { wechatEvevt, wxShowLocation } from "@/libs/wechat";
import { mapGetters } from "vuex";
import { getUserInfo } from "@/api/user";
import cookie from "@/utils/store/cookie";
import store from "@/store/index.js";
import { getRepeatOrder } from "@/api/order";
import { geStoreRoomDetail } from "@/api/store";
import { getAddress } from "@/utils/location/getAddress.js";
/* const LONGITUDE = "user_longitude";
const LATITUDE = "user_latitude";
const MAPKEY = "mapKey"; */

export default {
  computed: mapGetters(["location", "goName", "userInfo"]),

  data() {
    return {
      teaList: [], // 门店列表
      storeList: [], // 门店列表
      lookTeaId: [], // 当前查看门店的id
      selectCity: {}, // 当前选择的城市
      token: uni.getStorageSync("token"), // token
      mapShow: false,
      system_store: {},
      //mapKey: cookie.get(MAPKEY),
      locationShow: false,
      globalData: {
        socketStatus: "closed",
      },
    };
  },
  //onLoad() {
  //this.getLocation();
  //},
  onLoad() {
    var indexStyle = 2;
    if (indexStyle == 2) {
      /* 				uni.setTabBarItem({
				    index: 0,  // 要修改的 tabBar 项的索引，从0开始
				    pagePath: 'pages/homePage/index',  // 新的页面路径
				    text: '首页'  // 更新显示的文本
				}); */
      /* 				let url = '/pages/homePage/index';
				uni.switchTab({
					url
				}) */
    }

    console.log("onLoad");
    // 获取选择的城市的信息
    //this.getSelectCity();
    //this.getSelCityStoreList();
    /* 			var that = this;
			if (that.globalData.socketStatus === 'closed') {
				//wx.setEnableDebug({    enableDebug: true});
			    that.openSocket();
				
			} */
  },
  onUnload() {
    //this.closeSocket();
  },
  mounted: function () {
    //setTimeout(()=>{
    this.getStoreList();
    //},1000)
  },
  created() {},
  onShow() {
    console.log("onShow");
    this.getSelectCity(); // 获取选择的城市的信息
    this.getSelCityStoreList();
  },
  methods: {
    //...mapActions(['getLocation']),
    tenxun(item) {
      // 调起导航
      goTenXunLoca(item.address, item.latitude, item.longitude);
    },
    formatePrice(money) {
      return parseInt(money);
    },
    moneyFilter(value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2);
      return realVal;
    },
    call(phone) {
      // 拨打电话
      uni.makePhoneCall({
        phoneNumber: phone,
        success: function () {
          console.log("拨打电话成功");
        },
        fail() {
          uni.showToast({
            title: "拨打电话失败，请确认电话格式是否正确",
            icon: "none",
          });
        },
      });
    },
    selectTeaList(el) {
      /* 				let value = el.detail.value
				let that = this
				this.teaList = []
				let data = {
					city: this.selectCity.city,
					lat: this.selectCity.lat,
					lng: this.selectCity.lng,
				}
				if (value == "") {
					this.getTeaList()
				} else {
					selectTea(data).then(res => {
						that.teaList = res.data.data
					})
				} */
    },
    repeatOrder(operFlag) {
      // 续订

      console.log("this.userInfo:" + this.userInfo);
      console.log("this.userInfo.uid:" + this.userInfo.uid);
      if (this.userInfo.uid === undefined) {
        uni.showToast({
          title: "未查询到已预定订单，可选择房间预定哦",
          //icon: 'success',
          icon: "none",
          duration: 5000,
        });
      } else {
        let paramData = {
          orderId: 0,
          operFlag: operFlag,
        };
        getRepeatOrder(paramData).then((res) => {
          var orderList = res.data;
          if (orderList.length <= 0) {
            uni.showToast({
              title: "未查询到服务中订单或已预定订单，可选择房间预定哦",
              //icon: 'success',
              icon: "none",
              duration: 5000,
            });
          } else {
            if (orderList.length == 1) {
              var shareOrderInfor = orderList[0];
              console.log("latitude:" + this.location.latitude);
              console.log("longitude:" + this.location.longitude);
              let paramData = {
                latitude: this.location.latitude, //纬度
                longitude: this.location.longitude, //经度
                storeRoomId: shareOrderInfor.storeRoomId,
              };

              // 根据订单关联的房间Id,查询房间信息
              geStoreRoomDetail(paramData).then((res1) => {
                var mtStoreRoomInfor = res1.data;
                let icons = [];
                for (let i = 0; i < mtStoreRoomInfor.iconList.length; i++) {
                  icons.push(mtStoreRoomInfor.iconList[i].icon);
                }
                var url = "";
                // 表示开门操作
                if (operFlag == 1) {
                  url = "/pages/subPack/orderList/detail";
                  url =
                    url +
                    "?teaId=" +
                    shareOrderInfor.storeId +
                    "&teaChildId=" +
                    shareOrderInfor.storeRoomId +
                    "&storeRoomName=" +
                    mtStoreRoomInfor.storeRoomName +
                    "&recommended=" +
                    mtStoreRoomInfor.recommended +
                    "&icons=" +
                    icons +
                    "&address=" +
                    mtStoreRoomInfor.address +
                    "&distance=" +
                    mtStoreRoomInfor.distance +
                    "&phone=" +
                    mtStoreRoomInfor.phone +
                    "&images=" +
                    mtStoreRoomInfor.images +
                    "&price=" +
                    mtStoreRoomInfor.price +
                    "&image=" +
                    mtStoreRoomInfor.icon +
                    "&repeatPrice=" +
                    mtStoreRoomInfor.repeatPrice +
                    "&isRepeat=1" +
                    "&startTimeNum=" +
                    mtStoreRoomInfor.startTimeNum +
                    "&storeName=" +
                    shareOrderInfor.storeName +
                    "&parentOrderId=" +
                    shareOrderInfor.id +
                    "&orderId=" +
                    shareOrderInfor.id +
                    "&timeInterval=" +
                    shareOrderInfor.timeInterval +
                    "&latitude=" +
                    mtStoreRoomInfor.latitude +
                    "&longitude=" +
                    mtStoreRoomInfor.longitude +
                    "&teaServerTime=" +
                    shareOrderInfor.teaServerTime;

                  // 表示续订操作
                } else if (operFlag == 2) {
                  url = "/pages/subPack/homePage/details";
                  url =
                    url +
                    "?teaId=" +
                    shareOrderInfor.storeId +
                    "&teaChildId=" +
                    shareOrderInfor.storeRoomId +
                    "&storeRoomName=" +
                    encodeURIComponent(mtStoreRoomInfor.storeRoomName) +
                    "&recommended=" +
                    mtStoreRoomInfor.recommended +
                    "&icons=" +
                    encodeURIComponent(icons) +
                    "&address=" +
                    encodeURIComponent(mtStoreRoomInfor.address) +
                    "&distance=" +
                    mtStoreRoomInfor.distance +
                    "&phone=" +
                    mtStoreRoomInfor.phone +
                    "&images=" +
                    mtStoreRoomInfor.images +
                    "&price=" +
                    mtStoreRoomInfor.price +
                    "&image=" +
                    mtStoreRoomInfor.icon +
                    "&repeatPrice=" +
                    mtStoreRoomInfor.repeatPrice +
                    "&isRepeat=1" +
                    "&startTimeNum=" +
                    mtStoreRoomInfor.startTimeNum +
                    "&storeName=" +
                    encodeURIComponent(shareOrderInfor.storeName) +
                    "&parentOrderId=" +
                    shareOrderInfor.id +
                    "&orderId=" +
                    shareOrderInfor.id +
                    "&timeInterval=" +
                    shareOrderInfor.timeInterval +
                    "&latitude=" +
                    mtStoreRoomInfor.latitude +
                    "&longitude=" +
                    mtStoreRoomInfor.longitude +
                    "&teaServerTime=" +
                    shareOrderInfor.teaServerTime;
                }

                uni.navigateTo({
                  url,
                });
              });
            } else {
              let url = "/pages/orderList/orderList";
              uni.switchTab({
                url,
              });
            }
          }
        });
      }
    },
    goSelCityPage(url) {
      uni.navigateTo({
        url,
      });
    },
    goPage(url, storeItem, storeRoomItem) {
      // 跳转页面

      console.log("item.id:" + storeItem.id);
      console.log("storeRoomItem.roomId:" + storeRoomItem.roomId);
      console.log("storeRoomItem.images:" + storeRoomItem.images);
      console.log("storeRoomItem.iconList:" + storeRoomItem.iconList);

      let icons = [];
      for (let i = 0; i < storeRoomItem.iconList.length; i++) {
        icons.push(storeRoomItem.iconList[i].icon);
      }
      /* 				storeRoomItem.iconList.map((item, index) => {
					//icons+=item.icon+","
					icons.push(item.icon) */
      /* 				if(icons.length>0){
					icons = icons.substring(0,icons.length-1)
				} */

      url =
        url +
        "?teaId=" +
        storeItem.id +
        "&teaChildId=" +
        storeRoomItem.roomId +
        "&storeRoomName=" +
        storeRoomItem.storeRoomName +
        "&recommended=" +
        storeRoomItem.recommended +
        "&icons=" +
        icons +
        "&address=" +
        storeItem.address +
        "&distance=" +
        storeItem.distance +
        "&phone=" +
        storeItem.phone +
        "&images=" +
        storeRoomItem.images +
        "&price=" +
        storeRoomItem.price +
        "&image=" +
        storeRoomItem.icon +
        "&repeatPrice=" +
        storeRoomItem.repeatPrice +
        "&isRepeat=0" +
        "&startTimeNum=" +
        storeItem.startTimeNum +
        "&storeName=" +
        storeItem.name +
        "&parentOrderId=0" +
        "&latitude=" +
        storeItem.latitude +
        "&longitude=" +
        storeItem.longitude;

      // + '&instr=' + storeItem.instr
      /* 				if (!this.token) {
					uni.navigateTo({
						url: "/pages/Login/login"
					})
				} */

      uni.navigateTo({
        url,
      });
    },
    goTabPage(url) {
      // 跳转到tabBar页面
      console.log("latitude:" + this.location.latitude);
      console.log("longitude:" + this.location.longitude);
      /* 				if (!this.token) {
					uni.navigateTo({
						url: "/pages/Login/login"
					})
				} */
      uni.switchTab({
        url,
      });
    },
    getStoreList() {
      let that = this;
      uni.getLocation({
        type: "gcj02",
        success(res) {
          let longitude = res.longitude;
          let latitude = res.latitude;
          console.log("success_longitude:" + longitude);
          console.log("success_latitude:" + latitude);
          store.commit("setLocation", {
            longitude: res.longitude,
            latitude: res.latitude,
          });

          getAddress(longitude, latitude)
            .then((res) => {
              //console.log("getAddress_res:"+res.result)
              console.log(
                "getAddress_city:" + res.result.address_component.city
              );
              let cityName = res.result.address_component.city;
              let countyCode = res.result.ad_info.adcode;
              console.log("countyCode=", countyCode);
              let cityCode = "";
              let provinceCode = "";
              if (countyCode) {
                provinceCode = countyCode.substring(0, 2) + "0000";
                cityCode = countyCode.substring(0, 4) + "00";
              }
              console.log("cityCode=", cityCode);
              // 获取城市信息
              that.selectCity = {
                city: cityName,
                cityCode: cityCode,
                lat: latitude,
                lng: longitude,
              };
              store.commit("setSelectCity", that.selectCity);
              // 保存定位城市信息
              let params = {
                city: cityName,
                name: cityName,
                lng: longitude,
                lat: latitude,
                cityCode: cityCode,
              };
              store.commit("setLocation", params);
              let data = {
                latitude: latitude, //纬度
                longitude: longitude, //经度
                cityCode: cityCode,
              };
              storeListApi(data).then((res) => {
                //console.log("res.data:"+res.data)
                that.storeList = res.data;
                //console.log("that.storeList:"+that.storeList)
              });

              /* 								let params = {
									city: res.result.address_component.city,
									name: res.result.address_reference.landmark_l2.title,
									lng: longitude,
									lat: latitude,
								} */
              //store.commit('setLocation', params)
            })
            .catch((e) => {
              console.log(e, "解释地址失败");
              //直接用大连的好了
              that.selectCity = {
                city: "大连",
                cityCode: "210200",
                lng: 121,
                lat: 38,
              };
              let data = {
                latitude: that.selectCity.lat, //纬度
                longitude: that.selectCity.lng, //经度
                cityCode: that.selectCity.cityCode,
              };
              storeListApi(data).then((res) => {
                that.storeList = res.data;
              });
            });
        },
        fail(err) {
          console.log(err, "获取经纬度失败");
          uni.showToast({
            title: "位置获取失败，请检查是否开启获取位置权限",
            icon: "none",
            duration: 2000,
          });
          //直接用大连的好了
          that.selectCity = {
            city: "大连",
            cityCode: "210200",
            lng: 121,
            lat: 38,
          };
          let data = {
            latitude: that.selectCity.lat, //纬度
            longitude: that.selectCity.lng, //经度
            cityCode: that.selectCity.cityCode,
          };
          storeListApi(data).then((res) => {
            that.storeList = res.data;
          });
        },
      });

      //let that = this
      //console.log("latitude:"+this.location.latitude)
      //console.log("longitude:"+this.location.longitude)
    },
    getTeaList() {
      let that = this;
      TeaList().then((res) => {
        that.teaList = res.data.data;
      });
    },
    lookTeaRoom(id) {
      let index = this.lookTeaId.indexOf(id);
      if (index == -1) {
        this.lookTeaId.push(id);
      } else {
        this.lookTeaId.splice(index, 1);
      }
    },
    getSelectCity() {
      // 获取选择城市
      let selectCity = this.$store.getters.getSelectCity;
      if (JSON.stringify(selectCity) != "{}") {
        this.selectCity = selectCity;
      }
    },
    getSelCityStoreList() {
      let that = this;
      let selCity = this.$store.getters.getSelectCity;
      console.log("selCity:" + JSON.stringify(selCity));
      var data = {
        latitude: selCity.lat, //纬度
        longitude: selCity.lng, //经度
        cityCode: selCity.cityCode,
      };
      uni.getLocation({
        type: "gcj02",
        success(res) {
          let longitude = res.longitude;
          let latitude = res.latitude;
          data = {
            latitude: latitude, //纬度
            longitude: longitude, //经度
            cityCode: selCity.cityCode,
          };
          storeListApi(data).then((res) => {
            //console.log("res.data:"+res.data)
            that.storeList = res.data;
            //console.log("that.storeList:"+that.storeList)
          });
        },
        fail(err) {
          console.log(err, "获取经纬度失败");
          let data = {
            latitude: null, //纬度
            longitude: null, //经度
            cityCode: selCity.cityCode,
          };
          storeListApi(data).then((res) => {
            that.storeList = res.data;
          });
          uni.showToast({
            title: "您的位置获取失败，无法评估距离和导航",
            icon: "none",
            duration: 2000,
          });
        },
      });
    },
    openSocket() {
      // 打开信道
      wx.connectSocket({});
      //打开时的动作
      wx.onSocketOpen(() => {
        console.log("WebSocket 已连接");
        this.globalData.socketStatus = "connected";
        this.sendMessage();
      });
      //断开时的动作
      wx.onSocketClose(() => {
        console.log("WebSocket 已断开");
        this.globalData.socketStatus = "closed";
      });
      //报错时的动作
      wx.onSocketError((error) => {
        console.error("socket error:", error);
      });
      // 监听服务器推送的消息
      wx.onSocketMessage((message) => {
        console.log("【websocket监听到消息】");
        //console.log(message);
        // 获取选择的城市的信息
        this.getSelectCity();
        this.getSelCityStoreList();
      });
    },
    // 关闭通信
    closeSocket() {
      if (this.globalData.socketStatus === "connected") {
        wx.closeSocket({
          success: () => {
            this.globalData.socketStatus = "closed";
          },
        });
      }
    },
    //发送消息函数
    sendMessage() {
      if (this.globalData.socketStatus === "connected") {
        //自定义的发给后台识别的参数 ，我这里发送的是name
        console.log(
          "wx.getStorageSync('openid'):" + wx.getStorageSync("openid")
        );
        wx.sendSocketMessage({
          data: '{"name":"' + wx.getStorageSync("openid") + '"}',
        });
      }
    },
  },
};
</script>

<style>
page {
  background: #f7f7f9;
}

.cityPla {
  font-size: 28rpx;
  color: #999999;
}
</style>

<style lang="scss" scoped>
.homePageBox {
  width: 100%;
  height: auto;
  padding-bottom: 20rpx;

  .selectCityBox {
    width: 100%;
    height: auto;
    padding: 20rpx 0;
    background: #fff;

    .selectCity {
      width: 92%;
      height: auto;
      margin: 0rpx auto;

      .inputBox {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .leftBox {
          display: flex;
          background: #f8f8f8;
          align-items: center;
          flex: 1;
          border-radius: 10rpx;

          .cityBox {
            padding: 20rpx;
            font-size: 28rpx;
            color: #333;

            image {
              width: 20rpx;
              margin-left: 10rpx;
            }
          }

          .input {
            flex: 1;
            padding-left: 20rpx;
            border-left: #f1f1f1 1rpx solid;

            input {
              flex: 1;
              font-size: 28rpx;
              color: #333;
            }
          }
        }

        .rightBox {
          margin-left: 40rpx;
        }
      }
    }
  }

  .sidebarBox {
    position: fixed;
    bottom: 10%;
    right: 10rpx;
    z-index: 99;

    .sidebar {
      width: 100rpx;
      height: 100rpx;
      background: #ce53b5;
      border-radius: 50%;
      margin-top: 20rpx;
      color: #fff;
      font-size: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      image {
        height: 35rpx;
        width: auto;
        margin-bottom: 5rpx;
      }
    }
  }

  .sidebarBox > .sidebar:first-child {
    margin-top: 0;
  }

  .teaBox {
    width: 92%;
    height: auto;
    background: #fff;
    margin: 30rpx auto;
    box-shadow: 0rpx 5rpx 15rpx #999;
    border-bottom-right-radius: 15rpx;
    border-bottom-left-radius: 15rpx;

    .topBox {
      width: 100%;
      height: 400rpx;
      position: relative;

      .icon {
        position: absolute;
        z-index: 99;
        background: #316750;
        padding: 10rpx 35rpx 10rpx 15rpx;
        color: #fff;
        font-size: 24rpx;
        border-bottom-right-radius: 50rpx;
      }

      .title {
        position: absolute;
        z-index: 99;
        bottom: 15rpx;
        left: 20rpx;
        color: #fff;
      }

      image {
        width: 100%;
        height: 100%;
      }
    }

    .centerBox {
      display: flex;
      justify-content: space-between;
      padding: 15rpx 20rpx 30rpx;

      .leftBox {
        font-size: 28rpx;
        color: #666;

        image {
          width: 20rpx;
          height: 20rpx;
          margin-right: 10rpx;
        }

        .site {
          margin-top: 30rpx;
        }
      }

      .rightBox {
        border-left: #efefef 1rpx solid;
        padding-left: 30rpx;

        .icon {
          display: flex;
          justify-content: space-around;

          image {
            width: 55rpx;
            height: 55rpx;
          }
        }

        .siteIcon {
          display: inline-block;
          padding: 5rpx 25rpx;
          border: #b2825c 1rpx solid;
          font-size: 20rpx;
          color: #b2825c;
          margin-top: 15rpx;
        }
      }
    }

    .showRoom {
      height: auto !important;
      border-top: 1rpx solid #efefef;
    }

    .hideRoom {
      height: 0rpx !important;
    }

    .roomListBox {
      width: calc(100% - 40rpx);
      height: 0rpx;
      overflow: hidden;
      padding: 0 20rpx;

      .roomBox {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        margin: 25rpx 0;

        image {
          width: 180rpx;
          height: 180rpx;
          border-radius: 10rpx;
        }

        .nameBox {
          flex: 1;
          margin-left: 20rpx;

          .name {
            font-size: 28rpx;
            color: #333;
          }

          .iconBox {
            flex: 1;
            margin-top: 30rpx;

            .icon {
              display: inline-block;
              padding: 3rpx 8rpx;
              font-size: 24rpx;
              color: #909090;
              background: #f0f0f0;
              border-radius: 5rpx;
              margin-right: 20rpx;
              margin-bottom: 10rpx;
            }
          }

          .moneyBox {
            margin-top: 30rpx;
            flex: 1;
            justify-content: space-between;
            display: flex;
            align-items: center;

            .money {
              display: flex;
              align-items: center;

              .num {
                font-size: 28crpx;
                color: #eb0707;
              }

              .text {
                font-size: 20rpx;
                color: #c2c2c2;
              }
            }

            .timeBox {
              font-size: 20rpx;
              color: #d5d5d5;

              .one {
                color: #666666;
              }
            }
          }
        }

        .buttonBox {
          height: 180rpx;
          display: flex;
          align-items: flex-end;
          margin-left: 30rpx;

          .gray {
            border: 2rpx solid #999999;

            .top {
              color: #999999;
            }

            .bottom {
              background: #999999;
              color: #fff;
            }
          }

          .default {
            border: 2rpx solid #b154aa;

            .top {
              color: #b154aa;
            }

            .bottom {
              background: #b154aa;
              color: #fff;
            }
          }

          .button {
            text-align: center;
            min-width: 106rpx;

            .top {
              padding: 5rpx 4rpx;
              font-size: 20rpx;
            }

            .bottom {
              font-size: 30rpx;
            }
          }
        }
      }
    }

    .bottomBox {
      width: calc(100% - 40rpx);
      height: auto;
      display: flex;
      justify-content: center;
      padding: 20rpx;
      border-top: 1rpx solid #efefef;
      align-items: center;

      image {
        width: 40rpx;
        height: 40rpx;
      }

      .showIcon {
        transform: rotate(180deg);
      }
    }
  }

  .bottomText {
    margin: 30rpx auto 0;
    text-align: center;
    color: #333;
    font-size: 30rpx;
  }
}
</style>
