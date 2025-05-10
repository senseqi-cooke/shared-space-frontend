<!-- 小程序首页V2 - 2024.9.2 -->
<template>
  <view>
    <list-view v-if="miniappSiteType === 'list' && !loading" ref="listView" />
    <view v-if="miniappSiteType !== 'list' && !loading" class="home-page-box">
      <view class="linear-view">
        <!-- 标题 -->
        <view class="custom-nav">
          <view class="vpb">
            <view class="content"> 午夜时空·体验馆 </view>
          </view>
        </view>
        <!-- banner -->
        <view class="banner">
          <view class="vpb">
            <swiper
              autoplay="true"
              class="swiper swiperBox"
              duration="1000"
              indicatorDots="true"
              interval="3000"
            >
              <swiper-item
                class="swiperBox"
                v-for="image of swiperList"
                :key="image"
              >
                <image
                  class="img swiperBox"
                  mode="heightFix"
                  :src="image"
                ></image>
              </swiper-item>
            </swiper>
          </view>
          <button
            v-if="!isPromoter"
            class="btn"
            size="small"
            @click="promoterVisible = true"
          >
            立成会员
          </button>
        </view>
      </view>
      <!-- tip -->
      <view class="notice">
        <u-notice-bar
          :text="notice"
          color="#763030"
          bgColor="#FFECF0"
        ></u-notice-bar>
      </view>

      <!-- 链接 -->
      <view class="vpb">
        <view class="text-link-box flex">
          <view class="text-link" @click="toArticleDetail(10, 1)">
            <view class="zh">开锁教程</view>
            <view>KAISUOJIAOCHENG</view>
          </view>
          <!-- 预约时间房间已经准备好，颜色要变绿 -->
          <view
            class="text-link"
            :class="
              toBeginOrder && toBeginOrder.serviceStatus == 1 ? 'ready' : ''
            "
            @click="openDoor"
          >
            <view class="zh">房间开锁</view>
            <view>FANGJIANKAISUO</view>
          </view>
          <view class="text-link" @click="delayed">
            <view class="zh">续费加时</view>
            <view>XUFEIJIASHI</view>
          </view>
          <view class="text-link" @click="verifyCoupon">
            <view class="zh">自助验卷</view>
            <view>ZIZHUYANJUAN</view>
          </view>
        </view>
      </view>

      <!-- 图片链接 -->
      <view class="pic-link-box vpb flex">
        <view class="large-pic-link" @click.native="toStoreList">
          <view
            class="left-flag"
            :class="
              toBeginOrder && toBeginOrder.serviceStatus == 1 ? 'ready' : ''
            "
            v-if="timeDifference"
          >
            <!-- <view class="left-flag"> -->
            <view class="content">
              <view class="title">{{ timeTitle }}</view>
              <view class="time">{{ timeDifference }}</view>
            </view>
          </view>
          <image
            :src="`${prefix}/20240905165910924511.webp`"
            mode="widthFix"
          ></image>
        </view>
        <view class="flex pics-box">
          <view class="pic-link" @click="jointStore">
            <view
              class="side"
              :style="{
                'background-image': `url(${prefix}/20240905170146491245.webp)`,
              }"
            >
              <view class="side-text">
                <view class="zh">联合开店</view>
                <view>Joint shop</view>
              </view>
            </view>
          </view>
          <view class="pic-link" @click="toShopMall">
            <view
              class="side"
              :style="{
                'background-image': `url(${prefix}/20240905170210669877.webp)`,
              }"
            >
              <view class="side-text">
                <view class="zh">成人超市</view>
                <view>Adult supermarket</view>
              </view>
            </view>
          </view>
          <view class="pic-link" @click="toAIShopMall">
            <view
              class="side"
              :style="{
                'background-image': `url(${prefix}/20240905170157160998.webp)`,
              }"
            >
              <view class="side-text">
                <view class="zh">AI女友定制</view>
                <view>AI girlfriend customization</view>
              </view>
            </view>
          </view>
          <view class="pic-link" @click="toPartnerH5">
            <view
              class="side"
              :style="{
                'background-image': `url(${prefix}/20240905170221251810.webp)`,
              }"
            >
              <view class="side-text">
                <view class="zh">合伙人百万财富</view>
                <view>Partner million wealth</view>
              </view>
            </view>
          </view>

          <view class="link-card flex">
            <view class="card-item" @click="toArticleDetail(11, 1)">
              <view class="box">
                <view class="zh">下单教程</view>
                <view>Ordering Tutorial</view>
              </view>
            </view>
            <view class="card-item" @click="toArticleDetail(12, 1)">
              <view class="box">
                <view class="zh">入店指引</view>
                <view>Entrance instructions</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="article-detail">
        <!-- <h3>招商手册</h3> -->
        <jyf-parser :html="articleDetail.content"></jyf-parser>
      </view>

      <!-- 平台资讯 -->
      <view class="news">
        <view class="title">平台咨讯</view>
        <view
          v-for="articleInfo in articleList"
          :key="articleInfo.id"
          class="content"
          @click="toArticleDetail(articleInfo.id)"
        >
          <image :src="articleInfo.imageInput" class="pic" mode="widthFix" />
          <view class="info">
            <view class="desc">{{ articleInfo.title }}</view>
            <view class="parameter">
              <text> 资讯 {{ articleInfo.addTime }} </text>
              <text class="ml"> 阅读 {{ articleInfo.visit }} </text>
            </view>
          </view>
        </view>

        <view class="bottom-text"> 到底啦~ </view>
      </view>

      <open-door
        :visible="openDoorVisible"
        :ready="toBeginOrder && toBeginOrder.serviceStatus == 1"
        :order="toBeginOrder"
        @close="openDoorVisible = false"
        @success="fetchToBeginOrder"
      />
      <delayed
        :visible="delayedVisible"
        :target="delayedTarget"
        @close="delayedVisible = false"
      />
      <become-promoter
        :visible="promoterVisible"
        @close="promoterVisible = false"
        @confirm="becomeMember"
      />
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { PARTNER_H5_URI } from "@/config";
import BecomePromoter from "@/components/become-promoter";
import OpenDoor from "@/components/open-door";
import Delayed from "@/components/delayed";
import { getArticleList, getArticleDetails } from "@/api/public";
import { getOrderListByUserId } from "@/api/order";
import { geStoreDetail } from "@/api/store";
import * as Setting from "@/api/setting";
import ListView from "../storeList/view.vue";

