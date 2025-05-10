<!-- 详情页-快速下单，不需要选时间，选一个套餐就可以了 -->
<template>
  <view class="details">
    <swiper
      autoplay="true"
      class="swiper swiperBox"
      duration="1000"
      indicatorDots="true"
      interval="3000"
    >
      <swiper-item
        class="swiperBox"
        v-for="(image, index) in detail.images"
        :key="image"
        @click="onPreviewImages(index, detail.images)"
      >
        <image class="img swiperBox" mode="heightFix" :src="image"></image>
      </swiper-item>
    </swiper>

    <view class="headerBox">
      <view class="nameBox">
        {{ detail.storeRoomName || "-" }}
      </view>
      <view class="desc">
        <!-- {{ detail.description || "-" }} -->
        <jyf-parser :html="detail.description"></jyf-parser>
      </view>
      <view class="iconBox">
        <view class="icon" v-for="icon of detail.icons" :key="icon">
          {{ icon }}
        </view>
      </view>
    </view>

    <view class="siteBox">
      <view class="site">
        {{ detail.address }}
      </view>
      <view class="btn-box">
        <view class="btn" @click="toMap">
          <u-icon name="map-fill" size="43rpx"></u-icon>
          <view>地图</view>
        </view>
        <view class="btn" @click="call">
          <u-icon name="phone-fill" size="43rpx"></u-icon>
          <view>电话</view>
        </view>
      </view>
    </view>
    <view
      class="package-item"
      v-for="p in packageList"
      :key="p.id"
      @click="toDetail(p.id)"
    >
      <view class="preview">
        <image :src="p.icon" mode="aspectFill"></image>
      </view>
      <view class="content">
        <view class="package-name">{{ p.packageName || "-" }}</view>
        <view class="tags">
          <view class="tag" v-for="tag in formatTag(p.tags)" :key="tag">
            {{ tag }}
          </view>
        </view>
        <view class="bottom">
          <view class="price">￥{{ moneyFilter(p.packagePrice) }}</view>
          <view class="btn">立即体验</view>
        </view>
      </view>
    </view>

    <view
      class="description"
      v-if="detail.roomDescription && detail.roomDescription !== 'undefined'"
    >
      <!-- <view class="title">说明：</view> -->
      <view>
        <!-- {{ detail.roomDescription }} -->
        <jyf-parser :html="detail.roomDescription"></jyf-parser>
      </view>
    </view>
    <view
      class="description-pic"
      v-if="detail.descImage && detail.descImage.length > 0"
    >
      <view class="title">门店详情</view>
      <view
        class="pic"
        v-for="(p, i) in detail.descImage"
        :key="i"
        @click="onPreviewImages(i, detail.descImage)"
      >
        <image mode="widthFix" :src="p"></image>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { goTenXunLoca } from "@/utils/tenxunLoca.js";
import { geStoreDetail, getStoreRoomPackage } from "@/api/store";

function queryStringToObject(obj) {
  let res = {};
  for (let key in obj) {
    res[key] = decodeURIComponent(obj[key]);
  }
  return res;
}

function stringToArray(str) {
  if (str) {
    return str.split(",");
  }
  return [];
}

