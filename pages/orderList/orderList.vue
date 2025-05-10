<!-- 我的订单列表 -->
<template>
  <view class="orderListBox">
    <view v-if="$store.getters.token || userInfo.uid" class="container">
      <view class="navBox">
        <view
          :class="[navStatus == 0 ? 'selectNav' : '', 'nav']"
          @click="setNavStatus(0)"
        >
          全部
          <view class="icon"></view>
        </view>
        <view
          :class="[navStatus == 1 ? 'selectNav' : '', 'nav']"
          @click="setNavStatus(1)"
        >
          未支付
          <view class="icon"></view>
        </view>
        <view
          :class="[navStatus == 2 ? 'selectNav' : '', 'nav']"
          @click="setNavStatus(2)"
        >
          进行中
          <view class="icon"></view>
        </view>
        <view
          :class="[navStatus == 3 ? 'selectNav' : '', 'nav']"
          @click="setNavStatus(3)"
        >
          已完成
          <view class="icon"></view>
        </view>
      </view>

      <view class="tip">
        为了让您操作更方便，平台支持在首页直接开锁、导航和续时等操作。
      </view>

      <view class="orderList" v-if="orderList.length != 0">
        <view class="orderBox" v-for="item in orderList" :key="item.id">
          <view class="topBox">
            <!-- <text style="font-size: 25rpx">
              服务时间: {{ formatDateTime(item.teaServerStartTime) }}
            </text> -->
            <text class="status" v-if="item.orderStatus == 0"> 未支付 </text>
            <text class="status" v-if="item.orderStatus == 1"> 待使用 </text>
            <text class="status" v-if="item.orderStatus == 2"> 服务中 </text>
            <text class="status" v-if="item.orderStatus == 3"> 已取消 </text>
            <text class="status" v-if="item.orderStatus == 4"> 已完成 </text>
            <text class="status" v-if="item.orderStatus == 5"> 已退款 </text>
          </view>
          <view class="shopBox">
            <image :src="item.icon" lazy-load mode="aspectFill"></image>
            <view class="nameBox">
              <view>
                <view class="name">
                  <text>{{ item.packageName }}</text>
                  <text class="xu" v-if="!!item.parentOrderId">续</text>
                </view>
                <view class="box">
                  {{ item.packageTags }}
                </view>
              </view>
              <!-- 👆上门服务的订单状态是已预约的要展示入店时间 -->
              <view
                class="time"
                v-if="item.depositStatus == 1 && item.isToDoor === 0"
              >
                入店时间：{{ formatDateTime(item.teaServerStartTime) }} </view
              ><view
                class="time"
                v-if="item.depositStatus == 1 && item.isToDoor === 0"
              >
                结束时间：{{ formatDateTime(item.teaServerEndTime) }}
              </view>
              <!-- 其他订单展示金额 -->
              <view class="money" v-else> ￥{{ item.orderMondey }}元 </view>
            </view>
          </view>
          <u-cell
            v-if="item.isToDoor === 0"
            :title="item.storeAddress"
            :border="false"
            icon="map-fill"
            isLink
            :titleStyle="{ fontSize: '24rpx', color: '#333' }"
            @click.stop="toMap(item)"
          ></u-cell>
          <u-cell
            :title="item.storePhone"
            :border="false"
            icon="phone-fill"
            isLink
            :titleStyle="{ fontSize: '24rpx', color: '#333' }"
            @click.stop="callStorePhone(item.storePhone)"
          ></u-cell>
          <u-cell
            :border="false"
            icon="weixin-fill"
            isLink
            :titleStyle="{ fontSize: '24rpx', color: '#333' }"
          >
            <view slot="title">
              <button open-type="contact" class="weixin-service">
                微信客服
              </button>
            </view>
          </u-cell>
          <!-- 只有待使用的才可分享 -->
          <view class="buttonBox">
            <button
              v-if="isPromoter && item.orderStatus == 1"
              class="button light"
              style="margin-right: 0"
              open-type="share"
            >
              分享
            </button>

            <view
              v-if="item.orderStatus == 0"
              class="button light"
              @click="payOrder(item.id)"
            >
              立即支付
            </view>

            <!-- 非上门服务展示 -->
            <template
              v-if="
                item.orderStatus == 1 &&
                item.depositStatus === 0 &&
                item.isToDoor === 0
              "
            >
              <!-- 成为会员价格限制 -->
              <view
                v-if="!isPromoter && item.payMoney >= 298"
                class="button light"
                @click="becomePromoter(item)"
              >
                成为会员
              </view>
              <!-- 续订的订单不展示 -->
              <view
                v-if="!item.parentOrderId"
                class="button light"
                @click="preBook(item)"
              >
                立即预约
              </view>
            </template>

            <!-- 非上门服务展示 -->
            <template
              v-if="
                [1, 2].includes(item.orderStatus) &&
                item.depositStatus === 1 &&
                item.isToDoor === 0
              "
            >
              <view
                class="button light"
                :class="
                  item.serviceStatus == 1 || item.serviceStatus == 3
                    ? 'ready'
                    : ''
                "
                @click="openDoor(item)"
              >
                开门
              </view>
              <view
                v-if="item.orderStatus == 2"
                class="button light"
                @click="repeatOrder(item.id)"
              >
                续订
              </view>
            </template>

            <view
              v-if="[0, 1].includes(item.orderStatus)"
              class="button"
              @click="cancelOrder(item.id)"
            >
              取消订单
            </view>
          </view>
        </view>

        <view class="bottomText"> 没有更多了哟~ </view>
      </view>

      <view class="nullOrder" v-else>
        <image
          src="https://shareadminapi2.tonetn.com/file/pic/20240513150411766342.png"
          mode=""
        />
      </view>
    </view>
    <Authorization v-else />

    <delayed
      :visible="delayedVisible"
      :target="delayedTarget"
      @close="delayedVisible = false"
    />

    <open-door
      :visible="openDoorVisible"
      :ready="openDoorRead"
      :order="openDoorOrder"
      @close="openDoorVisible = false"
    />

    <BecomePromoter
      :visible="promoterVisible"
      @close="promoterVisible = false"
      @confirm="confirmPromoter"
    />
  </view>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Authorization from "@/pages/authorization/index";
