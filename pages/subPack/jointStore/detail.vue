<template>
  <view class="news-view">
    <jyf-parser class="content" :html="detail.content"></jyf-parser>

    <join v-if="isJoin === 1" @cancel="cancel" @confirm="toPay" />
    <view v-else class="bottomBox">
      <view class="pay" @click="toPay"> 立即支付 </view>
    </view>
  </view>
</template>

<script>
import { getArticleDetails } from "@/api/public";
import { getAgentType } from "@/api/tojoin";
import jyfParser from "@/components/jyf-parser/jyf-parser";
import Join from "@/components/join";

export default {
  name: "NewsDetail",
  components: { jyfParser, Join },
  props: {},
  data() {
    return {
      detail: {},

      isJoin: 0,
    };
  },

  mounted() {
    this.articleDetails();
  },
  methods: {
    articleDetails() {
      const { id, isJoin = 0 } = this.$yroute.query;

      this.isJoin = +isJoin;

      getArticleDetails(id).then((res) => {
        res.data.content = res.data.content.replace(
          /\<img/gi,
          '<img style="max-width:100% !important; height:auto"'
        );

        this.detail = res.data;

        const title = (this.detail.title || "详情").slice(0, 8);
        uni.setNavigationBarTitle({
          title,
        });
      });
    },

    cancel() {
      uni.navigateBack();
    },

    async toPay() {
      const url = "/pages/subPack/jointStore/pay";

      try {
        const { data } = await getAgentType();
        // 文章id要对应上后端的枚举ID, 主要是为了让金额由后端控制
        const typeMap = {
          17: { name: "联营商", mapId: 4 },
          18: { name: "联合创始人", mapId: 5 },
          19: { name: "线上联营商", mapId: 1 },
          20: { name: "商家入驻", mapId: 2 },
          21: { name: "合伙人", mapId: 3 },
          22: { name: "加入我们", mapId: 6 },
        };
        const current = typeMap[this.detail.id];
        const { agentTypes = [] } = data;

        const agent = agentTypes.find((el) => el.value === current.mapId);

        const type = agent.value;
        const description = agent.description;
        const price = agent.price;
        const unit = agent.expireDays || "";

        uni.navigateTo({
          url: `${url}?type=${type}&description=${description}&price=${price}&unit=${unit}`,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped lang="less">
.news-view {
  padding: 0 20rpx;

  .title {
    font-weight: 500;
    font-size: 35rpx;
    color: #333333;
    line-height: 44rpx;
  }

  .desc {
    margin: 30rpx 0;
    font-size: 22rpx;
    line-height: 31rpx;
    color: #999999;

    .author {
      color: #3698ff;
    }

    .mr {
      margin-right: 24rpx;
    }
  }
}

.news-view .content {
  font-weight: 400;
  font-size: 25rpx;
  color: #333333;
  line-height: 41rpx;
}

.news-view .content image {
  width: 100%;
  display: block;
  margin: 30rpx auto;
}

.bottomBox {
  width: 100%;
  height: 145rpx;
  background: #ffffff;
  box-shadow: 0rpx -1rpx 10rpx 2rpx rgba(0, 0, 0, 0.09);
  border-radius: 17rpx 17rpx 0rpx 0rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;

  .pay {
    width: 431rpx;
    height: 78rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;
    background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
    border-radius: 6rpx;
    font-weight: 600;
    font-size: 30rpx;
    color: #763030;
    line-height: 70rpx;
    letter-spacing: 1px;
  }
}
</style>
