<template>
  <view class="container">
    <view v-if="list.length" class="cart-list">
      <u-swipe-action v-for="(item, index) in list" :key="index">
        <u-swipe-action-item
          :options="swipeActionOptions"
          @click.stop.native="handleDelete(item)"
        >
          <view class="cart-item" @click.stop="onTargetGoods(item.goodsId)">
            <label class="item-radio" @click.stop="handleCheckItem(item.id)">
              <radio
                class="radio"
                color="#ff6ca0"
                :checked="inArray(item.id, checkedIds)"
              />
            </label>
            <view class="goods-image">
              <image class="image" :src="item.goodsInfo.logo"></image>
            </view>
            <view class="item-content">
              <view class="goods-title twolist-hidden">
                <text>{{ item.goodsInfo.name }}</text>
              </view>
              <view class="goods-props clearfix">
                <view
                  class="goods-props-item"
                  v-for="(spec, idx) in item.specList"
                  :key="idx"
                >
                  <text>{{ spec.specName }} : {{ spec.specValue }}</text>
                </view>
              </view>
              <!-- 服务 -->
              <view class="goods-props clearfix">
                已选服务:
                <text v-for="(service, idx) in item.addServiceList" :key="idx">
                  {{ service.name }};
                </text>
              </view>
              <view class="item-foot">
                <view class="goods-price">
                  <text class="unit">￥</text>
                  <text class="value">{{ item.goodsInfo.price }}</text>
                </view>
                <view class="stepper">
                  <u-number-box
                    :buttonSize="23"
                    :min="1"
                    :value="item.num"
                    @change="onChangeStepper($event, item)"
                  />
                </view>
              </view>
            </view>
          </view>
        </u-swipe-action-item>
      </u-swipe-action>
    </view>

    <view v-if="list.length" class="footer-fixed">
      <label class="all-radio" @click="handleCheckAll">
        <u-checkbox
          activeColor="#ff6ca0"
          :checked="checkedIds.length > 0 && checkedIds.length === list.length"
          @change.stop="handleCheckAll"
        >
        </u-checkbox>
        <text>全选</text>
      </label>
      <view class="total-info">
        <view class="total-number"> 已选{{ checkedIds.length }}件 </view>
        <view class="total-price">
          <text>合计：</text>
          <view class="goods-price">
            <text class="unit">￥</text>
            <text class="value">{{ totalPrice }}</text>
          </view>
        </view>
      </view>
      <view class="cart-action">
        <view class="btn-wrapper">
          <view
            class="btn-item"
            :class="{ disabled: checkedIds.join() == '' }"
            @click="handleOrder"
          >
            结算{{ checkedIds.length > 0 ? `(${checkedIds.length})` : "" }}
          </view>
        </view>
      </view>
    </view>

    <!-- empty -->
    <empty
      v-if="!list.length"
      :isLoading="isLoading"
      :custom-style="{ padding: '180rpx 50rpx' }"
      :customImageStyle="{ width: '113rpx', height: '109rpx' }"
      emptyPic="https://ss-admin-api.wgjpt.cn/file/other/20240924133215949929.webp"
      tips="还未添加任何商品,去逛逛吧~"
    >
      <view slot="slot" class="empty-ipt" @click="onTargetIndex">
        <text>去逛逛</text>
      </view>
    </empty>
  </view>
</template>

