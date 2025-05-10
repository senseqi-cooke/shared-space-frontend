<template>
  <u-overlay :show="visible" @click="close">
    <view class="warp">
      <view class="rect" @tap.stop>
        <image
          class="header"
          src="../../static/images/v2/huiyuan.webp"
          mode="widthFix"
        />
        <view>
          <view class="title">会员(消费一次成会员)</view>
          <view class="desc">
            分享一个顾客分红<text class="large">20%</text>
          </view>
          <view class="tip">
            成为会员后, 本平台会为您生成属于您自己的推广小程序和二维码。
          </view>
        </view>

        <view class="mt">
          <view class="title">代理商(推荐两个顾客成代理商)</view>
          <view class="desc">
            1. 分享一个顾客分红<text class="large">25%</text>
          </view>
          <view class="desc">
            2. 间接一个顾客分红<text class="large">10%</text>
          </view>
        </view>
        <view class="button-box">
          <view class="button cancel" @click="close">取消</view>
          <view class="button ok" @click="confirm">确定</view>
        </view>
      </view>
    </view>
  </u-overlay>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm")
    }
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
  width: 460rpx;
  padding: 75rpx 30rpx 20rpx;
  background: linear-gradient(180deg, #ffbccc, #fff8fc);
  border-radius: 24rpx;
  position: relative;

  .header {
    position: absolute;
    width: 176rpx;
    top: -50rpx;
    left: 50%;
    transform: translateX(-50%);
  }

  .title {
    font-weight: 600;
    font-size: 24rpx;
    color: #763030;
    line-height: 24rpx;
    letter-spacing: 1px;
  }

  .desc {
    margin-top: 14rpx;
    font-size: 20rpx;
    color: #666666;
    line-height: 35rpx;
    letter-spacing: 1px;

    .large {
      font-size: 28rpx;
      color: #ff0000;
    }
  }

  .mt {
    margin-top: 20rpx;
  }

  .tip {
    margin-top: 14rpx;
    font-size: 20rpx;
    color: #763030;
    line-height: 35rpx;
    letter-spacing: 1px;
  }

  .button-box {
    display: flex;
    margin-top: 24rpx;
    justify-content: space-between;

    .button {
      border-radius: 44rpx;
      height: 64rpx;
      width: 170rpx;
      font-weight: 500;
      font-size: 24rpx;
      color: #763030;
      line-height: 34rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .cancel {
      border: 2rpx solid #ff639e;
    }

    .ok {
      background: linear-gradient(180deg, #ffe7f0, #ffb8d3);
      border: 1rpx solid #fff;
      box-shadow: 2rpx 2rpx 1rpx rgba(114, 109, 109, 0.26);
    }
  }
}
</style>
