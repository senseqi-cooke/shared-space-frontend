<template>
  <mescroll-body
    ref="mescrollRef"
    :sticky="true"
    @init="mescrollInit"
    :down="{ native: true }"
    @down="downCallback"
    :up="upOption"
    @up="upCallback"
  >
    <!-- 页面头部 -->
    <view v-if="options.queryType !== 'AI'" class="header">
      <u-search
        v-model="search"
        placeholder="搜索商品"
        borderColor="rgb(230, 230, 230)"
        bgColor="#fff"
        @search="handleSearch"
      ></u-search>
    </view>
    <view v-else class="AI-header">
      <image
        src="https://ss-admin-api.wgjpt.cn/file/other/20240929150208913291.webp"
        mode="widthFix"
      ></image>
    </view>

    <!-- 排序标签 -->
    <view class="store-sort">
      <view
        class="sort-item"
        :class="{ active: sortType === 'all' }"
        @click="handleSortType('all')"
      >
        <text>综合</text>
      </view>
      <view
        class="sort-item"
        :class="{ active: sortType === 'sales' }"
        @click="handleSortType('sales')"
      >
        <text>销量</text>
      </view>
      <view
        class="sort-item"
        :class="{ active: sortType === 'price' }"
        @click="handleSortType('price')"
      >
        <text>价格</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <view v-if="list.content.length" class="grid">
      <u-grid :border="false" :col="options.queryType !== 'AI' ? 1 : 2">
        <u-grid-item
          v-for="item in list.content"
          :key="item.id"
          :customStyle="{
            padding: '16rpx',
          }"
          @click="onTargetDetail(item.id, item.type)"
        >
          <view class="grid-item" :class="{ col2: options.queryType === 'AI' }">
            <!-- 商品图片 -->
            <image
              class="image"
              :src="item.logo"
              :mode="options.queryType !== 'AI' ? 'aspectFill' : 'widthFix'"
            ></image>
            <view class="goods-item_info">
              <!-- 商品名称 -->
              <view class="item-name">
                {{ item.name }}
              </view>
              <view
                v-if="item.salePoint && item.salePoint.length"
                class="item-tag-box"
              >
                <view
                  v-for="(tag, ti) in formatStringToArray(item.salePoint)"
                  :key="ti"
                  class="item-tag"
                >
                  {{ tag }}
                </view>
              </view>
              <view class="item-desc">
                <text class="goods-price">¥{{ item.price }}</text>
                <text class="goods-sales">已售{{ item.initSale }}</text>
              </view>
            </view>
          </view>
        </u-grid-item>
      </u-grid>
    </view>
  </mescroll-body>
</template>

<script>
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue";
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
import * as GoodsApi from "@/api/goods";
import { getEmptyPaginateObj, getMoreListData } from "@/utils/app";
import Search from "@/components/search";

const pageSize = 15;
const showViewKey = "GoodsList-ShowView";

