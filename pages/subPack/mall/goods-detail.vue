<template>
  <view v-show="!isLoading" class="container">
    <!-- 商品图片轮播 -->
    <SlideImage v-if="!isLoading" :images="goods.images" />

    <!-- 商品信息 -->
    <view v-if="!isLoading" class="goods-info">
      <view class="info-item info-item__top dis-flex flex-y-end">
        <text class="floor-price">￥{{ goods.price }}</text>
      </view>
      <view class="info-item info-item__name dis-flex flex-y-center">
        <view class="goods-name flex-box">
          {{ goods.name }}
        </view>
      </view>
    </view>

    <!-- 选择商品规格 -->
    <view class="goods-choice b-f">
      <view class="choice-item">
        <view class="flex-box">
          <text class="col-8 tag">服务</text>
          <text> 7天无理由退货 · 晚发必赔 · 极速退款 </text>
        </view>
        <view class="f-26 col-9 t-r">
          <text class="iconfont icon-xiangyoujiantou"></text>
        </view>
      </view>

      <view
        v-if="goods.isSingleSpec == 'N'"
        class="choice-item"
        @click="onShowSkuPopup(3)"
      >
        <view class="flex-box">
          <text class="col-8 tag">规格</text>
          <text
            class="choice-name"
            v-for="(item, index) in goods.specList"
            :key="index"
          >
            {{ item.name }}
          </text>
        </view>
        <view class="f-26 col-9 t-r">
          <text class="iconfont icon-xiangyoujiantou"></text>
        </view>
      </view>
    </view>

    <!-- 评价 -->
    <view v-if="!isLoading" class="goods-content b-f">
      <view class="title">
        <text>商品评价</text>
      </view>
      <view class="content">
        <view class="item-title">
          <view>****</view>
          <view class="count">1个</view>
        </view>
        <view class="item-content">好东西， 值得购买！</view>
      </view>

      <view class="content">
        <view class="item-title">
          <view>****</view>
          <view class="count">1个</view>
        </view>
        <view class="item-content">好东西， 值得购买！</view>
      </view>
    </view>

    <!-- 商品描述 -->
    <view v-if="!isLoading" class="goods-content b-f detail-margin">
      <view class="title b-f">
        <text>商品详情</text>
      </view>
      <block v-if="goods.description != ''">
        <view class="goods-content-detail b-f">
          <jyf-parser :html="goods.description"></jyf-parser>
        </view>
      </block>
      <empty v-else tips="亲，暂无商品描述" />
    </view>

    <view class="footer-fixed">
      <view class="footer-container">
        <view class="foo-item-fast">
          <view class="fast-item" @click="onTargetHome">
            <view class="fast-icon">
              <text class="iconfont icon-shouye"></text>
            </view>
            <view class="fast-text">
              <text>首页</text>
            </view>
          </view>
          <!-- <view class="fast-item">
            <view class="fast-icon">
              <text class="iconfont icon-shoucang"></text>
            </view>
            <view class="fast-text">
              <text>收藏</text>
            </view>
          </view> -->
          <view class="fast-item" @click="onTargetCart">
            <u-badge
              absolute
              max="99"
              :offset="[0, 0]"
              :value="cartTotal"
            ></u-badge>
            <view class="fast-icon">
              <text class="iconfont icon-gouwuche"></text>
            </view>
            <view class="fast-text">
              <text>购物车</text>
            </view>
          </view>
        </view>
        <view class="foo-item-btn">
          <view class="btn-item btn-item-deputy" @click="onShowSkuPopup(2)">
            加入购物车
          </view>
          <view class="btn-item btn-item-main" @click="onShowSkuPopup(3)">
            立即购买
          </view>
        </view>
      </view>
    </view>

    <!-- 商品SKU弹窗 -->
    <SkuPopup
      v-if="!isLoading"
      v-model="showSkuPopup"
      :skuMode="skuMode"
      :goods="goods"
      :isAI="isAI"
      @addCart="onAddCart"
    />
  </view>
</template>

<script>
//import { setCartTabBadge, setCartTotalNum } from '@/utils/app'
import { setCartTabBadge, setCartTotalNum } from "@/api/cart";
import * as GoodsApi from "@/api/goods";
import * as CartApi from "@/api/cart";
import jyfParser from "@/components/jyf-parser/jyf-parser";
import Shortcut from "@/components/shortcut";
import SlideImage from "../components/SlideImage";
import SkuPopup from "../components/SkuPopup";

