<template>
  <view class="news-view">
    <view v-if="!isCustom" class="title">{{ detail.title }}</view>
    <view v-if="!isCustom" class="desc">
      <text class="author mr">{{ detail.author || "-" }}</text>
      <text class="mr">{{ detail.addTime }}</text>
      <text>{{ detail.region || "-" }}</text>
    </view>
    <!-- <view class="content" v-html="detail.content"></view> -->
    <jyf-parser class="content" :html="detail.content"></jyf-parser>
  </view>
</template>
<style scoped lang="less">
.news-view {
  padding: 40rpx 20rpx;

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
</style>
<script>
import { getArticleDetails } from "@/api/public";
import jyfParser from "@/components/jyf-parser/jyf-parser";

export default {
  name: "NewsDetail",
  components: { jyfParser },
  props: {},
  data() {
    return {
      detail: {},

      isCustom: true,
    };
  },

  mounted() {
    this.articleDetails();
  },
  methods: {
    articleDetails() {
      const { id, isCustom } = this.$yroute.query;

      this.isCustom = +isCustom === 1;

      getArticleDetails(id).then((res) => {
        res.data.content = res.data.content.replace(
          /\<img/gi,
          '<img style="max-width:100% !important; height:auto"'
        );

        this.detail = res.data;

        if (this.isCustom) {
          const title = (this.detail.title || "详情").slice(0, 6);
          uni.setNavigationBarTitle({
            title,
          });
        }
      });
    },
  },
};
</script>
