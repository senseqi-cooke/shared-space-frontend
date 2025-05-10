<template>
  <view class="container">
    <view class="banner">
      <view class="vpb">
        <image class="img" mode="heightFix" :src="banner"></image>
      </view>
      <view class="text">
        <view>成人用品外卖仓</view>
        <view class="sm-text">24小时无人值守</view>
      </view>
    </view>

    <view class="content vpb">
      我们成人用品属于利润比较高的产品，品类比较多。所以都能达到百分之部分产品百分之八十的毛利是没有问题的。我们是成人用品运营商，所以我们做的是真正实现了24小时无人仓的操作。在您当地您只需要找个可以办理营业执照的15到30平方的店铺就可以，这样很好的可以节约房租的成本，我们有24小时客服值班人员，百分之百的问题都能给您解决，您只需要定期补货就可以了。一般一个月看您所在的区域，基本上都能有3000以上的收益，根据地段不同，收益也是不同的，像大学城，酒店附近的收益都不错。因为我们的话五到十公里都可以进行消费，所以很稳定。
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      prefix: this.$VUE_APP_PIC_RESOURCES_URL,

      banner: `${this.$VUE_APP_PIC_RESOURCES_URL}/20240923134936665710.webp`,
    };
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.vpb {
  padding: 0 20rpx;
}

.banner {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20rpx 0;

  .img {
    height: 372rpx;
    max-width: 100%;
  }

  .text {
    position: absolute;
    font-size: 38rpx;
    color: #fff;
    top: 140rpx;
    left: 56rpx;

    .sm-text {
      font-style: 24rpx;
      margin-top: 20rpx;
    }
  }
}

.content {
  font-size: 23rpx;
  color: #333333;
  line-height: 52rpx;
}
</style>