export default {
  components: {
    MescrollBody,
    Search,
  },

  mixins: [MescrollMixin],

  data() {
    return {
      isLoading: false,
      showView: true, // 列表显示方式 (true列表、false平铺)
      sortType: "all", // 排序类型
      sortPrice: false, // 价格排序 (true高到低 false低到高)
      options: {}, // 当前页面参数
      search: "",
      list: getEmptyPaginateObj(), // 商品列表数据
      // 上拉加载配置
      upOption: {
        // 首次自动执行
        auto: true,
        // 每页数据的数量; 默认10
        page: { size: pageSize },
        // 数量要大于4条才显示无更多数据
        noMoreSize: 4,
        empty: {
          icon: "https://ss-admin-api.wgjpt.cn/file/other/20240925133932119072.webp",
        },
      },
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 记录options
    this.options = options;
    // 设置默认列表显示方式
    this.setShowView();
  },

  options: {
    styleIsolation: "shared",
  },

  methods: {
    /**
     * 上拉加载的回调 (页面初始化时也会执行一次)
     * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
     * @param {Object} page
     */
    upCallback(page) {
      const app = this;
      // 设置列表数据
      app
        .getGoodsList(page.num)
        .then((list) => {
          const curPageLen = list.content ? list.content.length : 0;
          const totalSize = list.totalElements;
          app.mescroll.endBySize(curPageLen, totalSize);
        })
        .catch(() => app.mescroll.endErr());
    },

    // 设置默认列表显示方式
    setShowView() {
      this.showView = uni.getStorageSync(showViewKey) || true;
    },

    // 点击跳转到首页
    onTargetIndex() {
      this.$navTo("pages/homePage_V2/homePage_V2");
    },

    formatStringToArray(str) {
      try {
        return str.split(",");
      } catch (err) {
        return [];
      }
    },

    /**
     * 获取商品列表
     * @param {number} pageNo 页码
     */
    getGoodsList(pageNo = 1) {
      const app = this;
      console.log(app.options);
      const param = {
        sortType: app.sortType,
        sortPrice: Number(app.sortPrice),
        name: app.search || "",
        page: pageNo,
      };
      const { queryType } = app.options;
      if (queryType === "category") {
        param.cateId = app.options.queryId || 0;
      }
      if (queryType === "brand") {
        param.brandId = app.options.queryId || 0;
      }
      // AI商城
      if (queryType === "AI") {
        param.cateId = app.options.queryId || 0;
      }

      return new Promise((resolve, reject) => {
        GoodsApi.search(param)
          .then((result) => {
            // 合并新数据
            const newList = result.data;
            app.list.content = getMoreListData(newList, app.list, pageNo);
            resolve(newList);
          })
          .catch(reject);
      });
    },

    // 切换排序方式
    handleSortType(newSortType) {
      const app = this;
      const newSortPrice = newSortType === "price" ? !app.sortPrice : true;
      app.sortType = newSortType;
      app.sortPrice = newSortPrice;
      // 刷新列表数据
      app.list = getEmptyPaginateObj();
      app.mescroll.resetUpScroll();
    },

    // 切换列表显示方式
    handleShowView() {
      const app = this;
      app.showView = !app.showView;
      uni.setStorageSync(showViewKey, app.showView);
    },

    // 跳转商品详情页
    onTargetDetail(goodsId, type) {
      this.$navTo(`pages/subPack/mall/goods-detail`, { goodsId, isAI: this.options.queryType === 'AI' ? 1 : 0 });
    },

    //商品搜索
    handleSearch() {
      this.getGoodsList();
    },
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage() {
    // 构建分享参数
    return {
      title: "全部分类",
      path: "/pages/category/index?" + this.$getShareUrlParams(),
    };
  },

  /**
   * 分享到朋友圈
   * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
   * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
   */
  onShareTimeline() {
    // 构建分享参数
    return {
      title: "全部分类",
      path: "/pages/category/index?" + this.$getShareUrlParams(),
    };
  },
};
</script>

<style>
page {
  background-color: #fff;
}
</style>

<style lang="scss" scoped>
// 页面头部
.AI-header {
  width: 100%;

  image {
    width: 100%;
  }
}

.header {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 20rpx 20rpx 0;

  // 搜索框
  .search {
    flex: 1;
  }

  // 切换显示方式
  .show-view {
    width: 60rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 36rpx;
    color: #505050;
  }
}
// 空数据按钮
.empty-ipt {
  width: 220rpx;
  margin: 20rpx auto;
  font-size: 28rpx;
  height: 64rpx;
  line-height: 64rpx;
  text-align: center;
  color: #fff;
  border-radius: 5rpx;
  background: linear-gradient(to right, #00acac, #00acac);
}

// 排序组件
.store-sort {
  position: sticky;
  top: var(--window-top);
  display: flex;
  padding: 20rpx 0;
  font-size: 28rpx;
  background: #fff;
  color: #000;
  z-index: 99;
  border-bottom: 1rpx solid #ddd;

  .sort-item {
    flex-basis: 33.3333%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50rpx;

    &.active {
      color: #fb8fb8;
    }
  }
}

.grid {
  background-color: #fff;

  .grid-item {
    width: 100%;
    display: flex;

    .image {
      width: 265rpx;
      height: 265rpx;
      border-radius: 16rpx;
      overflow: hidden;
    }

    .goods-item_info {
      flex: 1;
      font-weight: 600;
      font-size: 28rpx;
      color: #333333;
      line-height: 39rpx;
      padding: 10rpx 10rpx 0 25rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .item-name {
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        line-clamp: 2;
        -webkit-line-clamp: 2;
      }

      .item-tag-box {
        display: flex;
        flex-wrap: wrap;
      }

      .item-tag {
        background: #ffffff;
        border-radius: 6rpx;
        border: 1rpx solid #ff6ca0;
        font-size: 18rpx;
        color: #ff6ca0;
        line-height: 26rpx;
        padding: 5rpx 12rpx;
        margin-right: 12rpx;
        margin-bottom: 10rpx;
      }

      .item-desc {
        padding-top: 16rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .goods-price {
          font-weight: 500;
          font-size: 37rpx;
          color: #ff6ca0;
          line-height: 51rpx;
        }

        .goods-sales {
          font-size: 22rpx;
          color: #333333;
          line-height: 31rpx;
        }
      }
    }
  }

  .col2 {
    flex-direction: column;

    .image {
      width: 100%;
      height: auto;
    }

    .goods-item_info {
      padding: 10rpx;
    }
  }
}

.bottom-text {
  text-align: center;
  color: #999999;
  font-size: 26rpx;
}
</style>
