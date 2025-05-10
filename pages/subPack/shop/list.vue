<template>
  <view class="list-view">
    <u-list @scrolltolower="scrolltolower">
      <u-list-item v-for="(item, index) in list" :key="index">
        <view class="card">
          <view class="name">{{ item.name || "-" }}</view>
          <!-- <view class="phone">{{ item.phone }}</view> -->
          <view class="time">{{ item.time }}</view>
        </view>
      </u-list-item>

      <view class="bottom">{{ loading ? "加载中" : "没有更多了" }}</view>
    </u-list>
  </view>
</template>

<script>
import { getMyFranchisee, getMyCofounder } from "@/api/user";

export default {
  data() {
    return {
      navType: "",

      page: 1,
      limit: 20,

      list: [],
      total: 0,
    };
  },
  onLoad(options) {
    uni.setNavigationBarTitle({
      title: options.nav,
    });
    this.navType = options.navType;

    this.loadMore();
  },
  methods: {
    scrolltolower() {
      if (this.loading) {
        return;
      }
      if (this.total <= this.list.length) {
        return;
      }

      this.loadMore();
    },

    async loadMore() {
      this.loading = true;
      const api = this.initApi();
      try {
        const { data } = await api({ page: this.page, limit: this.limit });

        this.list.push(...data.list);
        this.total = data.total;
        this.page += 1;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    initApi() {
      const apiMap = {
        coFounder: getMyCofounder, // 联创
        franchisee: getMyFranchisee, // 加盟商
        member: () => {}, // 会员
        partner: () => {}, // 合伙人
        teamTotal: () => {}, // 团队总人数
        totalAgent: () => {}, // 总代理
      };

      return apiMap[this.navType];
    },
  },
};
</script>

<style lang="scss" scoped>
.list-view {
  width: 100%;
  height: auto;
  padding: 20rpx;
  background-color: #f3f0f5;

  .card {
    width: 100%;
    background: #ffffff;
    border-radius: 20rpx;
    overflow: hidden;
    padding: 40rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    font-size: 27rpx;
    color: #333333;
    line-height: 38rpx;
    margin-bottom: 28rpx;

    .name {
      max-width: 120rpx;
    }

    .time {
      flex-shrink: 0;
      font-size: 27rpx;
      color: #999999;
      line-height: 38rpx;
    }
  }

  .bottom {
    text-align: center;
    font-size: 24rpx;
    color: #333333;
    line-height: 38rpx;
    padding: 20rpx 0 80rpx;
  }
}
</style>