export default {
  components: {
    jyfParser,
    Shortcut,
    SlideImage,
    SkuPopup,
  },
  data() {
    return {
      isAI: 0,
      // 正在加载
      isLoading: true,
      // 当前商品ID
      goodsId: null,
      // 商品详情
      goods: {},
      // 购物车总数量
      cartTotal: 0,
      // 显示/隐藏SKU弹窗
      showSkuPopup: false,
      // 模式 1:都显示 2:只显示购物车 3:只显示立即购买
      skuMode: 1,
      storeId: 0,
      storeRoomId: 0,
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = this;
    // 商品ID
    this.goodsId = parseInt(options.goodsId);
    console.log("options-storeId:" + options.storeId);
    console.log("options-storeRoomId:" + options.storeRoomId);
    this.storeId = options.storeId;
    this.storeRoomId = options.storeRoomId;
    this.isAI = options.isAI;
    if (app.storeId > 0 && app.storeRoomId > 0) {
    }
    // 加载页面数据
    this.onRefreshPage();
  },

  methods: {
    // 刷新页面数据
    onRefreshPage() {
      const app = this;
      app.isLoading = true;
      Promise.all([app.getGoodsDetail(), app.getCartTotal()]).finally(
        () => (app.isLoading = false)
      );
    },

    // 获取商品信息
    getGoodsDetail() {
      const app = this;
      return new Promise((resolve, reject) => {
        GoodsApi.detail(app.goodsId)
          .then((result) => {
            const goodsData = result.data;
            if (goodsData.skuList) {
              goodsData.skuList.forEach(function (sku, index) {
                goodsData.skuList[index].specIds = sku.specIds.split("-");
                goodsData.skuList[index].skuId = sku.id;
              });
            }
            app.goods = goodsData;
            app.goods.storeRoomId = app.storeRoomId;
            app.skuMode = 3;
            resolve(result);
          })
          .catch((err) => reject(err));
      });
    },

    // 获取购物车总数量
    getCartTotal() {
      const app = this;
      return new Promise((resolve, reject) => {
        CartApi.list(null, null, null, null, null, null, app.storeId)
          .then((result) => {
            app.cartTotal = result.data.totalNum;
            setCartTotalNum(app.cartTotal);
            setCartTabBadge();
            resolve(result);
          })
          .catch((err) => reject(err));
      });
    },

    // 更新购物车数量
    onAddCart() {
      this.$toast("添加购物车成功");
      this.getCartTotal();
    },

    /**
     * 显示/隐藏SKU弹窗
     * @param {skuMode} 模式 1:都显示 2:只显示购物车 3:只显示立即购买
     */
    onShowSkuPopup(skuMode = 1) {
      this.skuMode = skuMode;
      this.showSkuPopup = !this.showSkuPopup;
    },

    // 跳转到首页
    onTargetHome(e) {
      uni.navigateTo({
        url: "/pages/subPack/mall/index",
      });
    },

    // 跳转到购物车页
    onTargetCart() {
      // this.$navTo("pages/subPack/mall/cart");
      uni.navigateTo({
        url: "/pages/subPack/mall/cart",
      });
    },
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    const app = this;
    // 构建页面参数
    const params = app.$getShareUrlParams({
      goodsId: app.goodsId,
    });
    return {
      title: app.goods.name,
      imageUrl: app.goods.images[0],
      path: `/pages/goods/detail?${params}`,
    };
  },

  /**
   * 分享到朋友圈
   * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
   * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
   */
  onShareTimeline() {
    const app = this;
    // 构建页面参数
    const params = app.$getShareUrlParams({
      goodsId: app.goodsId,
    });
    return {
      title: app.goods.name,
      imageUrl: app.goods.images[0],
      path: `/pages/goods/detail?${params}`,
    };
  },
};
</script>

<style>
page {
  background: #fafafa;
}
</style>
<style lang="scss" scoped>
.container {
  padding-bottom: 112rpx;
  overflow: auto;
}

/* 商品信息 */
.goods-info {
  background: #f6f5f5;
  padding: 25rpx 30rpx;
}

.info-item__top {
  min-height: 40rpx;
  margin-bottom: 20rpx;
}

/* 商品价 */
.floor-price {
  font-weight: 500;
  font-size: 42rpx;
  color: #ff6ca0;
  margin-bottom: -2rpx;
}

.info-item__name .goods-name {
  font-weight: 600;
  font-size: 30rpx;
  color: #000000;
  line-height: 42rpx;
}

// 选择商品规格
.goods-choice {
  width: 94%;
  margin: 0 auto;
  border-radius: 20rpx;
  padding: 26rpx 30rpx;
  font-size: 24rpx;

  .choice-item {
    display: flex;
    align-items: center;

    &:not(:nth-child(1)) {
      margin-top: 16rpx;
    }

    .tag {
      margin-right: 16rpx;
    }

    .choice-name {
      margin-right: 10rpx;
    }

    .iconfont {
      font-size: 24rpx;
    }
  }
}

/* 商品详情 */
.goods-content {
  width: 94%;
  margin: 20rpx auto 20rpx;
  border-radius: 20rpx;
  padding: 26rpx 30rpx;
  font-size: 24rpx;

  .title {
    font-weight: 600;
    font-size: 28rpx;
    color: #000000;
    line-height: 39rpx;
  }

  .content {
    padding: 32rpx 0;
    border-bottom: 1rpx solid #eee;

    .item-title {
      font-size: 23rpx;
      color: #999999;
      line-height: 33rpx;
      display: flex;

      .count {
        margin-left: 10rpx;
      }
    }

    .item-content {
      font-size: 23rpx;
      color: #000000;
      line-height: 33rpx;
    }
  }
}

.detail-margin {
  margin: 20rpx auto 100rpx;
}

/* 底部操作栏 */
.footer-fixed {
  position: fixed;
  bottom: var(--window-bottom);
  left: 0;
  right: 0;
  display: flex;
  height: 180rpx;
  z-index: 11;
  box-shadow: 0rpx -1rpx 10rpx 2rpx rgba(0, 0, 0, 0.09);
  border-radius: 17rpx 17rpx 0rpx 0rpx;
  background: #fff;
}

.footer-container {
  width: 100%;
  display: flex;
  padding: 0 40rpx;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.foo-item-fast {
  line-height: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .fast-item {
    position: relative;
    padding: 4rpx 10rpx;
    line-height: 1;
    text-align: center;
    margin-right: 30rpx;

    .fast-icon {
      margin-bottom: 6rpx;
    }

    .fast-icon {
      font-size: 46rpx;
    }

    .fast-text {
      font-size: 24rpx;
    }
  }
}

.foo-item-btn {
  flex: 1;
  height: 95rpx;
  display: flex;
  align-items: center;
  border-radius: 48rpx;
  overflow: hidden;

  .btn-item {
    height: 95rpx;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 26rpx;
  }

  .btn-item-deputy {
    background: #ffe3ed;
    color: #ff6ca0;
  }

  .btn-item-main {
    background: #ff6ca0;
    color: #ffffff;
  }
}
</style>
