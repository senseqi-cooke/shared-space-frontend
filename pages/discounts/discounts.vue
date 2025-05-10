<!-- 优惠中心（卡券、充值、团购兑换）首页 -->
<template>
  <view class="detailsBox">
    <conversion v-if="$store.getters.token || userInfo.uid" />
    <Authorization v-else />
  </view>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import conversion from "@/components/discounts_details/conversion.vue"; // 团购兑换组件
import Authorization from "@/pages/authorization/index";
export default {
  data() {
    return {
      canIUseGetUserProfile: false,
      isWeixin: false,
    };
  },
  computed: mapGetters(["userInfo"]),
  components: {
    conversion,
    Authorization,
  },
  methods: {
    ...mapMutations(["updateAuthorizationPage"]),
  },
};
</script>

<style scoped lang="scss">
.detailsBox {
  width: 100%;
  height: auto;
}
</style>
