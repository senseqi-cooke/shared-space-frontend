<!-- 订单结算页 -->
<template>
  <view class="closeAccount">
    <view v-if="!isDepositPay" class="pay-time">
      <view class="payText"> 剩余支付时间 </view>
      <view class="time">
        {{ formatTime }}
      </view>
    </view>
    <view v-else class="deposit-tip">
      <view class="title">请支付押金</view>
      <view class="desc">
        押金为{{ formatMoney(detail.deposit) }}元, 押金会在房间清洁完成后,
        由系统自动返回到您的支付渠道
      </view>
    </view>

    <view class="header-box">
      <view class="room-box">
        <image :src="detail.icon" mode="widthFix"></image>
        <view class="name-box">
          <view class="name">
            {{ query.storeName }}
          </view>
          <view class="package-name">
            {{ detail.packageName }}
          </view>
          <view v-if="!isDepositPay && !isRepeat" class="money">
            <text>￥</text>
            {{ formatMoney(detail.packagePrice) }}
          </view>
          <view v-if="isRepeat" class="money">
            续费{{ query.serverTime }}分钟:
            <text>￥</text>
            {{ formatRepeatPrice }}
          </view>
        </view>
      </view>

      <!-- <view class="ticket-box" @click="ticketShow = true">
        <text class="title">卡券</text>
        <text class="content">{{
          selectTicket.length == 0
            ? ticketList[0].length + "张可用>"
            : selectTicket[0].startText + ">"
        }}</text>
      </view> -->

      <view v-if="!isDepositPay" class="ticket-box" @click="selectCouponFn">
        <text class="title">优惠券</text>
        <text class="content">{{
          selectCoupon.length == 0
            ? couponList[0].length + "张可用 >"
            : selectCoupon[0].startText + " ×"
        }}</text>
      </view>

      <view v-if="isToDoor" class="ticket-box">
        <text class="title">服务押金</text>
        <text class="content money">￥{{ formatMoney(detail.deposit) }}</text>
      </view>
    </view>

    <!-- 快递配送：配送地址 -->
    <view v-if="isToDoor" class="flow-delivery" @click="onSelectAddress">
      <view class="flow-delivery__detail dis-flex flex-y-center">
        <view class="detail-location dis-flex">
          <u-icon name="map-fill" color="#ff6ca0" size="36rpx"></u-icon>
        </view>
        <view class="detail-content flex-box">
          <block v-if="address">
            <view class="detail-content__title dis-flex">
              <text class="f-30">{{ address.name }}</text>
              <text class="detail-content__title-phone f-28">
                {{ address.mobile }}
              </text>
            </view>
            <view class="address-info detail-content__describe">
              <text class="region">
                {{ address.provinceName }}{{ address.cityName
                }}{{ address.regionName }}
              </text>
              <text class="detail">{{ address.detail }}</text>
            </view>
          </block>
          <block v-else>
            <view class="detail-content__describe dis-flex select-address">
              <view class="col-6"> 请选择配送地址 </view>
            </view>
          </block>
        </view>
        <view class="detail-arrow dis-flex">
          <text class="iconfont icon-xiangyoujiantou"></text>
        </view>
      </view>
    </view>

    <view class="payment-box">
      <view class="title"> 支付方式 </view>

      <view class="cell-box">
        <u-radio-group v-model="payType" @change="changePayType">
          <view class="cell" @click="changePayType('general')">
            <view class="left">
              <image src="../../../static/images/v2/card.png" mode=""></image>
              通用储值卡 <text>(余额{{ generalMoney }})</text>
            </view>
            <u-radio activeColor="#ff6ba0" name="general" />
          </view>
          <view class="cell" @click="changePayType('shop')">
            <view class="left">
              <image src="../../../static/images/v2/card.png" mode=""></image>
              门店储值卡 <text>(余额{{ shopMoney }})</text>
            </view>
            <u-radio activeColor="#ff6ba0" name="shop" />
          </view>
          <view class="cell" @click="changePayType('weChat')">
            <view class="left">
              <image src="../../../static/images/weixin.png" mode=""></image>
              微信支付
            </view>
            <u-radio activeColor="#ff6ba0" name="weChat" />
          </view>
        </u-radio-group>
      </view>
    </view>

    <view class="bottomBox">
      <view class="moneyBox">
        <text>￥{{ realPrice }}元</text>
        <text v-if="!isDepositPay && !isRepeat">应付￥{{ orderPrice }}</text>
      </view>
      <view class="buttonBox" v-if="buttonState" @click="submitPayment()">
        确定支付
      </view>
      <view class="buttonBoxTwo" v-else> 确定支付 </view>
    </view>

    <u-picker
      :show="ticketShow"
      :columns="ticketList"
      keyName="startText"
      @confirm="ticketConfirm"
      @cancel="ticketShow = false"
    >
    </u-picker>

    <u-picker
      :show="couponShow"
      :columns="couponList"
      keyName="startText"
      @confirm="couponConfirm"
      @cancel="couponShow = false"
    >
    </u-picker>
  </view>
