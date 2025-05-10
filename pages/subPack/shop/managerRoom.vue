<!--
 小程序首页
 Created by xunyin 
-->
<template>
  <view class="homePageBox">
    <view class="sidebarBox">
      <view
        class="sidebar one"
        @click="goPageAdd('/pages/subPack/shop/editRoom')"
      >
        <image
          src="https://shareadminapi2.tonetn.com/file/pic/20240513152414458143.jpg"
          mode="heightFix"
        ></image>
        添加
      </view>
      <view class="sidebar two" @click="openDoor(0, 0)">
        <image
          src="https://shareadminapi2.tonetn.com/file/pic/20240513152426119225.jpg"
          mode="heightFix"
        ></image>
        开大门
      </view>
    </view>

    <view class="teaBox">
      <view
        class="showRoom roomListBox"
        v-for="data in storeRoomList"
        :key="data.roomId"
      >
        <view class="roomBox">
          <!-- @click="data.storeRoomStatus != 2 ? goPage(`/pages/subPack/homePage/details`,null,data) : ''" -->
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
                <text class="num">￥{{ moneyFilter(data.price) }}元</text>
                <text class="text">/小时</text>
              </view>
              <view class="timeBox">
                <text class="one">续单￥</text>
                <text>{{ moneyFilter(data.repeatPrice) }}元/小时</text>
                <!-- <text>{{data.renewMoney}}元/小时</text> -->
              </view>
            </view>
          </view>

          <!-- 							<view class="buttonBox">
								<view :class="[data.storeRoomStatus == 0 ? 'default' : 'gray' , 'button']">
									<view class="bottom">
										{{data.storeRoomStatus == 0 || data.storeRoomStatus == 2 ? '空闲中' : '使用中'}}
									</view>
								</view>
							</view> -->

          <view class="buttonBox">
            <view
              :class="[
                data.storeRoomStatus == 0 ? 'default' : 'gray',
                'button',
              ]"
            >
              <view class="top"
                ><!-- data.start.time+ -->
                {{
                  data.storeRoomStatus == 0
                    ? "空闲中"
                    : data.storeRoomStatus == 1
                    ? data.serverEndTimeStr + "结束"
                    : "停用"
                }}
              </view>
              <view class="bottom">
                {{
                  data.storeRoomStatus == 0 || data.storeRoomStatus == 2
                    ? "预定"
                    : "使用中"
                }}
              </view>
            </view>
          </view>
        </view>

        <view class="orderListBox">
          <view class="orderList">
            <view class="orderBox">
              <view class="buttonBox">
                <view
                  class="button one"
                  @click="goPage(`/pages/subPack/shop/editRoom`, null, data)"
                >
                  编辑
                </view>

                <view
                  class="button one"
                  style="margin-left: 25rpx"
                  @click="openDoor(5, data.roomId)"
                >
                  <image src="@/static/images/zhifu.png" mode=""></image>
                  开门
                </view>

                <view
                  class="button two"
                  @click="openStoreRommTime(data.roomId)"
                >
                  房态
                </view>

                <view
                  class="button one"
                  style="margin-left: 25rpx"
                  @click="updateRoomOnlineStatus('D', data.roomId)"
                  v-if="data.roomOnlineStatus == 'A'"
                >
                  <!-- <image src="@/static/images/zhifu.png" mode=""></image> -->
                  下架
                </view>

                <view
                  class="button one"
                  style="margin-left: 25rpx"
                  @click="updateRoomOnlineStatus('A', data.roomId)"
                  v-if="data.roomOnlineStatus == 'D'"
                >
                  <!-- <image src="@/static/images/zhifu.png" mode=""></image> -->
                  上架
                </view>
              </view>

              <view class="buttonBox">
                <view
                  class="button one"
                  style="margin-left: 5rpx"
                  @click="hardwareCtrApi(data.roomId, 1, 1, 1)"
                >
                  开启电源
                </view>

                <view
                  class="button one"
                  style="margin-left: 5rpx"
                  @click="hardwareCtrApi(data.roomId, 1, 1, 0)"
                >
                  关闭电源
                </view>

                <view
                  class="button two"
                  style="margin-left: 5rpx"
                  v-if="data.powerNorOpenStatus == 0"
                  @click="updateRoomPowerNorOpenStatus(1, data.roomId)"
                >
                  电源常开
                </view>
                <view
                  class="button one"
                  style="margin-left: 5rpx"
                  v-if="data.powerNorOpenStatus == 1"
                  @click="updateRoomPowerNorOpenStatus(0, data.roomId)"
                >
                  电源常开
                </view>

                <view
                  class="button one"
                  style="margin-left: 5rpx"
                  @click="executeConfigPassageMode(5, data.roomId, 1)"
                >
                  门锁常开
                </view>

                <!-- 									<view class="button one" style="margin-left: 5rpx;"
										@click="executeConfigPassageMode(5,data.roomId,0)">
									 	取消门锁常开
									</view> -->
              </view>

              <view class="buttonBox">
                <view
                  class="button one"
                  style="margin-left: 5rpx"
                  @click="proxyOrder(data.roomId, true)"
                >
                  代客预约
                </view>

                <!-- 									<view class="button one" style="margin-left: 5rpx;">
									 	终止订单
									</view> 
									
									<view class="button one" style="margin-left: 5rpx;">
									 	退款
									</view>

									<view class="button one" style="margin-left: 5rpx;">
										换房
									</view> -->
              </view>
            </view>

            <!-- 							<view class="orderBox" >
								<view class="buttonBox" >
									<view class="button one" >
										开电源  
									</view>
									<view class="button one" style="margin-left: 25rpx;">
										关电源
									</view>							
								</view>
							</view> -->
          </view>
        </view>
      </view>
    </view>

    <view class="bottomText"> 没有更多了哟~ </view>

    <view class="details">
      <u-popup
        :show="show"
        :round="10"
        mode="bottom"
        @close="isShow(false)"
        @open="open"
      >
        <view class="selectBox">
          <view class="titleBox">
            <view class="title">
              预定时间
              <image
                src="@/static/icon/close.png"
                mode=""
                @click="isShow(false)"
              ></image>
            </view>
          </view>
          <!-- 					<view class="rollBox">
						<swiper class="swiper" circular="true" :autoplay="autoplay" :interval="interval"
							:duration="duration">
							<swiper-item v-for="(item,index) in list" :key="index">
								<view class="swiper-item uni-bg-green">{{item}}</view>
							</swiper-item>
						</swiper>
					</view> -->
          <selectTime
            :beginTime="selectBeginTime"
            :endTime="selectEndTime"
            :isOper="isShowConfirm"
            ref="selectTime"
          >
            <!-- 这个地方是时间选择的组件，只需要传两个值 -->
            <!-- selectBeginTime是店铺开始营业的时间 默认值：00:00  格式是 HH:mm -->
            <!-- selectEndTime是店铺结束营业的时间 默认值：24:00  格式是 HH:mm -->
          </selectTime>
        </view>
      </u-popup>
    </view>

    <view>
      <u-popup :show="showProxy" mode="center" style="border-radius: 10px">
        <view class="u-popup-slot">
          <view class="cuohao">
            <u-icon
              size="24"
              @click="showProxy = !showProxy"
              name="close-circle"
            ></u-icon>
          </view>
          <div class="shurukuang">
            <p class="shurukuang-p">手机号</p>
            <u-input
              v-model="userPhone"
              placeholder="请输入用户手机号"
              :type="type"
              :border="border"
            />
          </div>
          <button class="quchongzhi" @click="proxyStoreRommTime()">确认</button>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
