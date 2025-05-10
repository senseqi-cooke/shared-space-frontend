<template>
  <u-overlay :show="visible" @click="close">
    <view class="warp">
      <view class="rect" @tap.stop>
        <image v-if="avatar" class="header" :src="avatar"> </image>
        <view v-else class="header">
          <u-icon name="account-fill" color="#666" size="120rpx"></u-icon>
        </view>
        <view>
          <view class="nickname">{{ userInfo.nickname || "微信用户" }}</view>

          <image
            v-if="isPromoter === 1"
            class="qr-code"
            :src="qrCodeUrl"
            mode="widthFix"
          />
          <view v-else class="tip">您目前还不是会员，点击下方按钮立成会员</view>
        </view>

        <view v-if="isPromoter === 1" class="card">
          <button class="item" open-type="share">
            <image class="icon" src="/static/images/v2/xiaochengxu.png" />
            <view>分享小程序</view>
          </button>
          <view class="item" @click="saveQrCode">
            <image class="icon" src="/static/images/v2/erweima.png" />
            <view>保存二维码</view>
          </view>
        </view>

        <view v-else class="button-box">
          <button class="button ok" @click="becomeMember">立成会员</button>
        </view>
      </view>
    </view>
  </u-overlay>
</template>

<script>
import { getSiteQrCode } from "@/api/user";
import { geStoreDetail } from "@/api/store";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    isPromoter: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      qrCodeUrl: "",
    };
  },

  mounted() {
    // if (this.isPromoter === 1) {
      this.getQrCode();
    // }
  },

  methods: {
    close() {
      this.$emit("close");
    },

    async getQrCode() {
      try {
        const { data } = await getSiteQrCode();
        this.qrCodeUrl = data;
      } catch (err) {
        uni.showToast({
          title: err.msg || err.response.data.msg || err.response.data.message,
          icon: "none",
          duration: 2000,
        });
      }
    },

    saveQrCode() {
      if (!this.qrCodeUrl) {
        uni.showToast({
          title: "二维码保存失败",
          icon: "none",
        });
      }
      uni.downloadFile({
        url: this.qrCodeUrl,
        fail(res) {
          uni.showModal({
            title: "提示",
            content: "保存失败",
          });
        },
        success(res) {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              uni.showToast({
                title: "保存成功！",
              });
            },
            fail: () => {
              uni.showToast({
                title: "保存失败",
                icon: "none",
              });
            },
          });
        },
      });
    },

    async becomeMember() {
      uni.showLoading({ title: "正在进入页面", mask: "true" });
      let storeName = "恋享·体验店";
      try {
        const { data } = await geStoreDetail(storeId);
        storeName = data?.name;
      } catch (err) {
        console.log(err);
      } finally {
        uni.hideLoading();
      }

      // 目前只做一个最短链路, 直接跳转到门店下的298价位的套餐详情中
      const url = `/pages/subPack/homePage/packageDetail`;
      const query = `packageId=8&storeId=6&storeName=${storeName}&becomeVip=true`;

      uni.navigateTo({
        url: `${url}?${query}`,
      });

      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.warp {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.rect {
  width: 648rpx;
  padding: 75rpx 30rpx 50rpx;
  background: linear-gradient(180deg, #ff96bc 0%, #ffbccc 34%, #fdf2f9 100%);
  border-radius: 24rpx;
  position: relative;

  .header {
    position: absolute;
    width: 155rpx;
    height: 155rpx;
    top: -90rpx;
    left: 50%;
    background: linear-gradient(340deg, #ffe7f0 0%, #ffb8d3 100%);
    transform: translateX(-50%);
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .qr-code {
    width: 100%;
  }

  .tip {
    height: 240rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12rpx 18rpx;
    color: #763030;
    font-size: 28rpx;
  }

  .nickname {
    margin: 20rpx auto 28rpx;
    text-align: center;
    font-weight: 500;
    font-size: 31rpx;
    color: #763030;
    line-height: 44rpx;
    letter-spacing: 1px;
  }

  .card {
    width: 100%;
    display: flex;
    margin-top: 48rpx;
    padding-bottom: 20rpx;
    justify-content: space-between;

    .item {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-weight: 500;
      font-size: 31rpx;
      color: #763030;
      line-height: 44rpx;
      letter-spacing: 1px;
      text-align: center;
      background-color: transparent;

      .icon {
        width: 55rpx;
        height: 55rpx;
        margin-bottom: 16rpx;
      }
    }
  }

  .button-box {
    margin-top: 24rpx;

    .button {
      border-radius: 44rpx;
      height: 64rpx;
      width: 80%;
      margin: 0 auto;
      font-weight: 500;
      font-size: 24rpx;
      color: #763030;
      line-height: 34rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24rpx;
      background: linear-gradient(180deg, #ffe7f0, #ffb8d3);
      border: 1rpx solid #fff;
      box-shadow: 2rpx 2rpx 1rpx rgba(114, 109, 109, 0.26);
    }

    .ok {
      background: linear-gradient(180deg, #ffe7f0, #ffb8d3);
      box-shadow: 2rpx 2rpx 1rpx rgba(114, 109, 109, 0.26);
    }
  }
}
</style>
