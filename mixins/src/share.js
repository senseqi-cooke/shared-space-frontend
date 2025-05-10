import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },

  created() {
    //#ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    //#endif
  },

  onShareAppMessage() {
    const isPromoter = this.userInfo.isPromoter;
    const params = {
      spread: +isPromoter === 1 ? this.userInfo.uid : "",
    };
    // 构建分享参数
    return {
      title: "邂逅一次, 开启三天好运",
      path: "/pages/homePage_V2/homePage_V2?" + this.$getShareUrlParams(params),
      imageUrl: `https://ss-admin-api.wgjpt.cn/file/other/20240912093926429971.webp`, // 预览图
    };
  },
};