//import { mapState, mapMutations, mapActions } from 'vuex'
import { TeaList, selectTea } from "@/utils/request/gather.js";
import { goTenXunLoca } from "@/utils/tenxunLoca.js";

import {
  storeListApi,
  storeRoomList,
  updateRoomOnlineStatus,
  updateRoomPowerNorOpenStatus,
  getStoreRoomDeviceList,
} from "@/api/mtstore";
import { wechatEvevt, wxShowLocation } from "@/libs/wechat";
import { mapGetters } from "vuex";
import { getUserInfo } from "@/api/user";
import cookie from "@/utils/store/cookie";
import store from "@/store/index.js";
import { getRepeatOrder, getTimeListOrder } from "@/api/order";
import { geStoreRoomDetail } from "@/api/store";
import { getAddress } from "@/utils/location/getAddress.js";
import Bus from "@/utils/Bus.js";
import selectTime from "@/components/selectTime/selectTime.vue";
import {
  adminOpenDoorStoreOrStoreRoom,
  executeConfigPassageMode,
} from "@/api/mtstore";
import { isMobile } from "@/utils/verify";
import { proxyUserOrder } from "@/api/order";
/* const LONGITUDE = "user_longitude";
const LATITUDE = "user_latitude";
const MAPKEY = "mapKey"; */

