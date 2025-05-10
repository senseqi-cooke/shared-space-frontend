<!-- 订单结算页 -->
<template>
  <view class="closeAccount">
    <view class="pay-time">
      <view class="payText"> 剩余支付时间 </view>
      <view class="time">
        {{ formatTime }}
      </view>
    </view>

    <view class="header-box">
      <view class="room-box">
        <image
          src="https://ss-admin-api.wgjpt.cn/file/other/20241008140221447091.webp"
          mode="widthFix"
        ></image>
        <view class="name-box">
          <view class="name">
            午夜时空·{{miniappName||'体验馆'}}
          </view>
          <view class="package-name">
            {{ query.description }}
          </view>
          <view class="money">
            <text>￥</text>
            {{ formatMoney(query.price)
            }}{{ query.unit ? `/${query.unit}天` : "" }}
          </view>
        </view>
      </view>
    </view>

    <view class="payment-box">
      <view class="title"> 支付方式 </view>

      <view class="cell-box">
        <u-radio-group v-model="payType" @change="changePayType">
          <view class="cell" @click="changePayType('weChat')">
            <view class="left">
              <image src="../../../static/images/weixin.png" mode=""></image>
              微信支付
            </view>
            <u-radio activeColor="#ff6ba0" name="weChat" />
          </view>
        </u-radio-group>
      </view>
    </view>

    <view class="bottomBox">
      <view class="moneyBox">
        <text>￥{{ formatMoney(query.price) }}元</text>
      </view>
      <view class="buttonBox" @click="submitPayment"> 确定支付 </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { becomeAgent } from "@/api/tojoin";
import { weappPay } from "@/libs/wechat";

const COUNT_DOWN = 30; // 倒计时时长

function queryStringToObject(obj) {
  let res = {};
  for (let key in obj) {
    res[key] = decodeURIComponent(obj[key]);
  }
  return res;
}

