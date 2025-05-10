<template>
  <view class="container">
    <view class="banner">
      <view class="vpb">
        <image class="img" mode="heightFix" :src="banner"></image>
      </view>
      <view class="text">
        <view>成人用品外卖仓</view>
        <view class="sm-text">24小时无人值守</view>
        <view class="btn-box">
          <button class="btn" size="small" @click="learnMore">了解详情</button>
          <button class="btn" size="small" @click="joinUs">加入我们</button>
        </view>
      </view>
    </view>

    <view class="notice">
      <u-notice-bar
        :text="notice"
        color="#763030"
        bgColor="#FFECF0"
      ></u-notice-bar>
    </view>

    <view v-if="cateList.length" class="grid">
      <u-grid :border="false" col="4">
        <u-grid-item
          v-for="(item, index) in cateList"
          :key="index"
          customStyle="padding-top: 10px; padding-bottom: 10px"
          @click="handleSelectNav(item, 'category')"
        >
          <view class="icon-shadow">
            <u-icon :name="item.logo" :size="'100rpx'"></u-icon>
          </view>
          <text class="grid-text">{{ item.name }}</text>
        </u-grid-item>
      </u-grid>
    </view>

    <view v-if="brandList.length" class="grid brands">
      <u-grid :border="false" col="4">
        <u-grid-item
          v-for="(item, index) in brandList"
          :key="index"
          customStyle="padding-top: 10px; padding-bottom: 10px"
          @click="handleSelectNav(item, 'brand')"
        >
          <view class="icon-shadow">
            <u-icon :name="item.logo" :size="'100rpx'"></u-icon>
          </view>
          <text class="grid-text">{{ item.name }}</text>
        </u-grid-item>
      </u-grid>
    </view>
  </view>
</template>

<script>
import * as GoodsApi from "@/api/goods";
import Empty from "@/components/empty";
import Location from "@/components/page/location";

export default {
  components: {
    Empty,
    Location,
  },
  data() {
    return {
      prefix: this.$VUE_APP_PIC_RESOURCES_URL,

      banner: `${this.$VUE_APP_PIC_RESOURCES_URL}/20240923134936665710.webp`,

      notice:
        "诚邀合伙人   无需加盟费   对接多个外卖平台   线上下单   线下骑手取货   只需要1台手机实时看收益   监控店铺   无需守店   无需经验   总部一站式扶持",

      goodsCart: [],

      // 一级分类：指针
      curIndex: 0,

      scrollTop: 0,
      // 分类列表
      cateList: [],
      // 品牌列表
      brandList: [],
      // 正在加载中
      isLoading: true,
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const app = this;
    // 获取页面数据
    app.getPageData();

    uni.getLocation({
      type: "gcj02",
      success(res) {
        uni.setStorageSync("latitude", res.latitude);
        uni.setStorageSync("longitude", res.longitude);
      },
      fail(e) {
        // empty
      },
    });
  },

  methods: {
    /**
     * 获取页面数据
     */
    getPageData() {
      this.isLoading = true;

      GoodsApi.cateList({})
        .then((result) => {
          // 初始化分类列表数据
          const { cateList, brandList } = result.data;
          this.cateList = cateList;
          this.brandList = brandList;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // 一级分类：选中分类
    handleSelectNav(item, type) {
      const { id } = item;
      uni.navigateTo({
        url: `/pages/subPack/mall/goods-list?queryId=${id}&queryType=${type}`,
      });
    },

    learnMore() {
      uni.navigateTo({
        url: `/pages/subPack/mall/learn-more`,
      });
    },

    joinUs() {
      uni.navigateTo({
        url: `/pages/subPack/mall/join-us`,
      });
    },
  },
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
      font-size: 24rpx;
      margin-top: 20rpx;
    }

    .btn-box {
      display: flex;
      margin-top: 32rpx;
    }
  }

  .btn {
    width: 142rpx;
    height: 42rpx;
    border-radius: 21rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18rpx;
    font-weight: bold;
    margin-right: 20rpx;
  }
}

.grid {
  background: #fbd6e6;
  margin: 20rpx 20rpx 0;
  font-size: 23rpx;
  color: #333333;
  line-height: 33rpx;
  border-radius: 30rpx;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .icon-shadow {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50rpx;
    overflow: hidden;
    border: 1rpx solid #eee;
  }

  .grid-text {
    margin-top: 22rpx;
  }
}

.brands {
  background-color: #fff;
}
</style>
