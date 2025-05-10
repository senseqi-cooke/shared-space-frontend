<template>
  <ListView ref="listView" />
</template>

<script>
import ListView from "./view.vue";

export default {
  components: { ListView },
  data() {
    return {
      listView: undefined,
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.listView.initLocation();
    });

    setTimeout(() => {
      console.log(this.$refs.listView);
    }, 1000);
  },
};
</script>
