<!-- 详情页-快速下单，不需要选时间，选一个套餐就可以了 -->
<template>
  <view class="details">
    <view class="preview">
      <image
        :src="detail.icon"
        mode="aspectFill"
        @click="onPreviewImages(0, [detail.icon])"
      ></image>
    </view>
    <view class="desc">
      <view class="name">
        {{ becomeVip ? "支付298立成会员" : detail.packageName || "-" }}
      </view>
      <view class="price-box">
        <view class="price">￥{{ moneyFilter(detail.packagePrice) }}</view>
        <image
          class="time"
          :src="`${prefix}/20240905171214390245.webp`"
          mode="widthFix"
        ></image>
      </view>
    </view>

    <view class="memo-box">
      <view class="label">{{ becomeVip ? "说明" : "" }}</view>
      <view class="content" v-if="becomeVip">
        {{ becomeVipDesc }}
      </view>
      <view class="content" v-else>
        <jyf-parser :html="detail.instr || '-'"></jyf-parser>
      </view>
      <template v-if="!becomeVip">
        <view class="label mt">体验时长</view>
        <view class="content"> 体验{{ detail.packageMin || "-" }}分钟 </view>
      </template>
    </view>

    <view v-if="!becomeVip" class="pic-list">
      <view class="title">门店详情</view>
      <view
        class="pic"
        v-for="(p, i) in images"
        :key="i"
        @click="onPreviewImages(i, images)"
      >
        <image :src="p" mode="aspectFill"></image>
      </view>
    </view>

    <view class="bottomBox">
      <view class="button">
        <view @click="toStore">
          <u-icon
            label="门店"
            size="40rpx"
            labelPos="bottom"
            labelSize="22rpx"
            labelColor="#999999"
            :name="`${prefix}/20240905171319760209.webp`"
          ></u-icon>
        </view>

        <view class="ml" @click="call">
          <u-icon
            label="客服"
            size="40rpx"
            labelPos="bottom"
            labelSize="22rpx"
            labelColor="#999999"
            :name="`${prefix}/20240905171313355689.webp`"
          ></u-icon>
        </view>
      </view>
      <view class="pay-box">
        <view class="pay" @click="toPay" v-if="detail.status == 1">
          立即支付
        </view>
        <view class="pay invalid" v-if="detail.status == 2"> 暂未上架 </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { goTenXunLoca } from "@/utils/tenxunLoca.js";
import { getStoreRoomPackageDetail, geStoreDetail } from "@/api/store";
import { objectToQueryString } from "@/utils/index";

export default {
  data() {
    return {
      prefix: this.$VUE_APP_PIC_RESOURCES_URL,

      query: {},
      detail: {
        id: "",
        storeId: "",
      },

      phone: "",

      becomeVipDesc:
        "本次支付平台赠送一张同等价值的优惠券可随时消费或转赠他人。支付成功后可立即成为会员, 平台会为你生成属于你自己的推广小程序和二维码(请点击“我的”再点击“推广”即可查看)",
    };
  },
  computed: {
    ...mapGetters(["location", "userInfo"]),

    images() {
      if (this.detail.images) {
        return this.detail.images.split(",");
      }
      return [];
    },

    becomeVip() {
      return !!this.query?.becomeVip;
    },
  },
  onLoad(options) {
    this.init(options);
  },

  methods: {
    async init(options) {
      this.query = options;

      const { packageId, storeId } = options;

      try {
        const { data } = await getStoreRoomPackageDetail(packageId);
        this.detail = {
          ...this.detail,
          ...data,
        };

        const { data: storeDetail } = await geStoreDetail(storeId);
        const { phone = "" } = storeDetail;
        this.phone = phone;
      } catch (err) {
        console.log(err);
      }
    },

    formatePrice(money) {
      return parseInt(money);
    },

    moneyFilter(value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2);
      return realVal;
    },

    // 浏览商品图片
    onPreviewImages(index, arr) {
      uni.previewImage({
        current: arr[index],
        urls: arr,
      });
    },

    toMap() {
      goTenXunLoca(this.address, this.latitude, this.longitude);
    },

    toStore() {
      const url = "/pages/storeList/index";

      uni.navigateTo({
        url,
      });
    },

    call() {
      uni.makePhoneCall({
        phoneNumber: this.phone,
        success: function () {
          console.log("拨打电话成功");
        },
        fail() {
          uni.showToast({
            title: "拨打电话失败，请确认电话格式是否正确",
            icon: "none",
          });
        },
      });
    },

    toPay() {
      const url = "/pages/subPack/orderList/closeAccount";
      console.log(this.detail, "query");

      const queryString = objectToQueryString(this.query);

      uni.navigateTo({
        url: `${url}?${queryString}`,
      });
    },
  },
};
</script>

<style>
page {
  background: #efefef;
}
</style>

<style lang="scss" scoped>
.details {
  width: 100%;
  height: auto;
  padding-bottom: 165rpx;

  .preview {
    width: 100%;
    height: 434rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .desc {
    background-color: #fff;
    padding: 28rpx 20rpx 20rpx;

    .name {
      font-weight: 500;
      font-size: 31rpx;
      color: #333333;
      line-height: 43rpx;
      letter-spacing: 2px;
    }

    .price-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10rpx;

      .price {
        font-weight: 500;
        font-size: 37rpx;
        color: #ff6ca0;
        line-height: 51rpx;
      }

      .time {
        width: 148rpx;
      }
    }
  }

  .memo-box {
    background-color: #fff;
    padding: 28rpx 35rpx;
    margin-top: 20rpx;

    .label {
      font-weight: 500;
      font-size: 24rpx;
      color: #333333;
      line-height: 39rpx;
    }

    .mt {
      margin-top: 20rpx;
    }

    .content {
      font-size: 24rpx;
      color: #666666;
      line-height: 33rpx;
    }
  }

  .pic-list {
    background-color: #fff;
    padding: 28rpx 20rpx;
    margin-top: 20rpx;

    .title {
      font-weight: 500;
      font-size: 24rpx;
      color: #333333;
      line-height: 39rpx;
    }

    .pic {
      margin-top: 20rpx;
      width: 100%;

      image {
        width: 100%;
      }
    }
  }

  .bottomBox {
    width: 100%;
    height: 145rpx;
    background: #ffffff;
    box-shadow: 0rpx -1rpx 10rpx 2rpx rgba(0, 0, 0, 0.09);
    border-radius: 17rpx 17rpx 0rpx 0rpx;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;

    .button {
      height: 100rpx;
      background: #fff;
      display: flex;
      align-items: center;
      padding-left: 65rpx;

      .ml {
        margin-left: 65rpx;
      }
    }

    .pay-box {
      height: 100rpx;
      display: flex;
      align-items: center;

      .pay {
        width: 235rpx;
        height: 70rpx;
        margin-right: 30rpx;
        background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
        border-radius: 6rpx;
        font-weight: 600;
        font-size: 30rpx;
        color: #763030;
        line-height: 70rpx;
        letter-spacing: 1px;
        text-align: center;
      }
      .invalid {
        background: linear-gradient(180deg, #ffffff 0%, #888888 100%);
        color: #333;
      }
    }
  }
}
</style>