export default {
  components: { OpenDoor, BecomePromoter, Delayed, ListView },

  computed: {
    ...mapGetters(["location", "goName", "userInfo"]),
    isPromoter() {
      return this.userInfo.isPromoter === 1;
    },
  },

  created() {
    this.fetchSetting();
    this.fetchArticleDetail(15);
    this.fetchArticleList();
  },

  onShow() {
    this.fetchToBeginOrder();
  },

  data() {
    return {
      miniappSiteType: "list", // 作为在小程序发布期间过审的参数
      listView: undefined,

      loading: false,

      prefix: this.$VUE_APP_PIC_RESOURCES_URL,

      swiperList: [
        `${this.$VUE_APP_PIC_RESOURCES_URL}/20240918112150695094.webp`,
        `${this.$VUE_APP_PIC_RESOURCES_URL}/20240918112144306857.webp`,
        `${this.$VUE_APP_PIC_RESOURCES_URL}/20240918112138031858.webp`,
        `${this.$VUE_APP_PIC_RESOURCES_URL}/20240918112131964211.webp`,
      ],

      articleList: [],
      articleDetail: {},

      notice:
        "诚邀合伙人，0 - 3万即可与我们联盟，无需任何经验，一部手机即可开店。联营、托管模式，无需人看守，智能化管理。",

      openDoorVisible: false,

      delayedVisible: false,
      delayedTarget: {},
      toBeginOrder: {},

      promoterVisible: false,
      futureTime: null, // 将来的时间
      currentTime: null, // 当前的时间
      timeDifference: "", // 时间差的显示文本
      timeTitle: "订单倒计时", // 时间差的标题
    };
  },
  methods: {
    async fetchSetting() {
      try {
        this.loading = true;
        const { data } = await Setting.homeSetting();
        console.log(data, 222);
        const { miniappSiteType } = data;
        uni.setStorageSync("miniappSetting", JSON.stringify(data));

        this.miniappSiteType = miniappSiteType;
        // this.miniappSiteType = "home";

        setTimeout(() => {
          if (this.miniappSiteType === "list") {
            this.$nextTick(() => {
              this.$refs.listView.initLocation();
            });
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async fetchArticleDetail(id) {
      const { data } = await getArticleDetails(id);
      this.articleDetail = data;
    },

    async fetchArticleList() {
      try {
        const { data } = await getArticleList({ page: 1, limit: 10 });
        this.articleList = data;
      } catch (err) {
        console.log(err);
      }
    },
    async fetchToBeginOrder() {
      // let param = {
      //   startFlag: 4, //4-已支付  如果预约时间已开始，订单就是服务中的状态了
      //   depositStatus: 1, //押金状态 0-待支付, 1-已支付, 2-退款中, 3-已退款, 4-已取消
      // };
      if (!this.userInfo.uid) {
        return;
      }

      let param = {
        startFlag: 5, // 5 标识查询服务中或待命中的订单, 续费只可以续费服务中的
      };

      const { data } = await getOrderListByUserId(param);
      // 如果未开始的就设置一下
      if (data.length > 0) {
        this.toBeginOrder = data[0]; // 取第一个
        console.log("---------------");
        console.log(this.toBeginOrder);
        // 设置将来的时间，例如：设置为2024年10月5日 12:00
        this.futureTime = new Date(this.toBeginOrder.teaServerStartTime);
        // 更新时间差
        this.updateTimeDifference();
      } else {
        this.timeDifference = "";
        this.toBeginOrder = {};
        this.futureTime = "";
      }
      // else {
      //   this.toBeginOrder = {serviceStatus:1,teaServerStartTime:new Date()};
      //   this.timeDifference = "订单开始时间"
      // }
    },
    updateTimeDifference() {
      console.log(this.futureTime, "判断futureTime");
      if (!this.futureTime) {
        return;
      }
      // 获取当前时间
      this.currentTime = new Date();

      /** 服务状态: 1:待命中 3:服务中 5:已取消 8：已断电 6：已通电 */
      const { serviceStatus, teaServerEndTime } = this.toBeginOrder || {};

      console.log(serviceStatus, serviceStatus == 3, "是否是服务中");

      // 服务中的订单不需要展示计时
      if (serviceStatus == 3) {
        this.timeTitle = "服务中";
        const differenceInMs = new Date(teaServerEndTime) - this.currentTime;

        // 如果是负数
        if (differenceInMs <= 0) {
          this.timeTitle = "";
          this.timeDifference = ``;
          return;
        }

        // 转换为分钟和小时
        const minutes = Math.floor(
          (Math.abs(differenceInMs) / (1000 * 60)) % 60
        );
        const hours = Math.floor(Math.abs(differenceInMs) / (1000 * 60 * 60));
        // 格式化输出
        this.timeDifference = `剩余${hours}小时${minutes}分钟`;
      } else {
        // 计算时间差（以毫秒为单位）
        const differenceInMs = this.futureTime - this.currentTime;

        // 如果未来时间已经过去
        if (differenceInMs <= 0) {
          // this.timeDifference = null;//'时间已过';
          this.timeTitle = "预约时间已过";
          // 转换为分钟和小时
          const minutes = Math.floor(
            (Math.abs(differenceInMs) / (1000 * 60)) % 60
          );
          const hours = Math.floor(Math.abs(differenceInMs) / (1000 * 60 * 60));

          // 格式化输出
          this.timeDifference = `${hours}小时${minutes}分钟`;
          return;
        }

        // 转换为分钟和小时
        const minutes = Math.floor((differenceInMs / (1000 * 60)) % 60);
        const hours = Math.floor(differenceInMs / (1000 * 60 * 60));

        // 格式化输出
        this.timeDifference = `${hours}小时${minutes}分钟`;
      }
    },
    toStoreList() {
      this.$yrouter.push({
        path: "/pages/storeList/index",
      });
    },

    async becomeMember() {
      let storeName = "恋享·体验店";
      try {
        const { data } = await geStoreDetail(storeId);
        storeName = data?.name;
      } catch (err) {
        console.log(err);
      }

      // 目前只做一个最短链路, 直接跳转到门店下的298价位的套餐详情中
      const url = `/pages/subPack/homePage/packageDetail`;
      const query = `packageId=8&storeId=6&storeName=${storeName}&becomeVip=true`;
      this.promoterVisible = false;

      uni.navigateTo({
        url: `${url}?${query}`,
      });
    },

    openDoor() {
      this.openDoorVisible = true;
    },

    // 联合开店
    jointStore() {
      uni.navigateTo({
        url: `/pages/subPack/jointStore/index`,
      });
    },

    toShopMall() {
      uni.navigateTo({
        url: `/pages/subPack/mall/index`,
      });
    },

    toAIShopMall() {
      // queryId 对应分类ID, AI是一个单独的分类, 可以在后台系统中查看
      uni.navigateTo({
        url: `/pages/subPack/mall/goods-list?queryType=AI&queryId=59`,
      });
    },

    toPartnerH5() {
      uni.navigateTo({
        url: `/pages/subPack/webview/index?url=${PARTNER_H5_URI}`,
      });
    },

    // 续费
    async delayed() {
      try {
        let param = {
          startFlag: 2, // 2 标识查询服务中的订单, 续费只可以续费服务中的
        };

        const { data } = await getOrderListByUserId(param);
        // 如果有正在服务中的, 那么可以续费
        if (data.length > 0) {
          this.delayedTarget = data[0]; // 取第一个
          this.delayedVisible = true;
        } else {
          uni.showToast({
            title: "目前暂无可以续费的订单",
            icon: "none",
          });
        }
      } catch (err) {
        uni.showToast({
          title: "目前暂无可以续费的订单",
          icon: "none",
        });
      }
    },

    toArticleDetail(id, isCustom = 0) {
      this.$yrouter.push({
        path: `/pages/news/NewsDetail/index?id=${id}&isCustom=${isCustom}`,
      });
    },

    verifyCoupon() {
      uni.navigateTo({ url: "/pages/discounts/discounts" });
    },

    doing() {
      uni.showToast({
        title: "功能建设中...",
        icon: "none",
      });
    },
  },
  // 每隔一分钟更新一次时间差
  mounted() {
    setInterval(this.updateTimeDifference, 60000);
  },
};
</script>

<style>
page {
  background: #fefbf7;
  font-family: PingFangSC, PingFang SC;
}

.cityPla {
  font-size: 28rpx;
  color: #999999;
}
</style>

<style lang="scss" scoped>
.home-page-box {
  width: 100%;
  height: auto;
  padding-bottom: 20rpx;
  box-sizing: border-box;

  // vertical-padding-box
  .vpb {
    padding: 0 20rpx;
  }

  .flex {
    display: flex;
  }

  .linear-view {
    background: linear-gradient(180deg, #ff96bc 15%, #ffbccc 40%, #fff);
  }

  .custom-nav {
    height: 200rpx;
    position: relative;

    .content {
      position: absolute;
      bottom: 18rpx;
      font-weight: 600;
      color: #763030;
      font-size: 33rpx;
    }
  }

  .banner {
    width: 100%;
    position: relative;

    .swiper {
      height: 372rpx;
    }

    .swiperBox {
      display: flex;
      justify-content: center;

      .img {
        height: 372rpx;
        width: 100%;
      }
    }

    .btn {
      width: 142rpx;
      height: 42rpx;
      position: absolute;
      bottom: 34rpx;
      left: 60rpx;
      border-radius: 21rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18rpx;
      font-weight: bold;
    }
  }

  .notice {
    margin: 20rpx 0;
  }
  .article-detail {
    padding: 0 20rpx;
  }

  .text-link-box {
    justify-content: space-between;

    .text-link {
      width: 168rpx;
      height: 56rpx;
      background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
      box-shadow: 0rpx 2rpx 2rpx 1rpx rgba(114, 109, 109, 0.26);
      border-radius: 28rpx;
      font-size: 11rpx;
      color: #b15757;
      padding: 10rpx 0 4rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .zh {
        font-weight: 500;
        font-size: 20rpx;
        color: #763030;
      }
    }
    .ready {
      background: linear-gradient(180deg, #ade837 0%, #72aa11 100%) !important;
      color: #ffffff !important;
      .zh {
        color: #ffffff !important;
      }
    }
  }

  .pic-link-box {
    justify-content: space-between;
    padding-top: 20rpx;
    padding-bottom: 20rpx;

    .large-pic-link {
      width: 411rpx;

      image {
        width: 100%;
      }
    }

    .pics-box {
      flex: 1;
      padding: 4rpx 0 10rpx 12rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .pic-link {
        width: 100%;
        height: 108rpx;
        background-color: #ffb8d3;
        padding: 6rpx;
        border-radius: 20rpx;

        .side {
          background-size: 100% 100%;
          background-repeat: no-repeat;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .side-text {
            width: 150rpx;
            margin-right: 2rpx;
            font-size: 13rpx;
            color: #b15757;
            line-height: 20rpx;
            text-align: center;

            .zh {
              font-size: 20rpx;
              line-height: 32rpx;
              font-weight: 500;
              color: #763030;
            }
          }
        }
      }

      .link-card {
        justify-content: space-between;
        width: 100%;

        .card-item {
          width: 49%;
          height: 125rpx;
          background: linear-gradient(180deg, #ffe7f0, #ffb8d3);
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .box {
            font-size: 14rpx;
            color: #b15757;
            line-height: 20rpx;
            text-align: center;

            .zh {
              font-size: 24rpx;
              line-height: 32rpx;
              font-weight: 500;
              color: #763030;
            }
          }
        }
      }
    }
  }

  .news {
    margin-top: 20rpx;
    padding: 0 20rpx;

    > .title {
      font-weight: 600;
      font-size: 28rpx;
      color: #333333;
      line-height: 39rpx;
      letter-spacing: 1px;
    }

    .bottom-text {
      margin: 30rpx 0;
      text-align: center;
      color: #888;
      font-size: 24rpx;
    }

    .content {
      width: 100%;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #cccccc;
      display: flex;

      .pic {
        width: 227rpx;
        max-height: 300rpx;
        border-radius: 8rpx;
        overflow: hidden;
      }

      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 14rpx;

        .desc {
          font-weight: 500;
          font-size: 28rpx;
          color: #333333;
          line-height: 34rpx;
        }

        .parameter {
          font-size: 18rpx;
          color: #666666;
          line-height: 26rpx;

          .ml {
            margin-left: 40rpx;
          }
        }
      }
    }
  }
  .left-flag {
    background-color: #ffb8d3;
    position: absolute;
    border-top-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    opacity: 0.7;
    margin-left: 7rpx;
    margin-top: 7rpx;
    .content {
      padding: 10rpx 38rpx;
      color: #763030;
      text-align: center;
      font-size: 20rpx;
      .title {
        font-weight: bold;
        font-size: 1.125em;
      }
      .time {
        font-size: 1em;
      }
    }
  }
  .large-pic-link {
    .ready {
      background: linear-gradient(180deg, #ade837 0%, #72aa11 100%) !important;
      color: #ffffff !important;
      .content {
        color: #ffffff !important;
      }
    }
  }
}
</style>
