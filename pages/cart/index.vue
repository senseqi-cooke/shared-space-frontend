<template>
  <View ref="viewRef" />
</template>

<script>
import View from "./view.vue";
export default {
  components: {
    View,
  },

  data() {
    return {
      viewRef: null,
    };
  },

  onLoad(e) {
    this.$nextTick(() => {
      this.$refs.viewRef.init(e);
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(options) {
    this.$nextTick(() => {
      this.$refs.viewRef.fetch();
    });
  },
};
</script>
