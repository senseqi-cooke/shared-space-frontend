<!--
 订单详情页，开门，续订操作
 Created by xunyin 
-->
<template>
  <view class="detailBox">
    <!-- 顶部 -->
    <view class="topBox">
      <!-- 店铺详情 -->
      <view class="shopBox">
        <view class="leftBox">
          <image :src="image" mode="widthFix"></image>
        </view>
        <view class="rightBox">
          <view class="title Box">
            {{ storeName }}
          </view>
          <view class="name Box">
            {{ storeRoomName }}
          </view>
          <view class="icon Box">
            <button open-type="share" class="button">分享好友</button>
          </view>
        </view>
      </view>

      <!-- 地址详情 -->
      <view class="siteBox">
        <image
          src="@/static/images/ditu.png"
          class="back"
          mode="widthFix"
        ></image>
        <image
          class="iconImg"
          src="@/static/images/detail-local.png"
          mode=""
        ></image>
        <view class="siteTextBox">
          <view class="site">
            {{ address }}
          </view>
          <view class="siteNum">
            <text>距离你{{ distance }}km</text>
          </view>
        </view>
      </view>
      <view class="buttonBox">
        <view class="button one" @click="tenxun()">
          <image
            src="../../../static/images/detail-navgiate.png"
            mode=""
          ></image>
          位置导航
        </view>
        <view class="button two" @click="call(phone)">
          <image src="../../../static/images/mobile.png" mode=""></image>
          电话咨询
        </view>
      </view>
      <!-- 显示时间 -->
      <view class="timeBox">
        <view class="leftBox Box">
          <view class="time">
            {{ startTime }}
          </view>
          <view class="deta">
            {{ startDate }}
          </view>
        </view>
        <view class="centerBox Box">
          <text>共{{ timeInterval }}小时</text>
          <view class="iconBox"></view>
        </view>
        <view class="rightBox Box">
          <view class="time">
            {{ endTime }}
          </view>
          <view class="deta">
            {{ endDate }}
          </view>
        </view>
      </view>
      <!-- 开门按钮 -->
      <view class="openButtonBox">
        <view class="openButton" @click="openDoor(switchId)">
          <image
            src="https://shareadminapi2.tonetn.com/file/pic/20240513152507375791.png"
            mode=""
          ></image>
          开大门
        </view>
      </view>
    </view>
    <!-- 包厢设备 -->
    <view class="equipmentBox">
      <view class="equTitle"> 包厢设备 </view>

      <view
        class="equContent"
        v-for="item in switchDeviceList"
        :key="item.switchId"
        @click="openDoor(item.switchId)"
      >
        <view
          class="equBox"
          v-if="
            (item.deviceType == 1 ||
              item.deviceType == 4 ||
              item.deviceType == 5) &&
            item.devicePos == 2
          "
        >
          <image src="@/static/icon/kaimen.png" mode=""></image>
          {{ item.switchName }}
        </view>
        <view
          class="equButton"
          v-if="
            (item.deviceType == 1 ||
              item.deviceType == 4 ||
              item.deviceType == 5) &&
            item.devicePos == 2
          "
        >
          开包厢门
        </view>
      </view>

      <!-- 			<view class="equContent">
				<view class="equBox">
					<image src="@/static/icon/kaimen.png" mode=""></image>
				</view>
				<view class="equButton">
					开包厢门
				</view>
			</view> -->
    </view>

    <!-- 订单说明 -->
    <view class="explainBox">
      <view class="expTitle"> 使用说明 </view>
      <view class="content" v-html="instr"></view>
    </view>
    <!-- 续订按钮 -->
    <view class="bottomButtonBox" @click="repeatOrder()">
      <view class="buttonBox"> 我要续订 </view>
    </view>
  </view>
</template>

