<template>
  <view class="container">
    <view class="success">
      <view v-if="isSuccess" class="result">
        <u-icon
          name="checkmark-circle-fill"
          color="#06b464"
          size="120rpx"
        ></u-icon>
        <text class="text">恭喜，支付成功！</text>
      </view>
      <view v-if="!isSuccess" class="result">
        <u-icon name="close-circle-fill" color="#e45656" size="120rpx"></u-icon>
        <text class="text">
          {{ message ? `支付失败：${message}` : "哎呀，支付失败啦~" }}
        </text>
      </view>

      <view class="cell">
        <view class="title">支付金额</view>
        <view class="pink">
          {{ (+query.price || 0).toFixed(2) }}
        </view>
      </view>
      <view class="cell">
        <view class="title">支付方式</view>
        <view class="value">微信支付</view>
      </view>
      <view class="cell">
        <view class="title">下单时间</view>
        <view class="value">{{ formatTimestamp(query.timeStamp) }}</view>
      </view>
      <u-line margin="30rpx 0"></u-line>
      <view class="cell">
        <view class="title">支付订单</view>
        <view class="value">{{ query.orderNo }}</view>
      </view>
      <view class="cell">
        <view class="title">支付内容</view>
        <view class="value">{{ query.desc }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      query: {},
      isSuccess: false,
      message: "",
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 当前页面参数
    this.isSuccess = !!+options.status;

    this.query = options;
  },

  methods: {
    formatTimestamp(timestamp) {
      try {
        const date = new Date(+timestamp);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDate;
      } catch (err) {
        return "-";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  width: 100%;
  height: 100%;
}

.success {
  width: 100%;
  text-align: center;
  padding: 100rpx 0 60rpx;

  .result {
    display: flex;
    flex-direction: column;
    align-items: center;

    .text {
      margin-top: 36rpx;
      font-weight: 600;
      font-size: 29rpx;
      color: #333333;
      line-height: 41rpx;
    }
  }

  .cell {
    width: 100%;
    padding: 16rpx 30rpx;
    display: flex;
    justify-content: space-between;

    &:nth-child(1) {
      margin-top: 60rpx;
    }

    .title {
      font-weight: 600;
      font-size: 29rpx;
      color: #333333;
      line-height: 41rpx;
    }

    .value {
      font-size: 27rpx;
      color: #999999;
      line-height: 38rpx;
      max-width: 70%;
    }

    .pink {
      font-weight: 500;
      font-size: 35rpx;
      color: #ff6ca0;
      line-height: 49rpx;
    }
  }
  .options {
    width: 640rpx;
    height: 98rpx;
    background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
    border-radius: 30rpx;
    font-weight: 500;
    font-size: 29rpx;
    color: #763030;
    line-height: 41rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 60rpx auto 0;
  }
}
</style>
