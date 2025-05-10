<template>
  <view class="warp">
    <view class="rect" @tap.stop>
      <!-- <image
        class="header"
        src="../../static/images/v2/join.webp"
        mode="widthFix"
      /> -->
      <view>
        <!-- <view class="header-title">联营模式</view>

        <view class="desc">
          <view>
            午夜时空体验馆是一家合法经营，舒缓解压，尽情释放的无人自助联营托管模式公司。联营模式就是商家和公司各出一部分资源，然后共同分享经营成果。本质上是赚市场的钱，而不是赚商家的钱，公司与门店经营业绩高度挂钩，通过帮助商家做大从而赚取一定的利率，如商家出现亏损公司同样跟着亏损。
          </view>
          <view>
            与本公司合作只有开店资金有商家来出，如不开店不出资金。总部输出的有六样东西，第一是品牌，二是标准化，三是线上平台，四是供应链，五是收银系统，六是分润系统。总部的利润来自于每年的管理费，供应链的差价和商家的纯利润分红。
          </view>
        </view> -->

        <view class="form">
          <view class="inputBox">
            <view class="title"> <text>*</text>加盟城市 </view>
            <u--input
              placeholder="请输入加盟城市"
              border="bottom"
              placeholderClass="joinPla"
              v-model="joinCity"
              required
            ></u--input>
          </view>
          <view class="inputBox">
            <view class="title"> <text>*</text>您的姓名 </view>
            <u--input
              placeholder="请输入您的姓名"
              border="bottom"
              placeholderClass="joinPla"
              v-model="youName"
              required
            ></u--input>
          </view>
          <view class="inputBox">
            <view class="title"> <text>*</text>您的电话 </view>
            <u--input
              placeholder="请输入您的电话"
              border="bottom"
              placeholderClass="joinPla"
              v-model="tel"
              required
            ></u--input>
          </view>
        </view>
      </view>
      <view class="button-box">
        <view class="button cancel" @click="cancel">取消</view>
        <view class="button ok" @click="confirm">确定</view>
      </view>
    </view>
  </view>
</template>

<script>
import { tojoin } from "@/api/tojoin";

export default {
  data() {
    return {
      joinCity: "",
      youName: "",
      tel: "",
    };
  },

  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      if (this.joinCity === "") {
        uni.showToast({
          title: "请输入加盟城市",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      if (this.youName === "") {
        uni.showToast({
          title: "请输入您的姓名",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      if (this.tel === "") {
        uni.showToast({
          title: "请输入您的电话",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      let data = {
        joinCity: this.joinCity,
        youName: this.youName,
        tel: this.tel,
        leaveMsg: this.leaveMsg,
      };
      tojoin(data)
        .then((res) => {
          if (res.status == 200) {
            uni.showToast({
              title: "提交成功",
              icon: "success",
              duration: 5000,
            });

            this.$emit("confirm");
          }
        })
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
  // width: 600rpx;
  width: 100%;
  padding: 20rpx 30rpx 20rpx;
  background: linear-gradient(180deg, #ffbccc, #fff);
  border-radius: 24rpx;
  position: relative;
  margin-bottom: 120rpx;

  .header {
    position: absolute;
    width: 176rpx;
    top: -50rpx;
    left: 50%;
    transform: translateX(-50%);
  }

  .header-title {
    font-weight: bolder;
    font-size: 56rpx;
    color: #763030;
    line-height: 68rpx;
    text-align: center;
  }

  .desc {
    margin-top: 14rpx;
    font-weight: 600;
    font-size: 20rpx;
    color: #763030;
    line-height: 38rpx;
    text-align: left;
    letter-spacing: 1px;
    padding: 20rpx;
    border: 2rpx solid #fff;
  }

  .form {
    margin-top: 14rpx;
    font-size: 20rpx;
    color: #763030;
    line-height: 35rpx;
    letter-spacing: 1px;
  }

  .button-box {
    display: flex;
    margin-top: 24rpx;
    justify-content: space-between;

    .button {
      border-radius: 44rpx;
      height: 64rpx;
      width: 45%;
      font-weight: 500;
      font-size: 24rpx;
      color: #763030;
      line-height: 34rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .cancel {
      border: 2rpx solid #ff639e;
    }

    .ok {
      background: linear-gradient(180deg, #ffe7f0, #ffb8d3);
      border: 1rpx solid #fff;
      box-shadow: 2rpx 2rpx 1rpx rgba(114, 109, 109, 0.26);
    }
  }
}
</style>