export default {
  data() {
    return {
      detail: {
        storeId: "",
        roomId: "",
      },
      packageList: [],
    };
  },
  computed: mapGetters(["location", "userInfo"]),
  onLoad(options) {
    this.init(options);
  },

  methods: {
    async init(options) {
      const params = queryStringToObject(options);
      console.log({ options, params });

      const { storeId } = params;
      params.icons = stringToArray(params.icons);
      params.images = stringToArray(params.images);
      params.descImage = stringToArray(params.descImage);
      console.log(params.roomDescription);
      params.roomDescription = decodeURIComponent(params.roomDescription);
      console.log(params.roomDescription);

      if (storeId) {
        this.detail = {
          ...this.detail,
          ...params,
        };
        try {
          const { data } = await geStoreDetail(storeId);
          this.detail = {
            ...this.detail,
            ...data,
          };

          const { data: packageData } = await getStoreRoomPackage({
            storeRoomId: this.detail.roomId,
          });
          console.log(packageData);
          this.packageList = (packageData?.content || [])
            .slice()
            .sort((a, b) => a.packagePrice - b.packagePrice);
        } catch (err) {
          console.log(err);
        }
      }
    },

    formatePrice(money) {
      return parseInt(money);
    },

    moneyFilter(value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2);
      return realVal;
    },

    formatTag(tags) {
      if (tags) {
        return tags.split(",");
      }
      return [];
    },

    // 浏览商品图片
    onPreviewImages(index, arr) {
      uni.previewImage({
        current: arr[index],
        urls: arr,
      });
    },

    toMap() {
      const { address, latitude, longitude } = this.detail;
      goTenXunLoca(address, latitude, longitude);
    },

    call() {
      uni.makePhoneCall({
        phoneNumber: this.detail.phone,
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

    toDetail(id) {
      if (!id) return;

      const url = `/pages/subPack/homePage/packageDetail`;

      uni.navigateTo({
        url: `${url}?packageId=${id}&storeId=${this.detail.storeId}&storeName=${this.detail.storeName}`,
      });
    },
  },
};
</script>

<style>
page {
  background: #efefef;
}
</style>

<style lang="scss" scoped>
.details {
  width: 100%;
  height: auto;
  padding-bottom: 60rpx;

  .swiper {
    background: #f5f5f5;
    height: 414rpx;
  }

  .swiperBox {
    display: flex;
    justify-content: center;

    .img {
      height: 414rpx;
      width: 100%;
    }
  }

  .headerBox {
    width: 100%;
    height: auto;
    background: #fff;
    padding: 30rpx;
    color: #333333;

    .nameBox {
      font-weight: 500;
      font-size: 31rpx;
      line-height: 43rpx;
      letter-spacing: 2px;
    }

    .desc {
      margin-top: 8rpx;
      font-size: 20rpx;
      line-height: 40rpx;
    }

    .iconBox {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 22rpx;

      .icon {
        padding: 2rpx 20rpx;
        border-radius: 5rpx;
        border: 1rpx solid #d7d9de;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 20rpx;
        color: #b2b2b2;
        line-height: 28rpx;
        letter-spacing: 1px;
        text-align: center;
        margin-right: 10rpx;
      }
    }
  }

  .siteBox {
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    width: 100%;
    height: auto;
    background: #fff;
    padding: 20rpx 35rpx;
    color: #333333;

    .site {
      flex: 1;
      font-size: 24rpx;
      line-height: 39rpx;
    }

    .btn-box {
      width: 160rpx;
      padding-right: 20rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 21rpx;
      line-height: 29rpx;
      letter-spacing: 1px;

      .btn {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }

  .description {
    margin-top: 20rpx;
    width: 100%;
    height: auto;
    background: #fff;
    padding: 20rpx 35rpx;
    font-weight: 500;
    font-size: 20rpx;
    color: #333333;
    line-height: 30rpx;

    .title {
      font-size: 24rpx;
      line-height: 39rpx;
    }
  }

  .description-pic {
    margin-top: 20rpx;
    width: 100%;
    height: auto;
    background: #fff;
    padding: 20rpx 30rpx;

    .title {
      font-weight: 500;
      font-size: 24rpx;
      color: #333333;
      line-height: 39rpx;
      text-align: center;
    }

    image {
      margin-top: 10rpx;
      width: 100%;
      height: 100%;
    }
  }

  .package-item {
    width: 100%;
    height: auto;
    background: #fff;
    margin-top: 20rpx;
    padding: 20rpx 30rpx;
    margin-top: 20rpx;
    display: flex;

    .preview {
      width: 194rpx;
      height: 188rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .content {
      flex: 1;
      padding-left: 20rpx;

      .package-name {
        font-size: 28rpx;
        color: #333333;
        line-height: 39rpx;
      }

      .tags {
        margin-top: 20rpx;
        display: flex;

        .tag {
          font-size: 25rpx;
          color: #999999;
          line-height: 35rpx;
          margin-right: 18rpx;
          margin-bottom: 12rpx;
        }
      }

      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price {
          font-weight: 500;
          font-size: 37rpx;
          color: #ff6ca0;
          line-height: 51rpx;
        }

        .btn {
          background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
          border-radius: 5rpx;
          padding: 12rpx 32rpx;
          font-weight: 600;
          font-size: 21rpx;
          color: #763030;
          line-height: 29rpx;
          letter-spacing: 1px;
          margin-right: 8rpx;
        }
      }
    }
  }
}
</style>
