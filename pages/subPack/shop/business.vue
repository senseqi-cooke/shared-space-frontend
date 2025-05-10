<template>
  <view class="business-view">
    <view class="card-box">
      <view class="card-item" @click="toShopPage">
        <image
          class="back-image"
          :src="`${prefix}/20240920174227979895.webp`"
        />
        <view class="column-card">
          <view>我的门店</view>
          <image
            class="icon"
            :src="`${prefix}/20240920174702106167.webp`"
            mode="widthFix"
          ></image>
        </view>
        <view class="count">{{ countMap.storeCount }}</view>
        <view class="arrow">
          <image :src="`${prefix}/20240920174722506298.webp`"></image>
        </view>
      </view>
      <view class="card-item" @click="toDefaultPage('我的联创', 'coFounder')">
        <image
          class="back-image"
          :src="`${prefix}/20240920174233832977.webp`"
        />
        <view class="column-card">
          <view>我的联创</view>
          <image
            class="icon"
            :src="`${prefix}/20240920174741269917.webp`"
            mode="widthFix"
          ></image>
        </view>
        <view class="count">{{ countMap.coFounderCount }}</view>
        <view class="arrow">
          <image :src="`${prefix}/20240920174722506298.webp`"></image>
        </view>
      </view>
      <view class="card-item" @click="toDefaultPage('我的合伙人', 'partner')">
        <image
          class="back-image"
          :src="`${prefix}/20240920174239585469.webp`"
        />
        <view class="column-card">
          <view>我的合伙人</view>
          <image
            class="icon"
            :src="`${prefix}/20240920174755317943.webp`"
            mode="widthFix"
          ></image>
        </view>
        <view class="count">{{ countMap.partnerCount }}</view>
        <view class="arrow">
          <image :src="`${prefix}/20240920174722506298.webp`"></image>
        </view>
      </view>
      <view
        class="card-item"
        @click="toDefaultPage('我的加盟商', 'franchisee')"
      >
        <image
          class="back-image"
          :src="`${prefix}/20240920174245414095.webp`"
        />
        <view class="column-card">
          <view>我的加盟商</view>
          <image
            class="icon"
            :src="`${prefix}/20240920174813003696.webp`"
            mode="widthFix"
          ></image>
        </view>
        <view class="count">{{ countMap.franchiseeCount }}</view>
        <view class="arrow">
          <image :src="`${prefix}/20240920174722506298.webp`"></image>
        </view>
      </view>
    </view>

    <view class="card-list">
      <view
        class="card-item"
        @click="toDefaultPage('我的总代理', 'totalAgent')"
      >
        <view class="title">
          <image
            :src="`${prefix}/20240920174839135253.webp`"
            mode="widthFix"
          ></image>
          <view>我的总代理（{{ countMap.totalAgentCount }}）</view>
        </view>
        <view class="arrow">
          <image :src="`${prefix}/20240920174722506298.webp`"></image>
        </view>
      </view>
      <u-line />
      <view class="card-item" @click="toDefaultPage('我的会员', 'member')">
        <view class="title">
          <image
            :src="`${prefix}/20240920174844122680.webp`"
            mode="widthFix"
          ></image>
          <view>我的会员（{{ countMap.memberCount }}）</view>
        </view>
        <view class="arrow">
          <image :src="`${prefix}/20240920174722506298.webp`"></image>
        </view>
      </view>
      <u-line />
      <view class="card-item" @click="toDefaultPage('团队总人数', 'teamTotal')">
        <view class="title">
          <image
            :src="`${prefix}/20240920174852931640.webp`"
            mode="widthFix"
          ></image>
          <view>团队总人数（{{ countMap.teamTotalCount }}）</view>
        </view>
        <view class="arrow">
          <image :src="`${prefix}/20240920174722506298.webp`"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getMyStoreCount } from "@/api/user";

export default {
  data() {
    return {
      prefix: this.$VUE_APP_PIC_RESOURCES_URL,

      storeId: "",

      countMap: {
        coFounderCount: 0, // 联创
        franchiseeCount: 0, // 加盟商
        memberCount: 0, // 会员
        partnerCount: 0, // 合伙人
        storeCount: 0, // 门店
        teamTotalCount: 0, // 团队总人数
        totalAgentCount: 0, // 总代理
      },
    };
  },
  onLoad(options) {
    this.storeId = options.storeId;

    // 获取我的商家统计
    this.fetchMyStoreCount();
  },
  methods: {
    async fetchMyStoreCount() {
      try {
        const { data } = await getMyStoreCount();
        this.countMap = { ...data };
      } catch (err) {
        console.log(err);
      }
    },

    toDefaultPage(nav, navType) {
      const url = `/pages/subPack/shop/list?nav=${nav}&navType=${navType}`;

      uni.navigateTo({
        url,
      });
    },

    toShopPage() {
      const url = `/pages/subPack/shop/managerOrder1?storeId=${this.storeId}`;

      uni.navigateTo({
        url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.business-view {
  width: 100%;
  height: 100vh;
  background-color: #f3f0f5;
  padding: 40rpx 20rpx;

  .card-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    border-radius: 19rpx;
    overflow: hidden;

    .card-item {
      width: 336rpx;
      height: 165rpx;
      margin-bottom: 40rpx;
      position: relative;
      font-weight: 600;
      font-size: 27rpx;
      line-height: 38rpx;

      &:nth-child(1) {
        color: #008f80;

        .arrow {
          background-color: #37b5bc;
        }
      }
      &:nth-child(2) {
        color: #0d5ab8;

        .arrow {
          background-color: #5295e2;
        }
      }
      &:nth-child(3) {
        color: #ea163a;

        .arrow {
          background-color: #eb3d55;
        }
      }
      &:nth-child(4) {
        color: #e79f50;

        .arrow {
          background-color: #f5bb55;
        }
      }

      .column-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 25rpx;
        left: 34rpx;
      }

      .count {
        position: absolute;
        top: 25rpx;
        right: 34rpx;
        max-width: 120rpx;
      }

      .back-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 336rpx;
        height: 165rpx;
      }

      .icon {
        width: 46rpx;
        height: 0;
        margin-top: 20rpx;
      }

      .arrow {
        width: 134rpx;
        height: 49rpx;
        border-radius: 19rpx 0rpx 19rpx 0rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 0;
        bottom: 0;

        image {
          width: 40rpx;
          height: 24rpx;
        }
      }
    }
  }

  .card-list {
    background-color: #fff;
    padding: 0 36rpx;
    border-radius: 20rpx;

    .card-item {
      padding: 48rpx 10rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 500;
      font-size: 27rpx;
      color: #333333;
      line-height: 38rpx;

      .title {
        display: flex;
        align-items: center;
        flex: 1;

        image {
          width: 52rpx;
          max-height: 60rpx;
          margin-right: 30rpx;
        }
      }

      .arrow {
        width: 87rpx;
        height: 41rpx;
        background: #ff6ca0;
        border-radius: 21rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        image {
          width: 31rpx;
          height: 19rpx;
        }
      }
    }
  }
}
</style>
