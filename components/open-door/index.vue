<template>
  <u-overlay :show="visible" @click="close">
    <view class="warp">
      <view class="rect" @tap.stop>
        <image
          class="header"
          src="../../static/images/v2/open-door.webp"
          mode="widthFix"
        />
        <view class="close" @click="close">
          <u-icon name="close"></u-icon>
        </view>
        <view class="button-box">
          <button class="button ok" :class="ready ? 'ready' : ''" @click="open">
            一键开锁
          </button>
          <button class="button ok" @click="doing">密码开锁</button>
          <button class="button ok" @click="doing">扫码开锁</button>
        </view>
      </view>
    </view>
  </u-overlay>
</template>

<script>
import { openDoorStoreOrStoreRoom } from "@/api/mtstore";
import { getOrderListByUserId, getStoreRoomDevice } from "@/api/order";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    ready: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },

  methods: {
    close() {
      this.$emit("close");
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      if (!lat2 || !lon2) {
        return 0;
      }
      const R = 6371; // 地球半径，单位是千米
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance; // 返回的是千米
    },
    async open() {
      uni.showLoading({ title: "开门中...", mask: true });

      try {
        // // 获取可以开门的订单
        // let param = {
        //   startFlag: 5, // 5 标识查询服务中或待命中的订单, 续费只可以续费服务中的
        // };
        // const { data } = await getOrderListByUserId(param);
        // 如果有正在服务中的, 那么可以开门
        if (this.order && Object.keys(this.order).length > 0) {
          // const target = data[0]; // 取第一个

          if (this.order.serviceStatus != 1 && this.order.serviceStatus != 3) {
            throw { msg: "当前订单不支持开始" };
          }

          const { id } = this.order;

          let paramData = {
            storeId: this.order.storeId,
            storeRoomId: this.order.storeRoomId,
          };
          const roomDevice = await getStoreRoomDevice(paramData);
          const tempSwitchDeviceList = roomDevice.data;
          // 获取大门锁Id
          let switchId = tempSwitchDeviceList?.[0].switchId;
          if (!switchId) {
            throw { msg: "当前门店未配置门锁" };
          }
          // 判断当前用户位置是否在门店附近
          //门店经纬度
          let storeLongitude = tempSwitchDeviceList?.[0].longitude;
          let storeLatitude = tempSwitchDeviceList?.[0].latitude;
          const that = this;
          //用户定位经纬度
          await uni.getLocation({
            type: "gcj02",
            async success(res) {
              let longitude = res.longitude;
              let latitude = res.latitude;
              //计算距离
              let distance = that.calculateDistance(
                latitude,
                longitude,
                storeLatitude,
                storeLongitude
              );
              distance = 1;
              console.log(distance);
              if (distance > 1) {
                uni.showToast({
                  title: "您的当前位置不在门店附近，请到达门店后再操作开门",
                  icon: "none",
                  duration: 3000,
                });
                return;
              } else {
                // 开门
                try {
                  const openDoorRes = await openDoorStoreOrStoreRoom({
                    orderId: id,
                    switchid: switchId,
                  });
                  uni.hideLoading();
                  if (openDoorRes.status == 200) {
                    uni.showToast({
                      title: openDoorRes.data || "服务器开小差了",
                      icon: "none",
                    });

                    that.close();

                    that.$emit("success");
                  } else {
                    uni.showToast({
                      title: openDoorRes.msg || "服务器开小差了",
                      icon: "none",
                    });
                  }
                } catch (err) {
                  uni.hideLoading();
                  uni.showToast({
                    title: err.data || "开门失败请联系客服",
                    icon: "none",
                  });
                }
              }
            },
            fail(err) {
              console.log(
                err,
                "获取经纬度失败，需要提示用户确认开门后，服务就开始计时"
              );
              //TODO 加一个交互弹窗
              uni.showToast({
                title: "确认开门后，服务就开始计时了哦",
                icon: "none",
                duration: 3000,
              });
            },
          });
        } else {
          uni.hideLoading();
          uni.showToast({
            title: "目前暂无即将开始的订单",
            icon: "none",
          });
        }
      } catch (err) {
        console.log(err, "open - catch");
        uni.hideLoading();
        uni.showToast({
          title: err.msg || err.message || "服务器开小差了",
          icon: "none",
        });
      }
    },

    doing() {
      uni.showToast({
        title: "功能建设中...",
        icon: "none",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.warp {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.rect {
  width: 400rpx;
  padding: 75rpx 30rpx;
  background: linear-gradient(180deg, #ffbccc, #fff8fc);
  border-radius: 24rpx;
  position: relative;

  .header {
    position: absolute;
    width: 176rpx;
    top: -60rpx;
    left: 50%;
    transform: translateX(-50%);
  }

  .close {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
  }

  .button-box {
    margin-top: 24rpx;

    .button {
      border-radius: 44rpx;
      height: 64rpx;
      width: 80%;
      margin: 0 auto;
      font-weight: 500;
      font-size: 24rpx;
      color: #763030;
      line-height: 34rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24rpx;
      background: linear-gradient(180deg, #ffe7f0, #ffb8d3);
      border: 1rpx solid #fff;
      box-shadow: 2rpx 2rpx 1rpx rgba(114, 109, 109, 0.26);
    }
    .ready {
      background: linear-gradient(180deg, #ade837 0%, #72aa11 100%) !important;
      color: #ffffff !important;
      .zh {
        color: #ffffff !important;
      }
    }
  }
}
</style>
