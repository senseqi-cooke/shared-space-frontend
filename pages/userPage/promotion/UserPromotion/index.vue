<template>
  <view class="my-promotion">
    <view class="header">
      <view class="name acea-row row-center-wrapper">
        <view><!-- 当前佣金 -->当前可用时卡券数</view>
        <!--        <view class="record" @click="goCashRecord()">
          提现记录
          <text class="iconfont icon-xiangyou"></text>
        </view> -->
      </view>
      <view class="num">{{ Info.unusedCouponCount }}</view>

      <!--      <view class="profit acea-row row-between-wrapper">
		  
        <view class="item">
          <view>昨日收益</view>
          <view class="money">{{ Info.lastDayCount }}</view>
        </view>
		
        <view class="item">
          <view>累积已提</view>
          <view class="money">{{ Info.extractCount }}</view>
        </view>

		
      </view> -->

      <view class="profit acea-row row-between-wrapper">
        <view class="item">
          <view>累计获得卡券数</view>
          <view class="money">{{ Info.totalCouponCount }}</view>
        </view>

        <view class="item">
          <view>已用卡券数</view>
          <view class="money">{{ Info.usedCouponCount }}</view>
        </view>
      </view>
    </view>
    <view class="list acea-row row-between-wrapper">
      <view
        class="item acea-row row-center-wrapper row-column"
        @click="goPoster()"
      >
        <text class="iconfont icon-erweima"></text>
        <view>推广名片</view>
      </view>
      <view
        class="item acea-row row-center-wrapper row-column"
        @click="goPromoterList()"
      >
        <text class="iconfont icon-tongji"></text>
        <view>推广人统计</view>
      </view>

      <!--      <view class="item acea-row row-center-wrapper row-column" @click="goCommissionDetails()">
        <text class="iconfont icon-qiandai"></text>
        <view>佣金明细</view>
      </view>
      <view class="item acea-row row-center-wrapper row-column" @click="goPromoterOrder()">
        <text class="iconfont icon-dingdan"></text>
        <view>推广人订单</view>
      </view>
      <view class="item acea-row row-center-wrapper row-column" @click="toCash()">
        <text class="iconfont icon-chongzhi"></text>
        <view>立即提现</view>
      </view> -->
    </view>
  </view>
</template>
<script>
import { getSpreadInfo } from "@/api/user";

export default {
  name: "UserPromotion",
  components: {},
  props: {},
  data: function () {
    return {
      Info: {
        lastDayCount: 0,
        extractCount: 0,
        commissionCount: 0,
        totalCouponCount: 0,
        unusedCouponCount: 0,
        usedCouponCount: 0,
      },
    };
  },
  mounted: function () {
    this.getInfo();
  },
  methods: {
    goPoster() {
      this.$yrouter.push("/pages/userPage/promotion/Poster/index");
    },
    goCashRecord() {
      this.$yrouter.push("/pages/userPage/promotion/CashRecord/index");
    },
    goPromoterList() {
      this.$yrouter.push("/pages/userPage/promotion/PromoterList/index");
    },
    goCommissionDetails() {
      this.$yrouter.push("/pages/userPage/promotion/CommissionDetails/index");
    },
    goPromoterOrder() {
      this.$yrouter.push("/pages/userPage/promotion/PromoterOrder/index");
    },
    getInfo: function () {
      let that = this;
      getSpreadInfo().then(
        (res) => {
          that.Info = res.data;
        },
        function (err) {
          uni.showToast({
            title:
              err.msg || err.response.data.msg || err.response.data.message,
            icon: "none",
            duration: 2000,
          });
        }
      );
      /*      getSpreadInfo().then(
        res => {
          that.Info = res.data;
        },
        function(err) {
          uni.showToast({
				title: err.msg || err.response.data.msg|| err.response.data.message,
				icon: 'none',
				duration: 2000
			});
        }
      ); */
    },
    toCash: function () {
      this.$yrouter.push({ path: "/pages/user/promotion/UserCash/index" });
    },
  },
};
</script>

<style lang="less">
/*每个页面公共css */
/* @import 'animate.css'; */
</style>
