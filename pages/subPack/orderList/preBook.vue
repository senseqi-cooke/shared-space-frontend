<!-- 支付押金 - 选择时间 -->
<template>
  <view class="details">
    <!-- 预约说明 -->
    <!-- <view v-if="package.reservationDesc">
      <span>说明:</span>{{ package.reservationDesc }}
    </view> -->
    <times
      ref="times"
      :timeInterval="0.5"
      :package-min="package.packageMin || 0"
      :beginTime="selectBeginTime"
      :endTime="selectEndTime"
      @submit="submit"
    />
  </view>
</template>

<script>
import times from "../components/selectTime/pretty-times.vue";
import { mapGetters } from "vuex";
import { getTimeListOrderV3 } from "@/api/order";
import { getStoreRoomPackageDetail } from "@/api/store";
import { objectToQueryString } from "@/utils/index";

export default {
  components: {
    times,
  },
  data() {
    return {
      query: {},

      selectBeginTime: "00:00", // 日期的开始时间
      selectEndTime: "23:59", // 日期的结束时间,ios手机，24：00，打印出来为NAN，所以，处理是加上1000*60

      timeSlot: {
        timeList: [
          /* {
						date: "05-06", // 月份-日期
						selectBeginTime: "03:00", // 时间的开始时间
						// 时间格式 HH:mm:ss
						selectEndTime: "05:00", // 时间的结束时间
						sweep:1, // 打扫所需的时间段
					} */
        ],
      },

      package: {},
    };
  },
  provide: function () {
    return {
      subscribeObj: this.timeSlot,
    };
  },
  computed: mapGetters(["location", "userInfo"]),
  onLoad(options) {
    this.init(options);
  },
  methods: {
    submit(data) {
      console.log(data);

      const {
        date,
        startTime: { selectDate, begin },
      } = data;
      const year = new Date(date.timeStamp).getFullYear();

      const startTime = `${year}-${selectDate} ${begin}:00`;

      const url = "/pages/subPack/orderList/closeAccount";

      const query = {
        packageId: this.query.packageId,
        startTime,
        orderNo: this.query.appOrderNo,
        storeName: this.query.storeName,
        isDeposit: 1,
      };

      const queryString = objectToQueryString(query || {});

      uni.navigateTo({
        url: `${url}?${queryString}`,
      });
    },

    init(options) {
      this.query = options;

      this.fetchRoomTimeList();
      this.fetchPackage();
    },

    async fetchPackage() {
      const { packageId } = this.query;
      try {
        const { data } = await getStoreRoomPackageDetail(packageId);
        this.package = {
          ...this.package,
          ...data,
        };
      } catch (err) {
        console.log(err);
      }
    },

    fetchRoomTimeList() {
      const { storeRoomId } = this.query;
      let param = {
        teaChildId: storeRoomId,
      };

      getTimeListOrderV3(param).then((res) => {
        const { timeList } = res.data || {};

        this.timeSlot.timeList = timeList.map((el) => {
          return { ...el, sweep: 1 };
        });

        this.refreshTimeList();
      });
    },

    refreshTimeList() {
      this.$refs.times.initOnload();
      console.log("refreshTimeList");
    },
  },
};
</script>

<style>
page {
  background: #f2f3f7;
}
</style>

<style lang="scss" scoped>
.details {
  width: 100%;
  height: auto;
}
</style>
