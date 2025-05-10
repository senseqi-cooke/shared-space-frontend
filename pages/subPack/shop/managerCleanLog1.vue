<template>
  <view class="distributionBox">
    <!-- 		<view class="navBox">
			<view :class="[navSelect == 0 ? 'selectNav' : '' ,'nav']" @click="setNavSelect(0)">
				全部
				<view class="icon"></view>
			</view>
			<view :class="[navSelect == 1 ? 'selectNav' : '' ,'nav']" @click="setNavSelect(1)">
				待使用
				<view class="icon"></view>
			</view>
			<view :class="[navSelect == 2 ? 'selectNav' : '' ,'nav']" @click="setNavSelect(2)">
				服务中
				<view class="icon"></view>
			</view>
			<view :class="[navSelect == 3 ? 'selectNav' : '' ,'nav']" @click="setNavSelect(4)">
				已完成
				<view class="icon"></view>
			</view>
		</view> -->

    <view class="orderList" v-if="orderList.length > 0">
      <view class="orderBox" v-for="(item, index) in orderList" :key="index">
        <view class="topBox">
          <image :src="item.icon" mode=""></image>
          <view class="nameBox">
            <view class="name">
              {{ item.storeRoomName }}
            </view>
            <view class="msg">
              <view class="icon" v-if="item.orderStatus == 1">
                <!-- v-for="(icon,_index) in item.iconList" :key="_index" -->
                订单状态：未开始
              </view>
              <view class="icon" v-if="item.orderStatus == 2">
                订单状态：服务中
              </view>
              <view class="icon" v-if="item.orderStatus == 4">
                订单状态：已完成
              </view>
            </view>
            <view class="msg" style="font-size: 21rpx">
              订单时间：{{ item.teaServerTime }}
            </view>

            <view class="msg">
              <view class="msg" style="font-size: 21rpx">
                清洁时间：{{ parseTime1(item.cleaningTime) }}
              </view>
            </view>

            <view class="msg">
              <view class="msg" style="font-size: 21rpx">
                清洁员手机号：{{ item.cleannerPhone }}
              </view>
            </view>

            <view class="msg">
              <view class="msg" style="font-size: 21rpx">
                清洁备注：{{ item.cleanRemark }}
              </view>
            </view>
          </view>
        </view>
        <view
          class="bottomBox"
          v-if="item.orderStatus == 4 && item.serviceStatus != 9"
        >
          <!-- 					<view class="button" @click="goPage('./roomcleanLog',item)">
						保洁
					</view> -->
        </view>
        <view
          class="bottomBox"
          v-if="item.orderStatus == 4 && item.serviceStatus == 9"
        >
          <view class="button"> 已清洁 </view>
        </view>
      </view>
    </view>

    <view class="hideBox" v-else>
      <image
        src="https://shareadminapi2.tonetn.com/file/pic/20240513150419509422.png"
        mode="widthFix"
      ></image>
      <view class=""> 暂无数据 </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { getManagerStoreOrderByClean } from "@/api/order";
import { parseTime1 } from "@/utils";
export default {
  data() {
    return {
      navSelect: 0, // 导航栏的选择
      orderList: [], // 订单列表
      storeId: 0,
      orderStatus: 0,
    };
  },
  onLoad(e) {
    this.storeId = e.storeId;

    //this.getOrderList() // 获取分销订单列表
  },
  computed: mapGetters(["userInfo"]),
  onShow: function () {
    this.setNavSelect(0);
    // console.log("this.userInfo:"+this.userInfo)
    // console.log("this.userInfo.phone:"+this.userInfo.phone)
  },
  methods: {
    parseTime1,
    setNavSelect(nav) {
      // 选择导航栏
      // let that = this;
      this.navSelect = nav;
      this.orderStatus = nav;
      this.getOrderList();
    },
    getOrderList() {
      // 获取订单列表
      //let i = 0
      let paramData = {
        storeId: this.storeId,
        orderStatus: this.orderStatus,
        dayNum: 365,
      };

      getManagerStoreOrderByClean(paramData).then((res) => {
        if (res.status == 200) {
          //var orderList = res.data;
          this.orderList = res.data;
        }
      });
    },
    goPage(url, item) {
      // 跳转订单

      url =
        url +
        "?storeRoomId=" +
        item.storeRoomId +
        "&cleannerPhone=" +
        this.userInfo.phone +
        "&orderId=" +
        item.id +
        "&storeId=" +
        this.storeId;
      "&storeRoomName=" + item.storeRoomName;
      console.log(url);
      uni.navigateTo({
        url,
      });
    },
  },
};
</script>

<style>
page {
  background: #f0f0f0;
}
</style>
<style scoped lang="scss">
.distributionBox {
  width: 100%;
  height: auto;

  .navBox {
    width: 100%;
    height: auto;
    background: #fff;
    display: flex;

    .nav {
      flex: 1;
      padding: 20rpx;
      text-align: center;
      font-size: 28rpx;
      position: relative;
    }

    .selectNav {
      color: #5bd75b;
      font-size: 30rpx;
      font-weight: bold;

      .icon {
        width: 30rpx;
        height: 6rpx;
        background: #5bd75b;
        position: absolute;
        bottom: 2rpx;
        left: 50%;
        transform: translate(-50%, 0%);
      }
    }
  }

  .orderList {
    width: 100%;
    height: auto;

    .orderBox {
      width: 90%;
      height: auto;
      padding: 20rpx;
      background: #fff;
      border-radius: 15rpx;
      margin: 20rpx auto 0;

      .topBox {
        display: flex;
        align-items: center;

        image {
          width: 160rpx;
          height: 160rpx;
          border-radius: 15rpx;
        }

        .nameBox {
          margin-left: 20rpx;
          flex: 1;

          .name {
            font-size: 30rpx;
            color: #333;
            font-weight: bold;
          }

          .msg {
            flex: 1;
            display: flex;
            margin-top: 15rpx;

            .icon {
              font-size: 24rpx;
              padding: 3rpx 8rpx;
              color: #fff;
              background: #c1c1c1;
              border-radius: 5rpx;
              margin-right: 15rpx;
            }
          }

          .money {
            color: red;
            font-size: 28rpx;
            margin-top: 15rpx;
          }
        }
      }

      .bottomBox {
        margin-top: 20rpx;
        display: flex;
        justify-content: flex-end;

        .button {
          padding: 10rpx 35rpx;
          color: #fff;
          background: #5bd75b;
          border-radius: 40rpx;
          font-size: 28rpx;
          font-weight: bold;
        }
      }
    }
  }

  .hideBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #999;
    margin-top: 120rpx;

    image {
      width: 60%;
      height: auto;
    }

    view {
      margin-top: 30rpx;
    }
  }
}
</style>
