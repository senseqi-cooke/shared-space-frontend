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
          {{ order.amount.toFixed(2) }}
        </view>
      </view>
      <view class="cell">
        <view class="title">支付方式</view>
        <view class="value">{{ payType }}</view>
      </view>
      <view class="cell">
        <view class="title">下单时间</view>
        <view class="value">{{ order.createTime }}</view>
      </view>
      <u-line margin="30rpx 0"></u-line>
      <view class="cell">
        <view class="title">支付订单</view>
        <view class="value">{{ order.orderSn }}</view>
      </view>
      <view class="cell">
        <view class="title">支付内容</view>
        <view class="value">
          <view class="goods-list" v-if="order.goods.length > 0">
            <view
              class="goods-item"
              v-for="(goods, idx) in order.goods"
              :key="idx"
            >
              <view class="goods-main" v-if="goods.num > 0">
                {{ goods.name }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="options" @click="toOrderInfo()"> 查看订单详情 </view>
    </view>
  </view>
</template>

<script>
import Goods from "@/components/page/goods";
import * as OrderApi from "@/api/ordergoods";
import PayTypeEnum from "@/common/enum/order/PayType";

export default {
  components: {
    Goods,
  },
  data() {
    return {
      PayTypeEnum,

      orderId: 0,
      order: null,
      isLoading: true,
      isSuccess: false,
      message: "",
      storeId: 0,
      storeRoomId: 0,
    };
  },

  computed: {
    payType() {
      const { payType } = this.order;

      return this.PayTypeEnum.getNameByValue(payType);
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 当前页面参数
    this.orderId = options.orderId ? options.orderId : 0;
    this.message = options.message ? options.message : "";
    this.storeId = options.storeId ? options.storeId : 0;
    this.storeRoomId = options.storeRoomId ? options.storeRoomId : 0;
    this.getOrderDetail();
  },

  methods: {
    /**
     * 去订单详情
     * */
    toOrderInfo() {
      const app = this;
      app.$navTo(
        "pages/shopmall/order/detail?orderId=" +
          app.orderId +
          "&storeId=" +
          app.storeId +
          "&storeRoomId=" +
          app.storeRoomId
      );
    },

    getOrderDetail() {
      const app = this;
      app.isLoading = true;
      OrderApi.detail(app.orderId).then((result) => {
        app.isSuccess = result.data.payStatus === "B" ? true : false;
        app.isLoading = false;
        app.order = result.data || {};
      });
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