</template>

<script>
import { myCouponList } from "@/api/coupon";
import { mapGetters } from "vuex";
import { getStoreBalanceList, getUserGradeByUserId } from "@/api/user";
import {
  orderPay,
  depositPay,
  getStoreRoomRenewalMinute,
  becomePromoterApi,
} from "@/api/order";
import { weappPay } from "@/libs/wechat";
import { getStoreRoomPackageDetail } from "@/api/store";
import * as AddressApi from "@/api/address";

const COUNT_DOWN = 30; // 倒计时时长

function queryStringToObject(obj) {
  let res = {};
  for (let key in obj) {
    res[key] = decodeURIComponent(obj[key]);
  }
  return res;
}

const typeValueMap = {
  general: 0,
  shop: 1,
  weChat: 2,
};

export default {
  data() {
    return {
      totalSeconds: 0, // 转换为秒
      countdownInterval: null, // 倒计时计时器

      preferential: 0, // 优惠

      query: {},
      detail: {},

      ticketList: [[]], // 卡券列表
      ticketShow: false, // 选择卡券的显示状态
      selectTicket: [], // 当前选择的卡券

      couponList: [[]], // 优惠券列表
      couponShow: false, // 选择优惠券的显示状态
      selectCoupon: [], // 当前选择的优惠券
      selCouponId: 0,

      address: {}, // 默认地址

      payType: "", // 支付方式
      orderDetail: {}, // 订单详情数据

      generalMoney: 0, // 通用储值卡余额
      shopMoney: 0, // 门店储值卡余额

      mtUserGrade: {}, // 折扣信息

      buttonState: true, // 确认支付是否能支付的状态

      minuteList: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),

    becomeVip() {
      return !!this.query?.becomeVip;
    },

    isPromoter() {
      return this.userInfo.isPromoter === 1;
    },

    formatTime() {
      const min = Math.floor(this.totalSeconds / 60);
      const sec = this.totalSeconds % 60;
      return `${min} : ${sec < 10 ? "0" : ""}${sec}`;
    },

    // 续费金额
    formatRepeatPrice() {
      return (
        (this.minuteList || []).find(
          (el) => el.minNum === +this.query.serverTime
        )?.price || "-"
      );
    },

    orderPrice() {
      const price = this.isToDoor
        ? this.detail.packagePrice + this.detail.deposit
        : this.detail.packagePrice;
      return this.formatMoney(price);
    },

    realPrice() {
      if (this.isDepositPay) {
        return this.formatMoney(this.detail.deposit);
      }
      if (this.isRepeat) {
        return this.formatRepeatPrice;
      }
      let discount = 1; // 折扣

      if (this.mtUserGrade?.discount) {
        discount = +this.mtUserGrade?.discount * 0.1;
      }

      if (this.preferential === -1) {
        return this.formatMoney(0);
      }

      let price = this.detail.packagePrice - this.preferential;

      if (this.isToDoor) {
        price = +price + this.detail.deposit;
      }

      return this.formatMoney(price * discount);
    },

    isDepositPay() {
      return +this.query.isDeposit === 1;
    },

    isRepeat() {
      return +this.query.isRepeat === 1;
    },

    isToDoor() {
      return +this.detail.isToDoor === 1;
    },
  },

  onLoad(options) {
    this.init(options);
  },

  onShow() {
    if (this.isToDoor) {
      // 获取默认收货地址
      this.fetchAddress();
    }
  },

  beforeDestroy() {
    this.stopTimer();
  },

  methods: {
    // 切换支付方式
    changePayType(type) {
      const tipMap = {
        general: "通用储值卡",
        shop: "门店储值卡",
      };

      let canPay = false;
      if (type === "general") {
        canPay = +this.realPrice <= +this.generalMoney;
      }
      if (type === "shop") {
        canPay = +this.realPrice <= +this.shopMoney;
      }
      if (type === "weChat") {
        canPay = true;
      }

      this.payType = type;
      if (canPay) {
        this.buttonState = true;
      } else {
        uni.showToast({
          title: `${tipMap[type]}余额不足`,
          icon: "none",
        });
        this.buttonState = false;
      }
    },

    async init(options) {
      await this.fullDataByQuery(options);

      if (!this.isDepositPay) {
        this.resetTimer(); // 初始化倒计时
      }

      if (this.isToDoor) {
        // 获取默认收货地址
        this.fetchAddress();
      }

      await this.fetchStoreRoomRenewalMinute(); // 获取续费价格列表

      this.getTicketList(); // 获取卡券列表

      this.getCouponList(); // 获取优惠券列表

      this.getUserGrade(); // 获取用户会员对应的等级折扣

      this.getCodeNum(); // 获取储值卡余额
    },

    // 快递配送：选择收货地址
    onSelectAddress() {
      this.$navTo("pages/subPack/mall/address-list", { from: "checkout" });
    },

    fetchStoreRoomRenewalMinute() {
      getStoreRoomRenewalMinute().then((res) => {
        const { data } = res;
        const { content } = data;
        this.minuteList = content;
      });
    },

    async fullDataByQuery(options) {
      this.query = { ...queryStringToObject(options) };
      console.log(this.query, "query");

      const { packageId } = options;

      try {
        const { data } = await getStoreRoomPackageDetail(packageId);
        this.detail = {
          ...this.detail,
          ...data,
        };
      } catch (err) {
        console.log(err);
      }
    },

    startTimer() {
      this.countdownInterval = setInterval(() => {
        if (this.totalSeconds > 0) {
          this.totalSeconds--;
        } else {
          this.stopTimer();
          uni.showToast({
            title: "当前订单超时支付，已取消",
            icon: "none",
          });

          uni.navigateBack({
            delta: 1,
          });
        }
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    },

    resetTimer() {
      this.stopTimer();
      this.totalSeconds = COUNT_DOWN * 60;
      this.startTimer();
    },

    selectCouponFn() {
      if (this.selectCoupon.length == 0) {
        this.couponShow = true;
      } else {
        this.preferential = 0;
        this.selectCoupon = [];
        this.selCouponId = 0;
      }
    },

    // 确定选择某一个优惠券
    couponConfirm(e) {
      // 计算实付金额
      if (e.value[0].reachMoney > +this.orderPrice) {
        uni.showToast({
          title: "该优惠券满" + e.value[0].reachMoney + "金额使用",
          icon: "none",
        });
        return false;
      }

      if (+e.value[0].balance >= +this.orderPrice) {
        this.preferential = -1;
      } else {
        this.preferential = e.value[0].balance;
      }

      this.selectCoupon = e.value;
      this.selCouponId = e.value[0].id;

      this.couponShow = false;
    },

    // 截取当前数据到小数点后两位
    formatMoney(value) {
      let realVal = parseFloat(value).toFixed(2);
      return realVal;
    },

    /******* api *********/
    // 支付
    async submitPayment() {
      uni.showLoading({ title: "支付中", mask: true });
      try {
        const url = "/pages/orderList/orderList";
        const api = this.isDepositPay ? depositPay : orderPay;
        let params = {};
        if (!this.isDepositPay) {
          params = {
            teaId: this.query.storeId,
            teaChildId: this.detail.storeRoomId,
            useCouponId: this.selCouponId,
            payType: typeValueMap[this.payType],
            isRepeat: this.query.isRepeat ? this.query.isRepeat : 0,
            packMode: this.query.isRepeat ? "" : 0,
            packageId: this.query.isRepeat ? this.query.minId : this.detail.id, // 续订和预约传的id不一样
            parentOrderId: this.query.parentOrderId
              ? this.query.parentOrderId
              : "", // 续订时需要
          };
        } else {
          params = {
            orderNo: this.query.orderNo,
            payType: typeValueMap[this.payType],
            teaServerStartTime: this.query.startTime,
          };
        }
        const { status, data } = await api(params);
        const { orderInfo, payment } = data;

        if (status === 200) {
          if (payment.payMoney0Success === "1") {
            // 非会员可以成为会员, 会员直接跳转到订单
            await this.becomePromoter(orderInfo, url);
          } else {
            if (params.payType === 0 || params.payType === 1) {
              uni.showToast({
                title: "支付失败",
                icon: "none",
                duration: 2000,
              });
            } else {
              // 微信支付
              console.log("payment:", JSON.stringify(payment));
              await weappPay(payment);
              // 非会员可以成为会员, 会员直接跳转到订单
              await this.becomePromoter(orderInfo, url);
            }
          }
        } else {
          uni.showToast({
            title: "支付请求失败",
            icon: "none",
            duration: 2000,
          });
          uni.switchTab({ url });
        }
      } catch (err) {
        uni.showToast({
          title: err.msg || "支付过程中发生错误",
          icon: "none",
          duration: 2000,
        });
        console.log(err);
      } finally {
        uni.hideLoading();
      }
    },

    // 成为会员
    async becomePromoter(orderInfo, url) {
      try {
        // 只有是成为会员的订单 且 非会员账号走此逻辑
        if (this.becomeVip && !this.isPromoter) {
          await becomePromoterApi({ orderNo: orderInfo.appOrderNo || "" });
          this.$store.dispatch("userInfo", true);
          uni.showToast({
            title: "已成为会员",
            icon: "success",
            duration: 5000,
          });

          uni.switchTab({ url });
        } else {
          uni.showToast({
            title: "支付成功",
            icon: "success",
            duration: 5000,
          });

          uni.switchTab({ url });
        }
      } catch (err) {
        return { msg: err.msg || err.message || "成为会员失败" };
      }
    },

    // 获取储值卡余额
    async getCodeNum() {
      try {
        let param = {
          storeId: this.query.storeId,
        };
        const { data = [] } = await getStoreBalanceList(param);

        const [general = {}, shop = {}] = data;

        this.generalMoney = general.userBalance || 0; // 通用储值卡余额

        this.shopMoney = shop.userBalance || 0; // 门店储值卡余额

        this.changePayType("general");
      } catch (err) {
        console.log(err);
      }
    },

    // 获取卡券列表
    async getTicketList() {
      try {
        const params = {
          status: "A",
          userId: this.userInfo.uid,
          queryTypeScope: 1,
          storeId: this.query.storeId,
        };

        const { data } = await myCouponList(params);
        this.ticketList = [data?.myCouponList?.content];
      } catch (err) {
        console.log(err);
      }
    },

    // 获取优惠券列表
    async getCouponList() {
      try {
        const params = {
          status: "A",
          userId: this.userInfo.uid,
          queryTypeScope: 2,
          storeId: this.query.storeId,
        };

        const { data } = await myCouponList(params);
        this.couponList = [data?.myCouponList?.content];
      } catch (err) {
        console.log(err);
      }
    },

    // 获取收货地址
    async fetchAddress() {
      try {
        const { data } = await AddressApi.detail(0);
        this.address = data.address ? data.address : null;
      } catch (err) {
        console.log(err);
      }
    },

    // 获取用户会员对应的等级折扣
    async getUserGrade() {
      try {
        const { data } = await getUserGradeByUserId({});
        const { mtUserGrade } = data;

        if (mtUserGrade != null) {
          this.mtUserGrade = mtUserGrade;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
page {
  background: #f7f7f7;
}
</style>

<style lang="scss" scoped>
.closeAccount {
  width: 100%;
  height: auto;

  .pay-time {
    width: 100%;
    padding: 50rpx 0 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .payText {
      font-weight: 600;
      font-size: 33rpx;
      color: #333333;
      line-height: 45rpx;
    }

    .time {
      margin-top: 20rpx;
      background: #ff6ca0;
      border-radius: 26rpx;
      padding: 4rpx 30rpx;
      font-size: 38rpx;
      color: #ffffff;
    }
  }

  .deposit-tip {
    width: 100%;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-weight: 600;
      font-size: 33rpx;
      color: #333333;
      line-height: 45rpx;
    }

    .desc {
      font-size: 27rpx;
      color: #666666;
      line-height: 38rpx;
      margin-top: 20rpx;
      text-align: center;
    }
  }

  .header-box {
    width: 728rpx;
    margin: 0 auto;
    padding: 40rpx 30rpx;
    background: #fff;

    .room-box {
      display: flex;
      align-items: center;

      image {
        width: 180rpx;
        height: 180rpx;
        border-radius: 20rpx;
      }

      .name-box {
        flex: 1;
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .name {
          font-weight: 600;
          font-size: 31rpx;
          color: #333333;
          line-height: 43rpx;
          letter-spacing: 2px;
        }

        .package-name {
          font-size: 27rpx;
          color: #666666;
          line-height: 38rpx;
        }

        .money {
          font-weight: 500;
          font-size: 31rpx;
          color: #ff6ca0;
          line-height: 43rpx;

          text {
            font-size: 24rpx;
          }
        }
      }
    }
  }

  .ticket-box {
    margin-top: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;

    .title {
      font-weight: 500;
      font-size: 28rpx;
      color: #333333;
      line-height: 39rpx;
    }

    .content {
      font-size: 26rpx;
      color: #999999;
      line-height: 37rpx;
    }

    .money {
      font-weight: 500;
      font-size: 35rpx;
      color: #ff6ca0;
    }
  }

  .flow-delivery {
    width: 728rpx;
    margin: 0 auto;
    margin-top: 20rpx;
    padding: 25rpx;
    background: #ffffff;
    border-radius: 13rpx;

    .flow-delivery__detail {
      justify-content: space-between;
    }

    .detail-location {
      font-size: 36rpx;
    }
    .detail-content {
      padding: 0 20rpx;
      .detail-content__title-phone {
        margin-left: 10rpx;
      }
      .detail-content__describe {
        font-size: 28rpx;
        color: #777;
      }
      .address-info {
        .icon {
          float: right;
          font-weight: bold;
        }
      }
      .select-address {
        height: 90rpx;
        line-height: 90rpx;
        .icon {
          margin-left: 15rpx;
        }
      }
    }
    .detail-content__title {
      margin-bottom: 6rpx;
    }
    .store-name,
    .store-phone,
    .store-address {
      margin-bottom: 6rpx;
      font-size: 28rpx;
      color: #777;
    }
  }

  .payment-box {
    width: 728rpx;
    margin: 0 auto;
    margin-top: 20rpx;
    padding: 25rpx;
    background: #ffffff;
    border-radius: 13rpx;

    .title {
      font-weight: 600;
      font-size: 31rpx;
      color: #333333;
      line-height: 43rpx;
      letter-spacing: 2px;
    }

    .cell-box {
      padding: 20rpx 5rpx;
    }

    .cell {
      margin-top: 20rpx;
      font-weight: 500;
      font-size: 29rpx;
      color: #333333;
      line-height: 41rpx;
      letter-spacing: 1px;
      display: flex;
      justify-content: space-between;

      .left {
        display: flex;
        align-items: center;

        image {
          margin-right: 16rpx;
          width: 43rpx;
          height: 43rpx;
        }
      }

      text {
        font-size: 24rpx;
        color: #999;
        font-weight: 400;
        margin-left: 20rpx;
      }
    }
  }

  .bottomBox {
    width: 100%;
    height: 180rpx;
    padding: 30rpx 30rpx 0;
    background: #ffffff;
    box-shadow: 0rpx -1rpx 10rpx 2rpx rgba(0, 0, 0, 0.09);
    border-radius: 17rpx 17rpx 0rpx 0rpx;
    position: fixed;
    bottom: 0rpx;
    left: 0rpx;
    display: flex;
    // align-items: center;
    justify-content: space-between;

    .moneyBox > text:nth-child(1) {
      font-weight: 500;
      font-size: 42rpx;
      color: #ff6ca0;
      line-height: 59rpx;
    }

    .moneyBox > text:nth-child(2) {
      font-weight: 400;
      font-size: 20rpx;
      color: #999999;
      line-height: 28rpx;
      text-decoration-line: line-through;
      margin-left: 10rpx;
    }

    .buttonBox,
    .buttonBoxTwo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 235rpx;
      height: 78rpx;
      background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
      border-radius: 6rpx;
      font-weight: 600;
      font-size: 30rpx;
      color: #763030;
      line-height: 41rpx;
      letter-spacing: 1px;
    }

    .buttonBoxTwo {
      background: #808080;
      color: #fff;
    }
  }
}
</style>
