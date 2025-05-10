<template>
  <view class="container">
    <view class="top">
      <view class="custom-nav">
        <view class="content"> 午夜时空·{{ miniappName||'体验馆' }}  </view>
      </view>
      <view class="banner">
        <image v-if="miniappSiteType == 'home'" class="img" mode="heightFix" :src="banner"></image>
      </view>
    </view>

    <view class="grid">
      <view class="card-item" @click="toDetail(22, 1)"  v-if="miniappSiteType == 'home'">
        <image
          class="back-image"
          :src="`${prefix}/20240920174227979895.webp`"
        />
        <view class="column-card">
          <view>加入我们</view>
          <view class="en">JOIN US</view>
        </view>
      </view>

      <view class="card-item" @click="toDetail(18)" v-if="miniappSiteType == 'home'">
        <image
          class="back-image"
          :src="`${prefix}/20240920174239585469.webp`"
        />
        <view class="column-card">
          <view>成为联合创始人</view>
          <view class="en">BECOME A CO-FOUNDER</view>
        </view>
      </view>

      <view class="card-item" @click="toDetail(21)">
        <image
          class="back-image"
          :src="`${prefix}/20240920174245414095.webp`"
        />
        <view class="column-card">
          <view>成为合伙人</view>
          <view class="en">BECOME A PARTNER</view>
        </view>
      </view>

      <view class="card-item" @click="toDetail(17)" v-if="miniappSiteType == 'home'">
        <image
          class="back-image"
          :src="`${prefix}/20241008102543499792.webp`"
        />
        <view class="column-card">
          <view>成为联营商</view>
          <view class="en">BECOME AN ASSOCIATE</view>
        </view>
      </view>

      <view class="card-item" @click="toDetail(19)" v-if="miniappSiteType == 'home'">
        <image
          class="back-image"
          :src="`${prefix}/20240920174233832977.webp`"
        />
        <view class="column-card">
          <view>线上联营商</view>
          <view class="en">ONLINE AFFILIATES</view>
        </view>
      </view>

      <view class="card-item" @click="toDetail(20)">
        <image
          class="back-image"
          :src="`${prefix}/20241008102558258580.webp`"
        />
        <view class="column-card">
          <view>商家入驻</view>
          <view class="en">MERCHANT SETTLEMENT</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      prefix: this.$VUE_APP_PIC_RESOURCES_URL,

      banner: `${this.$VUE_APP_PIC_RESOURCES_URL}/20241008092926893971.webp`,
      miniappSiteType:'list',
      miniappName:'共享茶舍'
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    // 获取是否体验版
    let { miniappSiteType,miniappName } = JSON.parse(
        uni.getStorageSync("miniappSetting") || "{}"
    );
    this.miniappSiteType = miniappSiteType || "list";
    // 获取标题名字
    this.miniappName = miniappName || "共享茶舍";
  },

  methods: {
    toDetail(id, isJoin) {
      this.$yrouter.push({
        path: `/pages/subPack/jointStore/detail?id=${id}&isJoin=${isJoin}`,
      });
    },
  },
};
</script>

<style>
page {
  background-color: #fff;
}
</style>

<style lang="scss" scoped>
.top {
  padding: 0 20rpx;
  background: linear-gradient(180deg, #f8e3f4 0%, #fff 100%);
}

.custom-nav {
  padding-top: 20rpx;

  .content {
    font-weight: 600;
    color: #763030;
    font-size: 33rpx;
  }
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
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-radius: 19rpx;
  overflow: hidden;
  padding: 0 20rpx 40rpx;

  .card-item {
    width: 340rpx;
    height: 168rpx;
    margin-bottom: 40rpx;
    position: relative;
    font-weight: 600;
    font-size: 32rpx;

    &:nth-child(1) {
      color: #008f80;
    }
    &:nth-child(2) {
      color: #ea163a;
    }
    &:nth-child(3) {
      color: #e79f50;
    }
    &:nth-child(4) {
      color: #80158d;
    }
    &:nth-child(5) {
      color: #0d5ab8;
    }
    &:nth-child(6) {
      color: #09a50f;
    }

    .column-card {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      .en {
        font-weight: 300;
        font-size: 15rpx;
        line-height: 22rpx;
        letter-spacing: 2px;
        margin-top: 8rpx;
      }
    }

    .back-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 340rpx;
      height: 168rpx;
    }
  }
}
</style>
