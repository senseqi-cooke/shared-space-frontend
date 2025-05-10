<template>
  <view class="custom-webview-container">
    <web-view v-if="url" :src="url" @message="onMessage"></web-view>
  </view>
</template>

<script>
export default {
  name: "CustomWebView",
  data() {
    return {
      url: ''
    }
  },
  onLoad(options) {
    this.url = options.url
  },
  methods: {
    onMessage(e) {
      this.$emit("message", e.detail);
    },
  },
};
</script>

<style scoped>
.custom-webview-container {
  width: 100vw;
  height: 100vh;
}
</style>
