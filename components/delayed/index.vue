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

        <view class="orderBox">
          <view class="topBox">
            <text style="font-size: 25rpx">
              服务时间: {{ formatDateTime(target.teaServerStartTime) }}
            </text>
            <text class="status" v-if="target.orderStatus == 0"> 未支付 </text>
            <text class="status" v-if="target.orderStatus == 1"> 待使用 </text>
            <text class="status" v-if="target.orderStatus == 2"> 服务中 </text>
            <text class="status" v-if="target.orderStatus == 3"> 已取消 </text>
            <text class="status" v-if="target.orderStatus == 4"> 已完成 </text>
            <text class="status" v-if="target.orderStatus == 5"> 已退款 </text>
          </view>
          <view class="shopBox">
            <image :src="target.icon" mode="widthFix"></image>
            <view class="nameBox">
              <view>
                <view class="name">
                  {{ target.storeName }}
                </view>
                <view class="box">
                  {{ target.storeRoomName }}
                </view>
              </view>
              <view class="money"> ￥{{ target.orderMondey }}元 </view>
            </view>
          </view>
          <view class="buttonBox">
            <view>请选择续费时长：</view>
            <view
              v-for="item in minuteList"
              :key="item.id"
              class="button"
              :class="current === item.id ? 'light' : ''"
              @click="current = item.id"
            >
              {{ item.minName }}
            </view>
          </view>
        </view>

        <view class="button-box">
          <view class="button ok" @click="confirm">选好了</view>
        </view>
      </view>
    </view>
  </u-overlay>
</template>

<script>
import { objectToQueryString } from "@/utils/index";
import { getStoreRoomRenewalMinute } from "@/api/order";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    target: {
      type: Object,
    },
  },
  data() {
    return {
      current: 30,
      minuteList: [],
    };
  },

  created() {
    this.fetch();
  },

  methods: {
    fetch() {
      getStoreRoomRenewalMinute().then((res) => {
        const { data } = res;
        const { content } = data;
        this.minuteList = content;
        this.current = content?.[0].id;
      });
    },

    // 格式化时间
    formatDateTime(timeStr) {
      try {
        return formatDateTimeByTimeZone(timeStr);
      } catch (err) {
        return "-";
      }
    },

    close() {
      this.$emit("close");
    },

    confirm() {
      if (!this.current) {
        uni.showToast({ title: "请选择续订时长", icon: "none" });
        return;
      }
      const url = "/pages/subPack/orderList/closeAccount";
      const serverTime = this.minuteList.find(
        (el) => el.id === this.current
      ).minNum;

      const query = {
        packageId: this.target.packageId,
        serverTime,
        storeId: this.target.storeId,
        storeName: this.target.storeName,
        isRepeat: 1,
        parentOrderId: this.target.id,
        minId: this.current
      };

      const queryString = objectToQueryString(query || {});
      uni.navigateTo({
        url: `${url}?${queryString}`,
      });

      this.close();
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
  width: 90%;
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

  .orderBox {
    width: 100%;
    height: auto;
    margin: 24rpx auto 0;
    background: #ffffff;
    padding: 18rpx;
    border-radius: 6rpx;

    .topBox {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: space-between;
      font-size: 30rpx;
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
      }

      .nameBox {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 24rpx;

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
          font-weight: 500;
          font-size: 37rpx;
          color: #ff6ca0;
          line-height: 51rpx;
        }
      }
    }

    .buttonBox {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30rpx;
      padding: 23rpx 0 10rpx;
      border-top: 1rpx solid #eee;
      font-weight: 600;
      font-size: 21rpx;
      color: #ff6ca0;

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

      .light {
        background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
        color: #763030;
        border: none;
      }
    }
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
  }
}
</style>