import BecomePromoter from "@/components/become-promoter";
import Delayed from "@/components/delayed";
import OpenDoor from "@/components/open-door";
import {
  getOrderListByUserId,
  immediatePay,
  cancelOrderPay,
  getRepeatOrder,
  becomePromoterApi,
} from "@/api/order";
import { weappPay } from "@/libs/wechat";
import { geStoreRoomDetail } from "@/api/store";
import { objectToQueryString, formatDateTimeByTimeZone } from "@/utils/index";
import { goTenXunLoca } from "@/utils/tenxunLoca.js";

export default {
  components: {
    Authorization,
    BecomePromoter,
    Delayed,
    OpenDoor,
  },
  data() {
    return {
      navStatus: 0, // 导航栏状态 (0:全部,1:未支付,2:进行中,3:已完成)
      orderList: [], // 订单列表
      token: uni.getStorageSync("token"), // token

      promoterVisible: false,
      promoterOrderNo: "",

      delayedVisible: false,
      delayedTarget: {},

      openDoorVisible: false,
      openDoorOrder: {},
      openDoorRead: false,
    };
  },

  options: {
    styleIsolation: "shared",
  },

  computed: {
    ...mapGetters(["location", "userInfo"]),

    isPromoter() {
      return this.userInfo.isPromoter === 1;
    },
  },
  onShow() {
    console.log("latitude:" + this.location.latitude);
    console.log("longitude:" + this.location.longitude);
    this.setNavStatus(0); // 默认选择全部
  },
  onHide() {
    this.promoterVisible = false;
  },
  /**
   * 设置分享内容
   */
  onShareAppMessage() {
    const isPromoter = this.userInfo.isPromoter;
    const params = {
      spread: +isPromoter === 1 ? this.userInfo.uid : "",
    };
    // 构建分享参数
    return {
      title: "邂逅一次, 开启三天好运",
      path: "/pages/homePage_V2/homePage_V2?" + this.$getShareUrlParams(params),
      imageUrl: `https://ss-admin-api.wgjpt.cn/file/other/20240912093926429971.webp`, // 预览图
    };
  },
  methods: {
    ...mapMutations(["updateAuthorizationPage"]),

    // 设置导航栏状态
    setNavStatus(status) {
      this.navStatus = status;
      this.getOrderList(status); // 获取订单列表
    },

    // 格式化时间
    formatDateTime(timeStr) {
      try {
        return formatDateTimeByTimeZone(timeStr);
      } catch (err) {
        return "-";
      }
    },

    // 获取订单列表
    getOrderList(status) {
      let param = {
        startFlag: status,
      };

      getOrderListByUserId(param).then((res) => {
        this.orderList = res.data;
      });
    },

    // 成为会员
    becomePromoter(item) {
      this.promoterVisible = true;
      this.promoterOrderNo = item.appOrderNo;
    },

    async confirmPromoter() {
      try {
        const param = {
          orderNo: this.promoterOrderNo,
        };
        uni.showLoading({ title: "请稍等", mask: true });
        await becomePromoterApi(param);

        uni.showToast({
          title: "已成为会员",
          icon: "success",
          duration: 5000,
        });
        this.$store.dispatch("userInfo", true);
        this.setNavStatus(0);
      } catch (err) {
        console.log(err);
        uni.showToast({
          title: err.msg,
          icon: "none",
          duration: 5000,
        });
      } finally {
        uni.hideLoading();
        this.promoterVisible = false;
      }
    },

    // 一键导航
    toMap(item) {
      const { storeAddress, storeLatitude, storeLongitude } = item;
      goTenXunLoca(storeAddress, storeLatitude, storeLongitude);
    },

    // 店铺电话
    callStorePhone(phone) {
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

    // 预约
    preBook(item) {
      const { storeRoomId, appOrderNo, storeName, packageId } = item;

      const query = {
        storeRoomId,
        appOrderNo,
        packageId,
        storeName,
      };
      uni.navigateTo({
        url: `/pages/subPack/orderList/preBook?${objectToQueryString(query)}`,
      });
    },

    // 开门
    openDoor(item) {
      const { serviceStatus } = item;
      this.openDoorVisible = true;
      this.openDoorRead = serviceStatus == 1;
      this.openDoorOrder = item;
    },

    // 续订
    async repeatOrder() {
      try {
        let param = {
          startFlag: 2, // 2 标识查询服务中的订单, 续费只可以续费服务中的
        };

        const { data } = await getOrderListByUserId(param);
        // 如果有正在服务中的, 那么可以续费
        if (data.length > 0) {
          this.delayedTarget = data[0]; // 取第一个
          this.delayedVisible = true;
        } else {
          uni.showToast({
            title: "目前暂无可以续费的订单",
            icon: "none",
          });
        }
      } catch (err) {
        uni.showToast({
          title: "目前暂无可以续费的订单",
          icon: "none",
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
          this.setNavStatus(0);
        } else {
          uni.showToast({
            title: res.data,
            //icon: 'success',
            icon: "none",
            duration: 5000,
          });
          this.setNavStatus(0);
        }
      });
    },
    payOrder(orderId) {
      uni.showLoading({ title: "请稍等", mask: true });
      let param = {
        orderId: orderId,
      };
      immediatePay(param)
        .then((res) => {
          var payment = res.data.payment;
          if (res.status == 200) {
            if (payment.payMoney0Success === "1") {
              uni.showToast({
                title: "支付成功",
                icon: "success",
                duration: 5000,
              });
              this.setNavStatus(0);
              return false;
            } else {
              console.log("payment:" + JSON.stringify(payment));
              weappPay(payment)
                .finally(() => {
                  this.setNavStatus(0);
                })
                .then((res) => {
                  this.setNavStatus(0);
                });
            }
          } else {
            uni.showToast({
              title: "支付失败",
              icon: "none",
              duration: 2000,
            });
            this.setNavStatus(0);
          }
        })
        .finally(() => {
          uni.hideLoading();
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
  height: 100vh;
  padding-bottom: 20rpx;

  .container {
    display: flex;
    flex-direction: column;

    > .tip {
      background-color: #ffe7f0;
      padding: 12rpx 18rpx;
      color: #666;
      font-size: 24rpx;
      margin-top: 18rpx;
      border-bottom: 1rpx solid #eee;
    }
  }

  .navBox {
    width: 100%;
    padding: 20rpx 0;
    background: #fff;
    display: flex;
    border-top: 1rpx solid #f6f6f6;
    flex-shrink: 0;

    .nav {
      flex: 1;
      text-align: center;
      position: relative;
      font-weight: 500;
      font-size: 27rpx;
      color: #333333;
      line-height: 38rpx;

      .icon {
        display: none;
      }
    }

    .selectNav {
      color: #ff6ca0;

      .icon {
        width: 90rpx;
        height: 8rpx;
        background: #ff6ca0;
        border-radius: 4rpx;
        position: absolute;
        display: block;
        bottom: -20rpx;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
  }

  .orderList {
    width: 100%;
    height: auto;
    overflow-y: scroll;
    flex: 1;

    .orderBox {
      position: relative;
      width: 712rpx;
      height: auto;
      margin: 24rpx auto 0;
      background: #ffffff;
      padding: 18rpx;
      border-radius: 6rpx;

      .topBox {
        position: absolute;
        right: 24rpx;
        height: auto;
        justify-content: space-between;
        font-size: 25rpx;
        color: #8f8f8f;

        .status {
          color: #ff6ca0;
        }
      }

      .shopBox {
        width: 100%;
        height: auto;
        margin-top: 12rpx;
        display: flex;

        image {
          width: 180rpx;
          min-width: 180rpx;
          height: 180rpx;
          border-radius: 6rpx;
        }

        .nameBox {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 24rpx;

          .name {
            font-size: 32rpx;
            font-weight: bold;
            display: flex;
            align-items: center;

            .xu {
              border-radius: 5rpx;
              border: 1rpx solid #ff6ca0;
              font-weight: 500;
              font-size: 22rpx;
              line-height: 1;
              padding: 4rpx;
              color: #ff6ca0;
              margin-left: 14rpx;
            }
          }

          .box {
            font-size: 28rpx;
            color: #828282;
            margin-top: 10rpx;
          }

          .money {
            font-weight: 500;
            font-size: 37rpx;
            color: #ff6ca0;
            line-height: 51rpx;
          }

          .time {
            font-weight: 500;
            font-size: 28rpx;
            color: #ff6ca0;
          }
        }
      }

      /deep/ .u-cell__body {
        padding: 8rpx 0;
      }

      .weixin-service {
        font-size: 12px;
        color: #333;
        display: block;
        padding: 0;
        text-align: left;
        background-color: transparent;
        line-height: 30rpx;
      }

      .buttonBox {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: flex-end;
        margin-top: 20rpx;
        padding: 23rpx 0 10rpx;
        border-top: 1rpx solid #eee;

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
          margin-left: 14rpx;
        }
        .ready {
          background: linear-gradient(
            180deg,
            #ade837 0%,
            #72aa11 100%
          ) !important;
          color: #ffffff !important;
        }

        .light {
          background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
          color: #763030;
          border: none;
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
    margin: 30rpx 0;
    text-align: center;
    color: #888;
    font-size: 24rpx;
  }
}
</style>