<script>
import { inArray, arrayIntersect, debounce } from "@/utils/util";
import { addDecimals } from "@/utils/index";
//import { checkLogin, setCartTotalNum, setCartTabBadge } from '@/utils/app'
import { setCartTabBadge, setCartTotalNum } from "@/api/cart";
import * as CartApi from "@/api/cart";
import Empty from "@/components/empty";
const CartIdsIndex = "CartIds";
export default {
  components: {
    Empty,
  },
  data() {
    return {
      swipeActionOptions: [
        {
          text: "删除",
          style: {
            backgroundColor: "#f56c6c",
          },
        },
      ],

      inArray,
      // 正在加载
      isLoading: true,
      // 当前模式: normal正常 edit编辑
      mode: "normal",
      // 购物车列表
      list: [],
      // 购物车商品总数量
      total: 0,
      // 选中的商品ID记录
      checkedIds: [],
      // 选中的商品总金额
      totalPrice: "0.00",
      storeId: 0,
      storeRoomId: 0,
      miniappSiteType: "home",
    };
  },
  watch: {
    // 监听选中的商品
    checkedIds: {
      handler(val) {
        // 计算合计金额
        this.onCalcTotalPrice();
        // 记录到缓存中
        uni.setStorageSync(CartIdsIndex, val);
      },
      immediate: false,
    },
    // 监听购物车商品总数量
    total(val) {
      // 缓存并设置角标
      setCartTotalNum(val);
      setCartTabBadge();
    },
  },

  options: {
    styleIsolation: "shared",
  },

  methods: {
    init(e) {
      this.storeId = e.storeId;
      this.storeRoomId = e.storeRoomId;
      console.log("storeId:" + this.storeId);
      console.log("storeRoomId:" + this.storeRoomId);
      // 获取是否体验版
      let { miniappSiteType } = JSON.parse(
        uni.getStorageSync("miniappSetting") || "{}"
      );
      this.miniappSiteType = miniappSiteType || "list";
    },

    fetch() {
      this.getCartList();
      // 获取缓存中的选中记录
      this.checkedIds = uni.getStorageSync(CartIdsIndex);
    },

    // 计算合计金额 (根据选中的商品)
    onCalcTotalPrice() {
      const app = this;
      // 选中的商品记录
      const checkedList = app.list.filter((item) =>
        inArray(item.id, app.checkedIds)
      );
      // 计算总金额
      let tempPrice = 0;
      checkedList.forEach((item) => {
        // 商品单价, 为了方便计算先转换单位为分 (整数)
        const unitPrice = item.goodsInfo.price * 100;
        // 服务金额
        const addServiceList = item.addServiceList;
        const serviceSum =
          addServiceList.reduce((sum, cur) => {
            const { price } = cur;
            let res = addDecimals(sum, price, 2);
            return res;
          }, 0) *
          100 *
          item.num;

        tempPrice += unitPrice * item.num + serviceSum;
      });
      app.totalPrice = (tempPrice / 100).toFixed(2);
    },

    // 获取购物车商品列表
    getCartList() {
      const app = this;
      app.isLoading = true;
      CartApi.list(null, null, null, null, null, null, app.storeId)
        .then((result) => {
          app.list = result.data.list;
          app.total = result.data.totalNum;
          // 清除checkedIds中无效的ID
          app.onClearInvalidId();
        })
        .finally(() => (app.isLoading = false));
    },

    // 清除checkedIds中无效的ID
    onClearInvalidId() {
      const app = this;
      const listIds = app.list.map((item) => item.id);
      app.checkedIds = arrayIntersect(listIds, app.checkedIds);
    },

    // 切换当前模式
    handleToggleMode() {
      this.mode = this.mode == "normal" ? "edit" : "normal";
    },

    // 监听步进器更改事件
    onChangeStepper({ value }, item) {
      // 这里是组织首次启动时的执行
      if (item.num == value) return;
      // 记录一个节流函数句柄
      if (!item.debounceHandle) {
        item.oldValue = item.num;
        item.debounceHandle = debounce(this.onUpdateCartNum, 500);
      }
      // 更新商品数量
      item.num = value;
      // 提交更新购物车数量 (节流)
      item.debounceHandle(item, item.oldValue, value);
    },

    // 提交更新购物车数量
    onUpdateCartNum(item, oldValue, newValue) {
      const app = this;
      CartApi.save(item.goodsId, "=", item.skuId, newValue)
        .then((result) => {
          // 更新商品数量
          app.total = result.cartTotal;
          // 重新计算合计金额
          app.onCalcTotalPrice();
          // 清除节流函数句柄
          item.debounceHandle = null;
        })
        .catch((err) => {
          // 还原商品数量
          item.num = oldValue;
          setTimeout(() => app.$toast(err.errMsg), 10);
        });
    },

    /**
     * 去首页
     * */
    toHome() {
      const app = this;
      if (app.storeId > 0 && app.storeRoomId > 0) {
        app.$navTo(
          "pages/category/index?teaId=" +
            app.storeId +
            "&teaChildId=" +
            app.storeRoomId
        );
      } else {
        app.$navTo("pages/category/index");
      }
    },

    // 跳转到商品详情页
    onTargetGoods(goodsId) {
      this.$navTo("pages/subPack/mall/goods-detail", { goodsId });
    },

    // 点击去逛逛按钮, 跳转到首页
    onTargetIndex() {
      const app = this;
      if (this.miniappSiteType == "list") {
        uni.switchTab({
          url: "/pages/homePage_V2/homePage_V2",
        });
        // uni.navigateTo({
        //   url: `/pages/subPack/jointStore/index`,
        // });
        // return;
      } else {
        if (app.storeId > 0 && app.storeRoomId > 0) {
          uni.navigateTo({
            url:
              "/pages/subPack/mall/index?teaId=" +
              app.storeId +
              "&teaChildId=" +
              app.storeRoomId,
          });
        } else {
          uni.navigateTo({
            url: "/pages/subPack/mall/index",
          });
        }
      }
    },

    // 选中商品
    handleCheckItem(cartId) {
      const { checkedIds } = this;
      const index = checkedIds.findIndex((id) => id === cartId);
      index < 0 ? checkedIds.push(cartId) : checkedIds.splice(index, 1);
    },

    // 全选事件
    handleCheckAll() {
      const { checkedIds, list } = this;
      this.checkedIds =
        checkedIds.length === list.length ? [] : list.map((item) => item.id);
    },

    // 结算选中的商品
    handleOrder() {
      const app = this;
      if (app.checkedIds.length) {
        const cartIds = app.checkedIds.join();
        app.$navTo("pages/shopmall/settlement/goods", {
          cartIds: cartIds,
          storeId: app.storeId,
          storeRoomId: app.storeRoomId,
        });
      }
    },

    // 删除选中的商品弹窗事件
    handleDelete(item) {
      const app = this;
      const { id } = item;
      if (!id) {
        return false;
      }
      uni.showModal({
        title: "友情提示",
        content: "您确定要删除商品吗？",
        showCancel: true,
        success({ confirm }) {
          // 确认删除
          confirm && app.onClearCart(id);
        },
      });
    },

    // 确认删除商品
    onClearCart(id) {
      const app = this;
      CartApi.clear([id]).then((result) => app.getCartList());
    },
  },
};
</script>