export default {
  data() {
    return {
      totalSeconds: 0, // 转换为秒
      countdownInterval: null, // 倒计时计时器

      query: {},
      typeName: "",

      payType: "weChat", // 支付方式
      miniappSiteType:"list",
      miniappName:"共享茶舍",
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),

    formatTime() {
      const min = Math.floor(this.totalSeconds / 60);
      const sec = this.totalSeconds % 60;
      return `${min} : ${sec < 10 ? "0" : ""}${sec}`;
    },
  },

  onLoad(options) {
    this.init(options);
  },

  beforeDestroy() {
    this.stopTimer();
  },

  methods: {
    async init(options) {
      await this.fullDataByQuery(options);

      this.resetTimer(); // 初始化倒计时
      // 获取是否体验版
      let { miniappSiteType,miniappName } = JSON.parse(
          uni.getStorageSync("miniappSetting") || "{}"
      );
      this.miniappSiteType = miniappSiteType || "list";
      // 获取标题名字
      this.miniappName = miniappName || "共享茶舍";
    },

    async fullDataByQuery(options) {
      this.query = { ...queryStringToObject(options) };
      console.log(this.query, "query");
    },

    startTimer() {
      this.countdownInterval = setInterval(() => {
        if (this.totalSeconds > 0) {
          this.totalSeconds--;
        } else {
          this.stopTimer();
          uni.showToast({
            title: "当前订单超时支付，已取消",
            icon: "none",
          });

          uni.navigateBack({
            delta: 1,
          });
        }
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    },

    resetTimer() {
      this.stopTimer();
      this.totalSeconds = COUNT_DOWN * 60;
      this.startTimer();
    },

    changePayType(type) {
      this.payType = type;
    },

    // 截取当前数据到小数点后两位
    formatMoney(value) {
      let realVal = parseFloat(value).toFixed(2);
      return realVal;
    },

    /******* api *********/
    // 支付
    async submitPayment() {
      uni.showLoading({ title: "支付中", mask: true });
      try {
        const params = {
          agentType: this.query.type, // 代理商类型
          isOpenStore: "1", // 是否开通店铺, 先统一都传是
        };
        const { status, data } = await becomeAgent(params);
        const { payment } = data;

        if (status === 200) {
          // 微信支付
          console.log("payment:", JSON.stringify(payment));
          await weappPay(payment);

          const { timeStamp, appOrderNo, orderRemark } = payment;
          uni.navigateTo({
            url: `/pages/subPack/jointStore/payResult?status=1&timeStamp=${timeStamp}&orderNo=${appOrderNo}&price=${this.query.price}&desc=${orderRemark}`,
          });
        } else {
          uni.showToast({
            title: "支付请求失败",
            icon: "none",
            duration: 2000,
          });
          uni.navigateTo({
            url: `/pages/subPack/jointStore/payResult?status=0`,
          });
        }
      } catch (err) {
        uni.showToast({
          title: err.msg || "支付过程中发生错误",
          icon: "none",
          duration: 2000,
        });
        console.log(err);
      } finally {
        uni.hideLoading();
      }
    },
  },
};
</script>

<style>
page {
  background: #f7f7f7;
}
</style>

<style lang="scss" scoped>
.closeAccount {
  width: 100%;
  height: auto;

  .pay-time {
    width: 100%;
    padding: 50rpx 0 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .payText {
      font-weight: 600;
      font-size: 33rpx;
      color: #333333;
      line-height: 45rpx;
    }

    .time {
      margin-top: 20rpx;
      background: #ff6ca0;
      border-radius: 26rpx;
      padding: 4rpx 30rpx;
      font-size: 38rpx;
      color: #ffffff;
    }
  }

  .deposit-tip {
    width: 100%;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-weight: 600;
      font-size: 33rpx;
      color: #333333;
      line-height: 45rpx;
    }

    .desc {
      font-size: 27rpx;
      color: #666666;
      line-height: 38rpx;
      margin-top: 20rpx;
      text-align: center;
    }
  }

  .header-box {
    width: 728rpx;
    margin: 0 auto;
    padding: 40rpx 30rpx;
    background: #fff;

    .room-box {
      display: flex;
      align-items: center;

      image {
        width: 180rpx;
        height: 180rpx;
        border-radius: 20rpx;
      }

      .name-box {
        flex: 1;
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .name {
          font-weight: 600;
          font-size: 31rpx;
          color: #333333;
          line-height: 43rpx;
          letter-spacing: 2px;
        }

        .package-name {
          font-size: 27rpx;
          color: #666666;
          line-height: 38rpx;
        }

        .money {
          font-weight: 500;
          font-size: 31rpx;
          color: #ff6ca0;
          line-height: 43rpx;

          text {
            font-size: 24rpx;
          }
        }
      }
    }
  }

  .ticket-box {
    margin-top: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;

    .title {
      font-weight: 500;
      font-size: 28rpx;
      color: #333333;
      line-height: 39rpx;
    }

    .content {
      font-size: 26rpx;
      color: #999999;
      line-height: 37rpx;
    }

    .money {
      font-weight: 500;
      font-size: 35rpx;
      color: #ff6ca0;
    }
  }

  .flow-delivery {
    width: 728rpx;
    margin: 0 auto;
    margin-top: 20rpx;
    padding: 25rpx;
    background: #ffffff;
    border-radius: 13rpx;

    .flow-delivery__detail {
      justify-content: space-between;
    }

    .detail-location {
      font-size: 36rpx;
    }
    .detail-content {
      padding: 0 20rpx;
      .detail-content__title-phone {
        margin-left: 10rpx;
      }
      .detail-content__describe {
        font-size: 28rpx;
        color: #777;
      }
      .address-info {
        .icon {
          float: right;
          font-weight: bold;
        }
      }
      .select-address {
        height: 90rpx;
        line-height: 90rpx;
        .icon {
          margin-left: 15rpx;
        }
      }
    }
    .detail-content__title {
      margin-bottom: 6rpx;
    }
    .store-name,
    .store-phone,
    .store-address {
      margin-bottom: 6rpx;
      font-size: 28rpx;
      color: #777;
    }
  }

  .payment-box {
    width: 728rpx;
    margin: 0 auto;
    margin-top: 20rpx;
    padding: 25rpx;
    background: #ffffff;
    border-radius: 13rpx;

    .title {
      font-weight: 600;
      font-size: 31rpx;
      color: #333333;
      line-height: 43rpx;
      letter-spacing: 2px;
    }

    .cell-box {
      padding: 20rpx 5rpx;
    }

    .cell {
      margin-top: 20rpx;
      font-weight: 500;
      font-size: 29rpx;
      color: #333333;
      line-height: 41rpx;
      letter-spacing: 1px;
      display: flex;
      justify-content: space-between;

      .left {
        display: flex;
        align-items: center;

        image {
          margin-right: 16rpx;
          width: 43rpx;
          height: 43rpx;
        }
      }

      text {
        font-size: 24rpx;
        color: #999;
        font-weight: 400;
        margin-left: 20rpx;
      }
    }
  }

  .bottomBox {
    width: 100%;
    height: 180rpx;
    padding: 30rpx 30rpx 0;
    background: #ffffff;
    box-shadow: 0rpx -1rpx 10rpx 2rpx rgba(0, 0, 0, 0.09);
    border-radius: 17rpx 17rpx 0rpx 0rpx;
    position: fixed;
    bottom: 0rpx;
    left: 0rpx;
    display: flex;
    // align-items: center;
    justify-content: space-between;

    .moneyBox > text:nth-child(1) {
      font-weight: 500;
      font-size: 42rpx;
      color: #ff6ca0;
      line-height: 59rpx;
    }

    .moneyBox > text:nth-child(2) {
      font-weight: 400;
      font-size: 20rpx;
      color: #999999;
      line-height: 28rpx;
      text-decoration-line: line-through;
      margin-left: 10rpx;
    }

    .buttonBox,
    .buttonBoxTwo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 235rpx;
      height: 78rpx;
      background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
      border-radius: 6rpx;
      font-weight: 600;
      font-size: 30rpx;
      color: #763030;
      line-height: 41rpx;
      letter-spacing: 1px;
    }

    .buttonBoxTwo {
      background: #808080;
      color: #fff;
    }
  }
}
</style>