<script>
import { OrderDetailMsg } from "@/utils/request/gather.js"; // 接口集
import { goTenXunLoca } from "@/utils/tenxunLoca.js";
import { getStoreRoomDevice } from "@/api/order";
import { geStoreDetail } from "@/api/store";
import { openDoorStoreOrStoreRoom } from "@/api/mtstore";
export default {
  data() {
    return {
      detailMsg: {}, // 订单详情数据
      storeId: 0,
      storeRoomId: 0,
      switchDeviceList: [],
      storeName: "",
      storeRoomName: "",
      address: "",
      distance: "",
      phone: "",
      image: "",
      latitude: "",
      longitude: "",
      timeInterval: 1,
      startTimeNum: 1,
      orderId: 0,
      parentOrderId: 0,
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      icons: [],
      price: 0,
      repeatPrice: 0,
      switchId: 0,
      instr: "",
      teaServerTime: "",
    };
  },
  onLoad(e) {
    console.log("e.images:" + e.images);
    console.log("e.icons:" + e.icons);
    this.storeId = e.teaId;
    console.log("this.storeId:" + this.storeId);
    console.log("e.image:" + e.image);
    this.storeRoomId = e.teaChildId;
    this.storeRoomName = e.storeRoomName;
    this.recommended = e.recommended;
    this.address = e.address;
    this.distance = e.distance;
    this.phone = e.phone;
    this.price = e.price;
    this.repeatPrice = e.repeatPrice;
    this.startTimeNum = e.startTimeNum;
    this.image = e.image;
    this.storeName = e.storeName;
    this.latitude = e.latitude;
    this.longitude = e.longitude;
    this.timeInterval = e.timeInterval;
    this.orderId = e.orderId;
    this.recommended = e.recommended;
    this.icons = e.icons;
    this.teaServerTime = e.teaServerTime;
    var teaServerTimeList = e.teaServerTime.split("~");
    this.startDate = teaServerTimeList[0].substring(0, 10);
    this.startTime = teaServerTimeList[0].substring(11);
    this.endDate = teaServerTimeList[1].substring(0, 10);
    this.endTime = teaServerTimeList[1].substring(11);
    this.images = e.images;

    /* 			console.log("this.latitude:"+this.latitude)
			console.log("this.longitude:"+this.longitude)
			if(e.images!==''||e.images!== null){
				this.bannerList = e.images.split(',');
			}
			if(e.icons!==''||e.icons!== null){
				this.iconList = e.icons.split(',');
			} */
    this.parentOrderId = e.parentOrderId;

    let paramData = {
      storeId: this.storeId,
      storeRoomId: this.storeRoomId,
    };
    getStoreRoomDevice(paramData).then((res) => {
      //this.switchDeviceList = res.data;
      var tempSwitchDeviceList = res.data;
      var isTtlockFlag = false;
      var ttlockDeviceList = [];
      var roomDeviceList = [];

      // 获取大门锁Id
      for (let i = 0; i < tempSwitchDeviceList.length; i++) {
        var switchDevice = tempSwitchDeviceList[i];

        if (switchDevice.devicePos == 1) {
          this.switchId = switchDevice.switchId;
        }

        if (switchDevice.devicePos == 2) {
          // 如果是选择自研控制器，门锁选择第三方通通密码锁，
          // 则控制器自带的锁与第三方通通密码锁，有冲突，选择第三方通通密码锁，做为开包间门
          if (switchDevice.deviceType == 5) {
            ttlockDeviceList.push(switchDevice);

            isTtlockFlag = true;
          }

          roomDeviceList.push(switchDevice);
        }

        //if(switchDevice.deviceType==0){
        //this.switchId = switchDevice.switchId
        //}
        //icons.push(mtStoreRoomInfor.iconList[i].icon)
      }

      if (isTtlockFlag) {
        this.switchDeviceList = ttlockDeviceList;
      } else {
        this.switchDeviceList = roomDeviceList;
      }

      //console.log("switchDeviceList:"+JSON.stringify(this.switchDeviceList));
    });
    geStoreDetail(this.storeId).then((res) => {
      var storeInfor = res.data;
      this.instr = storeInfor.instr;
    });
    //this.getOrderDetailMsg(); // 获取订单详情
  },
  onShareAppMessage: function (res) {
    var that = this;
    //console.log('res=====',res);
    if (res.from === "button") {
      //console.log('来自页面内转发按钮');
    } else if (res.from === "menu") {
      //console.log('右上角菜单转发按钮');
    }
    // 返回数据
    var url = "/pages/subPack/orderList/detail";
    url =
      url +
      "?teaId=" +
      that.storeId +
      "&teaChildId=" +
      that.storeRoomId +
      "&storeRoomName=" +
      that.storeRoomName +
      "&recommended=" +
      that.recommended +
      "&icons=" +
      that.icons +
      "&address=" +
      that.address +
      "&distance=" +
      that.distance +
      "&phone=" +
      that.phone +
      "&images=" +
      that.images +
      "&price=" +
      that.price +
      "&image=" +
      that.image +
      "&repeatPrice=" +
      that.repeatPrice +
      "&isRepeat=1" +
      "&startTimeNum=" +
      that.startTimeNum +
      "&storeName=" +
      that.storeName +
      "&parentOrderId=" +
      that.parentOrderId +
      "&orderId=" +
      that.orderId +
      "&timeInterval=" +
      that.timeInterval +
      "&latitude=" +
      that.latitude +
      "&longitude=" +
      that.longitude +
      "&teaServerTime=" +
      that.teaServerTime;
    return {
      title: this.storeName + "_" + this.storeRoomName,
      path: url,
      success: function (res) {
        // 转发成功，可以把当前页面的链接发送给后端，用于记录当前页面被转发了多少次或其他业务
        /* 			      wx.request({
			        url: app.buildUrl("/member/share"),
			        data: {
			          url: utils.getCurrentPageUrlWithArgs()
			        },
			        success: function(res) {
			          //console.log('成功');
			        }
			      }); */
      },
      fail: function (res) {
        // 转发失败
      },
    };
  },
  methods: {
    // 开门
    openDoor(switchId) {
      console.log("orderId:" + this.orderId);
      console.log("switchId:" + switchId);
      let param = {
        orderId: this.orderId,
        switchid: switchId,
      };
      openDoorStoreOrStoreRoom(param).then((res) => {
        if (res.status == 200) {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    repeatOrder() {
      var url = "/pages/subPack/homePage/details";
      url =
        url +
        "?teaId=" +
        this.storeId +
        "&teaChildId=" +
        this.storeRoomId +
        "&storeRoomName=" +
        encodeURIComponent(this.storeRoomName) +
        "&recommended=" +
        this.recommended +
        "&icons=" +
        encodeURIComponent(this.icons) +
        "&address=" +
        encodeURIComponent(this.address) +
        "&distance=" +
        this.distance +
        "&phone=" +
        this.phone +
        "&images=" +
        this.images +
        "&price=" +
        this.price +
        "&image=" +
        this.image +
        "&repeatPrice=" +
        this.repeatPrice +
        "&isRepeat=1" +
        "&startTimeNum=" +
        this.startTimeNum +
        "&storeName=" +
        encodeURIComponent(this.storeName) +
        "&parentOrderId=" +
        this.parentOrderId +
        "&latitude=" +
        this.latitude +
        "&longitude=" +
        this.longitude;
      uni.navigateTo({
        url,
      });
    },
    getOrderDetailMsg() {
      // 获取订单详情
      /* 				let that = this
				OrderDetailMsg().then(res => {
					that.detailMsg = res.data.data
					console.log(res);
				}) */
    },
    tenxun() {
      // 调起导航
      goTenXunLoca(this.address, this.latitude, this.longitude);
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
  },
};
</script>

<style scoped lang="scss">
.detailBox {
  width: 100%;
  height: calc(100vh - 63px);
  overflow: auto;
  background: #efefef;
  display: flex;
  flex-direction: column;

  .topBox {
    width: 100%;
    height: auto;
    background: #fff;
    box-sizing: border-box;
    padding: 0rpx 2.5% 30rpx;

    .shopBox {
      width: 100%;
      height: auto;
      display: flex;

      .leftBox {
        width: 160rpx;
        // height: 160rpx;

        image {
          width: 100%;
        }
      }

      .rightBox {
        flex: 1;
        height: 160rpx;
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .title {
          font-size: 28rpx;
          color: #333;
        }

        .name {
          font-size: 24rpx;
          color: #666;
          margin-top: 15rpx;
        }

        .icon {
          // display: flex;
          // justify-content: flex-end;
          margin-top: 15rpx;

          .button {
            width: 153rpx;
            height: 51rpx;
            border-radius: 5rpx;
            border: 1rpx solid #ff6ca0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 600;
            font-size: 21rpx;
            color: #ff6ca0;
            letter-spacing: 1px;
						background-color: #fff;
						margin: 0;
          }
        }
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
        width: 95vw;
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
      flex: 1;
      height: auto;
      display: flex;
      padding: 20rpx 0;

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

    .timeBox {
      flex: 1;
      height: auto;
      padding: 20rpx 40rpx;
      margin-top: 20rpx;
      border: 4rpx solid #c5c5c5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 100rpx;

      .Box {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
      }

      .leftBox,
      .rightBox {
        .time {
          font-size: 40rpx;
          font-weight: 500;
          color: #333;
        }

        .deta {
          font-size: 24rpx;
          color: #333;
        }
      }

      .centerBox {
        text {
          font-size: 20rpx;
        }

        .iconBox {
          width: 150rpx;
          height: 4rpx;
          background: linear-gradient(to right, #f3f3f3, #c1ae9a);
        }
      }
    }

    .openButtonBox {
      display: flex;
      justify-content: center;
      margin-top: 35rpx;
      .openButton {
        display: inline-flex;
        background: linear-gradient(to right, #ebcfad, #b3835a);
        padding: 15rpx 45rpx;
        border-radius: 50rpx;
        font-size: 28rpx;
        color: #fff;
        align-items: center;

        image {
          width: 35rpx;
          height: 35rpx;
          margin-right: 10rpx;
        }
      }
    }
  }

  .equipmentBox {
    width: 100%;
    height: auto;
    background: #fff;
    margin-top: 20rpx;
    box-sizing: border-box;
    padding: 20rpx;
    .equTitle {
      font-weight: bold;
    }

    .equContent {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20rpx;

      .equBox {
        font-size: 24rpx;
        display: flex;
        align-items: center;

        image {
          width: 35rpx;
          height: 35rpx;
        }
      }

      .equButton {
        //padding: 5rpx 15rpx;
        padding: 15rpx 45rpx;
        background: linear-gradient(to right, #ebcfad, #b3835a);
        font-size: 24rpx;
        color: #fff;
        border-radius: 50rpx;
      }
    }
  }

  .explainBox {
    flex: 1;
    height: auto;
    background: #fff;
    margin-top: 20rpx;
    box-sizing: border-box;
    padding: 20rpx;

    .expTitle {
      font-weight: bold;
    }

    .content {
      margin-top: 60rpx;
    }
  }

  .bottomButtonBox {
    width: 100%;
    height: auto;
    background-color: #fff;
    padding-bottom: 30rpx;
    position: fixed;
    bottom: 0rpx;
    left: 0rpx;

    .buttonBox {
      width: 95%;
      height: auto;
      margin: 0rpx auto;
      text-align: center;
      padding: 20rpx 0;
      border: 4rpx solid #bc997e;
      color: #bc997e;
      font-size: 30rpx;
      font-weight: bold;
      border-radius: 50rpx;
    }
  }
}
</style>