<style>
page {
  background: #f5f5f5;
}
</style>
<style lang="scss" scoped>
// 页面顶部
.head-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rpx 30rpx;
  height: 80rpx;

  .cart-total {
    font-size: 35rpx;
    color: #333;

    .active {
      color: #f03c3c;
      margin: 0 2rpx;
    }
  }

  .cart-edit {
    padding-left: 20rpx;

    .icon {
      margin-right: 12rpx;
    }

    .edit {
      color: #f03c3c;
      font-weight: bold;
    }
  }
}

// 购物车列表
.cart-list {
  padding: 20rpx 30rpx 180rpx;
}

::v-deep .u-swipe-action {
  border-radius: 18rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.cart-item {
  background: #fff;
  display: flex;
  align-items: center;
  padding: 30rpx 16rpx;
  margin-bottom: 24rpx;

  .item-radio {
    width: 56rpx;
    height: 80rpx;
    line-height: 80rpx;
    margin-right: 10rpx;
    text-align: center;

    .radio {
      transform: scale(0.76);
    }
  }

  .goods-image {
    width: 180rpx;
    .image {
      display: block;
      width: 100%;
      height: 160rpx;
      border-radius: 8rpx;
    }
  }

  .item-content {
    flex: 1;
    padding-left: 24rpx;

    .goods-title {
      font-size: 28rpx;
      max-height: 76rpx;
    }

    .goods-props {
      margin-top: 14rpx;
      height: 40rpx;
      color: #ababab;
      font-size: 24rpx;
      overflow: hidden;

      .goods-props-item {
        display: inline-block;
        margin-right: 14rpx;
        padding: 4rpx 16rpx;
        border-radius: 12rpx;
        background-color: #f5f5f5;
        width: auto;
      }
    }

    .item-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;

      .goods-price {
        vertical-align: bottom;
        color: $uni-text-color-active;
        font-weight: 500;
        font-size: 31rpx;
        line-height: 43rpx;
      }
    }
  }
}

// 空数据按钮
.empty-ipt {
  margin: 0 auto;
  width: 328rpx;
  height: 98rpx;
  background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 29rpx;
  color: #763030;
  margin-top: 10rpx;
}

// 底部操作栏
.footer-fixed {
  display: flex;
  align-items: center;
  height: 130rpx;
  background: #fff;
  padding: 0 30rpx;
  position: fixed;
  bottom: var(--window-bottom);
  left: 0;
  right: 0;
  z-index: 11;
  box-shadow: 0rpx -1rpx 10rpx 2rpx rgba(0, 0, 0, 0.09);
  border-radius: 17rpx 17rpx 0rpx 0rpx;

  .all-radio {
    width: 140rpx;
    display: flex;
    align-items: center;

    .radio {
      transform: scale(0.76);
    }
  }

  .total-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    padding-right: 30rpx;
  }

  .total-number {
    font-size: 27rpx;
    color: #999999;
    line-height: 38rpx;
  }

  .total-price {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .goods-price {
      vertical-align: bottom;
      color: #ff6ca0;
    }
  }

  .cart-action {
    width: 200rpx;

    .btn-wrapper {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .btn-item {
      flex: 1;
      width: 210rpx;
      height: 78rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
      border-radius: 6rpx;
      font-weight: 600;
      font-size: 30rpx;
      color: #763030;
      line-height: 41rpx;
      letter-spacing: 1px;

      // 禁用按钮
      &.disabled {
        opacity: 0.5;
      }
    }
  }
}
</style>