export default {
  computed: mapGetters(["location", "goName", "userInfo"]),
  components: {
    selectTime,
  },
  data() {
    return {
      teaList: [],
      storeList: [], // 门店列表
      storeRoomList: [],
      lookTeaId: [],
      selectCity: {}, // 当前选择的城市
      token: uni.getStorageSync("token"), // token
      mapShow: false,
      system_store: {},
      //mapKey: cookie.get(MAPKEY),
      locationShow: false,
      storeId: 0,
      teaChildId: 0,
      show: false, // 弹出层显示状态
      showProxy: false,
      selectBeginTime: "00:00", // 日期的开始时间
      selectEndTime: "23:59", // 日期的结束时间,ios手机，24：00，打印出来为NAN，所以，处理是加上1000*60
      timeInterval: 1,
      selTimeData: {},
      selectTimeText: "选择预定时间",
      timeList: [],
      isShowConfirm: 0,
      obj: {
        timeList: [
          /* {
						date: "05-06", // 月份-日期
						selectBeginTime: "03:00", // 时间的开始时间
						// 时间格式 HH:mm:ss
						selectEndTime: "05:00", // 时间的结束时间
						sweep:1, // 打扫所需的时间段 
					} */
        ],
      },
      userPhone: "",
    };
  },
  mounted: function () {
    //setTimeout(()=>{
    //this.getStoreRoomList();
    //},1000)
  },
  created() {},
  onShow() {
    console.log("onShow");
    this.getStoreRoomList();
    //this.getSelectCity(); // 获取选择的城市的信息
    //this.getSelCityStoreList();
  },
  onLoad(e) {
    this.storeId = e.storeId;
    Bus.$on("isShow", (res) => {
      this.isShow(res);
    });
    Bus.$on("isTime", (res) => {
      this.isTime(res);
    });
  },
  provide: function () {
    return {
      subscribeObj: this.obj,
    };
  },
  methods: {
    open() {
      // console.log('open');
    },

    // 开门
    openDoor(deviceType, roomId) {
      let param = {
        deviceType: deviceType,
        storeId: this.storeId,
        storeRoomId: roomId,
      };
      adminOpenDoorStoreOrStoreRoom(param).then((res) => {
        if (res.status == 200) {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },

    // 设置通通锁  passageMode 常开模式：1-开启、2-关闭
    executeConfigPassageMode(deviceType, roomId, passageMode) {
      let param = {
        deviceType: deviceType,
        storeId: this.storeId,
        storeRoomId: roomId,
        passageMode: passageMode,
      };
      executeConfigPassageMode(param).then((res) => {
        if (res.status == 200) {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },

    updateRoomOnlineStatus(roomOnlineStatus, roomId) {
      let param = {
        roomOnlineStatus: roomOnlineStatus,
        id: roomId,
      };
      updateRoomOnlineStatus(param).then((res) => {
        if (res.status == 200) {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
          this.getStoreRoomList();
        }
      });
    },

    updateRoomPowerNorOpenStatus(powerNorOpenStatus, roomId) {
      let param = {
        powerNorOpenStatus: powerNorOpenStatus,
        id: roomId,
      };
      updateRoomPowerNorOpenStatus(param).then((res) => {
        if (res.status == 200) {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });

          this.getStoreRoomList();
        }
      });
    },

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

    // 代客预约
    proxyOrder(roomId, state) {
      this.teaChildId = roomId;

      if (state) {
        this.showProxy = state;
      } else {
        this.showProxy = state;
      }
    },
    // 弹出代客预约界面
    proxyStoreRommTime() {
      let that = this;
      console.log("userPhone:" + this.userPhone);
      // 验证是否手机号
      var verifyMobile = isMobile(this.userPhone);
      if (!verifyMobile) {
        uni.showToast({
          title: "用户手机号格式不正确",
          icon: "none",
          duration: 3000,
        });
      } else {
        that.isShowConfirm = 1;
        // 后台验证是否存在手机号对应已注册的用户
        this.isShow(true);
        this.showProxy = false;
      }
    },
    // 确认代客预约
    confirmProxyOrder(roomId) {},
    openStoreRommTime(roomId) {
      let that = this;
      that.isShowConfirm = 0;
      this.teaChildId = roomId;
      this.isShow(true);
    },

    isShow(state) {
      // 设置选择时间框的显示状态
      let that = this;
      if (state) {
        let param = {
          teaChildId: this.teaChildId,
        };
        getTimeListOrder(param).then((res) => {
          var timeList = res.data.timeList;
          this.obj.timeList = [];
          console.log("timeList:" + JSON.stringify(timeList));
          timeList.forEach((item) => {
            /* 					var reItem = {
								date: item.date, // 月份-日期
								selectBeginTime: item.selectBeginTime, // 时间的开始时间
								// 时间格式 HH:mm:ss
								selectEndTime: item.selectEndTime, // 时间的结束时间
								sweep:1, // 打扫所需的时间段 
							} */

            if (this.isRepeat == 1) {
              this.obj.timeList.push({
                date: item.date, // 月份-日期
                selectBeginTime: item.selectBeginTime, // 时间的开始时间
                endDate: item.endDate, // 月份-日期
                // 时间格式 HH:mm:ss
                selectEndTime: item.selectEndTime, // 时间的结束时间
                sweep: 0, // 打扫所需的时间段
              });
            } else {
              this.obj.timeList.push({
                date: item.date, // 月份-日期
                selectBeginTime: item.selectBeginTime, // 时间的开始时间
                endDate: item.endDate, // 月份-日期
                // 时间格式 HH:mm:ss
                selectEndTime: item.selectEndTime, // 时间的结束时间
                sweep: 1, // 打扫所需的时间段
              });
            }
          });
          this.show = state;
          this.$refs.selectTime.refreshTimeList(that.isShowConfirm);
        });
      } else {
        this.show = state;
      }
    },
    isTime(time) {
      // 子组件传来的时间信息

      this.time = time.timeInterval;
      console.log("时常:" + time.timeInterval); // 预定时常
      console.log("预定日期:" + time.deta.date1); // 预定日期
      console.log("预定日期:" + time.deta.date); // 预定日期
      console.log("时间:" + time.startTime.begin + " - " + time.endTime.end); // 结束预约时间
      this.selectTimeText =
        time.deta.date + " " + time.startTime.begin + "~" + time.endTime.end;
      //console.log("时间:" + time.startTime.time + ' - ' + time.endTime.time); // 结束预约时间
      this.selTimeData = time;
      this.timeInterval = time.timeInterval;

      console.log("yeardate:" + this.selTimeData.deta.date1);
      console.log("startTime:" + this.selTimeData.startTime.begin);
      console.log("endDate:" + this.selTimeData.endTime.selectDate);
      console.log("endTime:" + this.selTimeData.endTime.end);
      console.log("monthDay:" + this.selTimeData.startTime.selectDate);
      var yeardate = this.selTimeData.deta.date1;
      var monthDay = this.selTimeData.startTime.selectDate;
      var startTime = this.selTimeData.startTime.begin;
      var endDate = this.selTimeData.endTime.selectDate;
      var endTime = this.selTimeData.endTime.end;

      var year = yeardate.substring(0, 5);
      var teaSubscribeTimes = {
        date: monthDay,
        selectBeginTime: startTime,
        endDate: endDate,
        selectEndTime: endTime,
        sweep: 1,
      };
      var teaServerTime =
        year +
        monthDay +
        " " +
        startTime +
        "~" +
        year +
        endDate +
        " " +
        endTime;
      var teaServerStartTime = year + monthDay + " " + startTime;
      var teaServerEndTime = year + endDate + " " + endTime;

      let param = {
        teaId: this.storeId,
        teaChildId: this.teaChildId,
        userPhone: this.userPhone,
        useCouponId: 0,
        useHourCouponId: 0,
        /* payType:this.payType, */
        teaSubscribeTimes: JSON.stringify(teaSubscribeTimes),
        serverTime: teaServerTime,
        teaServerStartTime: teaServerStartTime,
        teaServerEndTime: teaServerEndTime,
        timeInterval: this.timeInterval,
        parentOrderId: 0,
        isRepeat: 0,
        /*					packMode:this.packMode,
					packMoney:this.packMoney,
					packageId:this.packageId */
      };
      console.log("param.storeId:" + param.teaId);
      console.log("param.teaChildId:" + param.teaChildId);
      proxyUserOrder(param)
        .then((res) => {
          console.log("res:" + res);
          var payment = res.data.payment;
          if (res.status == 200) {
            if (payment.payMoney0Success === "1") {
              uni.showToast({
                title: "代客下单成功",
                icon: "success",
                duration: 5000,
              });
            }
          }
        })
        .catch((e) => {
          //console.log("e:"+JSON.stringify(e));
          //console.log("e.res.data.status:"+e.res.data.status);

          if (e.res.data.status == 5101) {
            uni.showToast({
              title: "用户手机号未注册，该手机号先小程序授权登录",
              icon: "success",
              duration: 5000,
            });
          }
        });
    },
    getStoreRoomList() {
      let that = this;
      let paramData = {
        storeId: that.storeId,
      };
      storeRoomList(paramData).then((res) => {
        if (res.status == 200) {
          that.storeRoomList = res.data;
        }
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
    goSelCityPage(url) {
      uni.navigateTo({
        url,
      });
    },
    goPage(url, storeItem, storeRoomItem) {
      // 跳转页面
      //console.log("item.id:"+storeItem.id)
      console.log("storeRoomItem.roomId:" + storeRoomItem.roomId);
      console.log("storeRoomItem.images:" + storeRoomItem.images);
      console.log("storeRoomItem.iconList:" + storeRoomItem.iconList);
      let icons = [];
      for (let i = 0; i < storeRoomItem.iconList.length; i++) {
        icons.push(storeRoomItem.iconList[i].icon);
      }
      url =
        url +
        "?storeRoomId=" +
        storeRoomItem.roomId +
        "&storeRoomName=" +
        storeRoomItem.storeRoomName +
        "&recommended=" +
        storeRoomItem.recommended +
        "&icons=" +
        icons +
        "&images=" +
        storeRoomItem.images +
        "&serviceFacIds=" +
        storeRoomItem.serviceFacIds +
        "&price=" +
        storeRoomItem.price +
        "&image=" +
        storeRoomItem.icon +
        "&repeatPrice=" +
        storeRoomItem.repeatPrice +
        "&isRepeat=0" +
        "&storeId=" +
        this.storeId;

      uni.navigateTo({
        url,
      });
    },
    goPageAdd(url) {
      // 跳转页面
      url =
        url +
        "?storeRoomId=0&storeRoomName=&recommended=&icons=&images=&serviceFacIds=&price=&image=" +
        "&repeatPrice=&isRepeat=0&storeId=" +
        this.storeId;
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
            });
        },
        fail(err) {
          console.log(err, "获取经纬度失败");
          uni.showToast({
            title: "位置获取失败，请检查是否开启获取位置权限",
            icon: "none",
            duration: 3000,
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
      let selCity = this.$store.getters.getSelectCity;
      console.log("selCity:" + JSON.stringify(selCity));
      let data = {
        latitude: selCity.lat, //纬度
        longitude: selCity.lng, //经度
        cityCode: selCity.cityCode,
      };
      storeListApi(data).then((res) => {
        //console.log("res.data:"+res.data)
        this.storeList = res.data;
        //console.log("that.storeList:"+that.storeList)
      });
    },
    hardwareCtrApi(roomId, commandType, type, subPortSwitch) {
      // commandType 1表示电源端口，2表示磁力锁，3表示发送语音，4表示重启设备
      // type=1表示支持分控，subPort表示分控端口
      // subPortSwitch 1表示分控端口开，0表示分控端口关
      // 获取包厢的对应控制器
      let data = {
        storeRoomId: roomId,
      };
      getStoreRoomDeviceList(data).then((res) => {
        var deviceList = res.data;

        if (deviceList.length > 0) {
          for (let i = 0; i < deviceList.length; i++) {
            var subPortStr = subPortSwitch + ",0,0,0"; // 默认端口1为包厢电源总控或端口1控制灯光

            var formData = {
              macAddr: deviceList[i].macAddr,
              commandType: commandType,
              switchFlag: 1, // 这是不支持分控的控制器，默认传1
              voiceText: "",
              type: type,
              subPortStr: subPortStr,
            };
            let newFormData = JSON.stringify(formData);
            console.log(formData, "传参");
            const res1 = uni.request({
              url: "https://shareminiapi2.tonetn.com/api/device/sendCommondProg",
              method: "POST",
              header: {
                "content-type": "application/json;charset:utf-8",
              },
              data: formData,
              success(res) {
                console.log(res, "调用接口");
              },
            });
            console.log(res1);
          }
        }
      });
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

      .orderList {
        width: 100%;
        height: auto;

        .orderBox {
          width: 90%;
          height: auto;
          margin: 20rpx auto 0;
          padding-bottom: 25rpx;
          border-bottom: 2rpx solid #f2f2f2;

          .topBox {
            width: 100%;
            height: auto;
            display: flex;
            justify-content: space-between;
            font-size: 30rpx;
            color: #8f8f8f;

            .start {
              color: #eb542b;
            }
          }

          .shopBox {
            width: 100%;
            height: auto;
            margin-top: 20rpx;
            background: #f5f5f5;
            display: flex;
            border-radius: 15rpx;

            image {
              width: 180rpx;
              height: 180rpx;
            }

            .nameBox {
              display: flex;
              flex-direction: column;
              justify-content: center;
              margin-left: 25rpx;

              .name {
                font-size: 32rpx;
                font-weight: bold;
              }

              .box {
                font-size: 28rpx;
                color: #828282;
                margin-top: 10rpx;
              }

              .money {
                color: #e47823;
                font-size: 24rpx;
                margin-top: 10rpx;

                .icon {
                  font-size: 20rpx;
                }

                .num {
                  font-size: 36rpx;
                }
              }
            }
          }

          .buttonBox {
            width: 100%;
            height: auto;
            display: flex;
            justify-content: flex-end;
            margin-top: 20rpx;

            .button {
              width: 200rpx;
              padding: 10rpx 0;
              border-radius: 40rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 28rpx;

              image {
                width: 30rpx;
                height: 30rpx;
                margin-right: 10rpx;
              }
            }

            .one {
              background: linear-gradient(to right, #eeb8e8, #b16296);
              color: #fff;
            }

            .two {
              border: #666666 4rpx solid;
              color: #666666;
              margin-left: 25rpx;
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

.u-popup-slot {
  width: 600upx;
  border-radius: 20upx;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.cuohao {
  position: relative;
  top: 20upx;
  right: -534upx;
}

.touxiang1 {
  display: flex;
  justify-content: center;
  margin: 40upx 0;
  margin-left: 26upx;
}

.touxiang1-img {
  border-radius: 50%;
  width: 100upx;
  height: 100upx;
}

.camera {
  position: relative;
  top: 60upx;
  right: 24upx;
}
.shurukuang {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #f7f7f7;
  background-color: #f7f7f7;
  margin: 0 40upx;
  border-radius: 20upx;
  padding: 20upx 20upx;
}
.shurukuang-p {
  margin-rigjt: 40upx;
}

/deep/ .u-popup__content {
  border-radius: 20upx;
}
.u-popup-slot {
  background-image: url(https://shareminiapi2.tonetn.com/static/images/yonghubeijing.png);
  background-position: 0 0;
  background-size: 100%;
  background-repeat: no-repeat;
}

.quchongzhi {
  background-color: #ffe100;
  width: 200upx;
  border-radius: 60upx;
  font-weight: 700;
  margin-top: 40upx;
  margin-bottom: 40upx;
}
</style>
