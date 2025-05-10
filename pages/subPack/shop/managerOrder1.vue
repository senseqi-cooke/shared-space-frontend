<!--
 管理员订单
 Created by xunyin
-->
<template>
  <view class="orderListBox">
    <!-- <view v-if="$store.getters.token || userInfo.uid"> -->
    <view class="navBox">
      <view
        :class="[navStart == 0 ? 'selectNav' : '', 'nav']"
        @click="setNavStart(0)"
      >
        当天订单
        <view class="icon"></view>
      </view>
      <view
        :class="[navStart == 1 ? 'selectNav' : '', 'nav']"
        @click="setNavStart(1)"
      >
        一周订单
        <view class="icon"></view>
      </view>
      <view
        :class="[navStart == 2 ? 'selectNav' : '', 'nav']"
        @click="setNavStart(2)"
      >
        一月订单
        <view class="icon"></view>
      </view>
      <view
        :class="[navStart == 3 ? 'selectNav' : '', 'nav']"
        @click="setNavStart(3)"
      >
        全部订单
        <view class="icon"></view>
      </view>
    </view>

    <view class="moneyBox">
      <view class="bottomBox">
        <view class="numBox">
          <view class="text"> 预约订单金额 </view>
          <view class="num">
            {{ sumOrderMoney }}
          </view>
        </view>
        <view class="numBox">
          <view class="text"> 预约订单实付金额 </view>
          <view class="num">
            {{ sumRealOrderMoney }}
          </view>
        </view>
        <view class="numBox">
          <view class="text"> 预约订单总数 </view>
          <view class="num">
            {{ orderCount }}
          </view>
        </view>
      </view>
    </view>

    <view class="orderList" v-if="orderList.length != 0">
      <view class="orderBox" v-for="item in orderList" :key="item.id">
        <view class="topBox">
          <text style="font-size: 25rpx"
            >服务时间: {{ item.teaServerTime
            }}<!-- {{item.startTime}}-{{item.endTime}} --></text
          >
          <text class="status" v-if="item.orderStatus == 0"> 未支付 </text>
          <text class="status" v-if="item.orderStatus == 1"> 待使用 </text>
          <text class="status" v-if="item.orderStatus == 2"> 服务中 </text>
          <text class="status" v-if="item.orderStatus == 3"> 已取消 </text>
          <text class="status" v-if="item.orderStatus == 4"> 已完成 </text>
          <text class="status" v-if="item.orderStatus == 5"> 已退款 </text>
        </view>
        <view class="shopBox">
          <image :src="item.icon" mode=""></image>
          <view class="nameBox">
            <view class="name">
              {{ item.storeName }}
            </view>
            <view class="box">
              {{ item.storeRoomName }}
            </view>
            <view class="money">
              <text class="icon">￥</text
              ><text class="num">{{ item.orderMondey }}</text
              >元
            </view>
          </view>
        </view>
        <view class="buttonBox" v-if="item.orderStatus == 0">
          <!-- 						<view class="button one" @click="payOrder(item.id)">
							<image src="../../static/images/zhifu.png" mode=""></image>
							立即支付
						</view>
						<view class="button two" @click="cancelOrder(item.id)">
							取消订单
						</view> -->
        </view>
        <view
          class="buttonBox"
          v-if="item.orderStatus == 1 || item.orderStatus == 2"
        >
          <!-- 						<view class="button one" @click="openDoor(item.id)">
							<image src="../../static/images/zhifu.png" mode=""></image>
							开门
						</view>
						<view class="button one" style="margin-left: 25rpx;" @click="repeatOrder(item.id)">
							续订  
						</view>
						<view class="button two" @click="cancelOrder(item.id)" v-if="item.orderStatus == 1">
							取消订单
						</view>	 -->
        </view>
      </view>
    </view>

    <view class="nullOrder" v-else>
      <image
        src="https://shareadminapi2.tonetn.com/file/pic/20240513150411766342.png"
        mode=""
      ></image>
    </view>

    <view class="bottomText"> 没有更多了哟~ </view>
  </view>
  <!--   <Authorization v-else />			
	</view> -->
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import {
  getUserInfo,
  getMenuUser,
  wxappAuth,
  bindingPhone,
  wxappBindingPhone,
  wxappGetUserInfo,
} from "@/api/user";
import {
  isWeixin,
  VUE_APP_RESOURCES_URL,
  parseQuery,
  getProvider,
} from "@/utils";
import { OrderList } from "@/utils/request/gather.js";
/* import Authorization from '@/pages/authorization/index' */
import {
  getOrderListByUserId,
  immediatePay,
  cancelOrderPay,
  getRepeatOrder,
  getManagerStoreOrder,
} from "@/api/order";
import { weappPay } from "@/libs/wechat";
import { geStoreRoomDetail } from "@/api/store";
import { getOrderStatByDayNum } from "@/api/mtstore";
//import { openDoorStoreOrStoreRoom } from '@/api/mtstore';

export default {
  components: {
    /* Authorization, */
  },
  data() {
    return {
      navStart: 0, // 导航栏状态 (0:全部,1:未支付,2:进行中,3:已完成)
      orderList: [], // 订单列表
      token: uni.getStorageSync("token"), // token
      storeId: 0,
      orderStatus: 0,
      sumOrderMoney: 0,
      sumRealOrderMoney: 0, // 实付订单总金额
      orderCount: 0, // 订单总数
    };
  },
  onLoad(e) {
    this.storeId = e.storeId;
    //this.getTeamList()
  },
  computed: mapGetters(["location", "userInfo"]),
  created() {
    this.setNavStart(0); // 默认选择全部
  },
  onShow() {
    console.log("latitude:" + this.location.latitude);
    console.log("longitude:" + this.location.longitude);
    this.setNavStart(0); // 默认选择全部
  },
  methods: {
    /* ...mapMutations(['updateAuthorizationPage']), */
    goPage(url) {
      // 跳转页面
      /* 				if (!this.token) {
					uni.navigateTo({
						url: "/pages/Login/login"
					})
				} */
      uni.navigateTo({
        url,
      });
    },
    setNavStart(status) {
      // 设置导航栏状态

      this.navStart = status;

      this.getOrderList(status); // 获取订单列表
    },

    // 获取订单列表
    getOrderList(status) {
      let that = this;
      /* 				let param = {
					startFlag:status
				}	 */
      /* 				OrderList(status).then(res => {
					that.orderList = res.data.data
				}) */

      /* 				getOrderListByUserId(param).then(res => {
					that.orderList = res.data
				}) */
      var dayNum = 3;
      if (status == 0) {
        dayNum = 1;
      } else if (status == 1) {
        dayNum = 5;
      } else if (status == 2) {
        dayNum = 30;
      } else if (status == 3) {
        dayNum = 365;
      }

      let paramData = {
        storeId: this.storeId,
        orderStatus: this.orderStatus,
        dayNum: dayNum,
      };
      getManagerStoreOrder(paramData).then((res) => {
        if (res.status == 200) {
          //var orderList = res.data;
          this.orderList = res.data;
        }
      });

      // 根据天数获取订单（已支付、服务中、已完成）的实际支付金额总数、订单总数
      let paramData1 = {
        storeId: that.storeId,
        dayNum: dayNum,
      };
      getOrderStatByDayNum(paramData1).then((res) => {
        if (res.status == 200) {
          that.sumOrderMoney = res.data.orderStatDto.sumOrderMoney; // 订单总金额
          that.sumRealOrderMoney = res.data.orderStatDto.sumRealOrderMoney; // 实付订单总金额
          that.orderCount = res.data.orderStatDto.orderCount; // 订单总数
        }
      });
    },
    /* 			openDoor(orderId,switchId){ // 开门
				console.log("orderId:"+orderId)
				console.log("switchId:"+switchId)
				let param = {
					orderId:orderId,
					switchid:switchId
				};
				openDoorStoreOrStoreRoom(param).then(res => {
					if (res.status == 200) {
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			
			}, */

    // 开门
    openDoor(orderId) {
      let paramData = {
        orderId: orderId,
        operFlag: 1,
      };
      getRepeatOrder(paramData).then((res) => {
        var orderList = res.data;
        if (orderList.length <= 0) {
          uni.showToast({
            title: "未查询到已预定订单，可选择房间预定哦",
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
              var url = "/pages/subPack/orderList/detail";

              /* 									url = url+'?teaId='+shareOrderInfor.storeId + '&teaChildId='+shareOrderInfor.storeRoomId + '&storeRoomName='+mtStoreRoomInfor.storeRoomName +
										'&recommended='+mtStoreRoomInfor.recommended + '&icons=' + icons + '&address=' + mtStoreRoomInfor.address + '&distance=' + mtStoreRoomInfor.distance +
										'&phone=' + mtStoreRoomInfor.phone +'&images='+mtStoreRoomInfor.images+'&price='+mtStoreRoomInfor.price+'&image='+mtStoreRoomInfor.icon +
										'&storeName=' + shareOrderInfor.storeName+'&parentOrderId='+shareOrderInfor.id+'&latitude='+mtStoreRoomInfor.latitude+'&longitude='+mtStoreRoomInfor.longitude */

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
                mtStoreRoomInfor.repeatPrice +
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

      /* 				var url = '/pages/subPack/orderList/detail';
				url = url+'?teaId='+shareOrderInfor.storeId + '&teaChildId='+shareOrderInfor.storeRoomId + '&storeRoomName='+mtStoreRoomInfor.storeRoomName +
					'&recommended='+mtStoreRoomInfor.recommended + '&icons=' + icons + '&address=' + mtStoreRoomInfor.address + '&distance=' + mtStoreRoomInfor.distance +
					'&phone=' + mtStoreRoomInfor.phone +'&images='+mtStoreRoomInfor.images+'&price='+mtStoreRoomInfor.price+'&image='+mtStoreRoomInfor.icon +
					'&storeName=' + shareOrderInfor.storeName+'&parentOrderId='+shareOrderInfor.id+'&orderId='+shareOrderInfor.id+'&timeInterval='+shareOrderInfor.timeInterval+
					'&latitude='+mtStoreRoomInfor.latitude+'&longitude='+mtStoreRoomInfor.longitude+'&teaServerTime='+shareOrderInfor.teaServerTime
				uni.navigateTo({
					url
				}) */
    },
    repeatOrder(orderId) {
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
          orderId: orderId,
          operFlag: 2,
        };
        getRepeatOrder(paramData).then((res) => {
          var orderList = res.data;
          if (orderList.length <= 0) {
            uni.showToast({
              title: "订单服务时间未到，请稍后",
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

                var url = "/pages/subPack/homePage/details";

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
                  mtStoreRoomInfor.repeatPrice +
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
                  "&latitude=" +
                  mtStoreRoomInfor.latitude +
                  "&longitude=" +
                  mtStoreRoomInfor.longitude;

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
    cancelOrder(orderId) {
      let param = {
        orderId: orderId,
      };
      cancelOrderPay(param).then((res) => {
        if (res.status == 200) {
          uni.showToast({
            title: res.data,
            //icon: 'success',
            icon: "none",
            duration: 5000,
          });
          this.setNavStart(0);
        } else {
          uni.showToast({
            title: res.data,
            //icon: 'success',
            icon: "none",
            duration: 5000,
          });
          this.setNavStart(0);
        }
      });
    },
    payOrder(orderId) {
      let param = {
        orderId: orderId,
      };
      immediatePay(param).then((res) => {
        var payment = res.data.payment;
        var url = "/pages/orderList/orderList";
        if (res.status == 200) {
          if (payment.payMoney0Success === "1") {
            uni.showToast({
              title: "支付成功",
              icon: "success",
              duration: 5000,
            });
            this.setNavStart(0);
            //this.$router.go(0);
            /* 								uni.switchTab({
									url
								}) */
            //this.$yrouter.push({ path: "/pages/orderList/orderList"});
            return false;
          } else {
            console.log("payment:" + JSON.stringify(payment));
            weappPay(payment)
              .finally(() => {
                this.setNavStart(0);
                //this.$router.go(0);
                //resolve()
                /* 									uni.switchTab({
										url
									}) */
                //goOrderDetails(data.result.orderId, type)
              })
              .then((res) => {
                this.setNavStart(0);
                //this.$router.go(0);
                /* 									uni.switchTab({
										url
									})	 */
                // #ifdef MP-WEIXIN
                //subscribeMessage()
                // #endif
              });
          }
        } else {
          uni.showToast({
            title: "支付失败",
            icon: "none",
            duration: 2000,
          });
          this.setNavStart(0);
          //this.$router.go(0);
          /* 							uni.switchTab({
								url
							}) */
        }
      });
    },
  },
};
</script>

<style>
page {
  background: #f8f8fa;
}
</style>

<style lang="scss" scoped>
.orderListBox {
  width: 100%;
  height: auto;
  padding-bottom: 20rpx;

  .navBox {
    width: 100%;
    padding: 20rpx 0;
    background: #fff;
    display: flex;
    border-top: #f6f6f6 2rpx solid;

    .nav {
      flex: 1;
      text-align: center;
      font-size: 26rpx;
      color: #333;
      position: relative;

      .icon {
        display: none;
      }
    }

    .selectNav {
      color: #b28159;

      .icon {
        width: 90rpx;
        height: 6rpx;
        background: #b18059;
        position: absolute;
        display: block;
        bottom: -20rpx;
        left: 50%;
        transform: translate(-50%, 0);
        border-radius: 50rpx;
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

        .status {
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

  .nullOrder {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 200rpx;
  }

  .bottomText {
    margin: 30rpx auto 0;
    text-align: center;
    color: #333;
    font-size: 30rpx;
  }
}

.moneyBox {
  width: 95%;
  height: auto;
  margin: 20rpx auto 0;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 0 15rpx 0 rgba(0, 0, 0, 0.2);
  position: relative;
  min-height: 130rpx;
  overflow: auto;

  .moneyBack {
    width: 100%;
    height: auto;
    position: absolute;
  }

  .topBox {
    width: 90%;
    height: auto;
    margin: 20rpx auto 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      position: relative;
      z-index: 99;

      .text {
        color: #bd6b39;
        font-size: 28rpx;
      }

      .money {
        color: #85370d;
        font-size: 60rpx;
        font-weight: bold;
      }
    }

    .right {
      background: #ff501d;
      padding: 20rpx 65rpx;
      font-size: 30rpx;
      color: #fff;
      font-weight: bold;
      border-radius: 50rpx;
      position: relative;
      z-index: 99;
    }
  }

  .bottomBox {
    width: 100%;
    height: auto;
    margin: 50rpx auto 25rpx;
    display: flex;

    .numBox {
      flex: 1;
      height: auto;
      text-align: center;

      .text {
        font-size: 28rpx;
        color: #333;
      }

      .num {
        font-size: 28rpx;
        font-weight: bold;
        margin-top: 10rpx;
      }
    }
  }
}
</style>
