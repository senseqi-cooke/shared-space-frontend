<template>
  <view class="container">
    <view class="banner">
      <view class="vpb">
        <image class="img" mode="heightFix" :src="banner"></image>
      </view>
      <view class="text">
        <view>成人用品外卖仓</view>
        <view class="sm-text">24小时无人值守</view>
      </view>
    </view>

    <view class="content vpb">
      <view>
        <view class="desc">
          <view class="p"> <text class="bold">合作费用:</text>20000元 </view>
          <view class="p"> <text class="bold">保证金:</text>2000 元 </view>
          <view class="p bold"> 企业支持: </view>
          <view class="p">1.无人系统值守，进/销/存客户管控系统</view>
          <view class="p">2.门禁设备/密码锁、网关、控制器、摄像头</view>
          <view class="p">3.线上门店首次接入:美团、饿了么</view>
          <view class="p">4.线上交付/店铺搭建、人员培训、数据分析 </view>
          <view class="p">5.赠送 5000 元货款等同市值 30000 元产品 </view>
          <view class="p">6.小票打印机/物料相关产品 </view>
          <view class="p">7.企业客服 24 小时在线服务，全托管管家式咨询</view>
        </view>

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
        <view class="button ok" @click="confirm">提交</view>
      </view>
    </view>
  </view>
</template>

<script>
import { tojoin } from "@/api/tojoin";

export default {
  data() {
    return {
      prefix: this.$VUE_APP_PIC_RESOURCES_URL,

      banner: `${this.$VUE_APP_PIC_RESOURCES_URL}/20240923134936665710.webp`,

      joinCity: "",
      youName: "",
      tel: "",
    };
  },

  methods: {
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
          }
        })
        .finally(() => {});
    },
  },
};
</script>

<style>
page {
  background-color: #fff;
}
</style>

<style lang="scss" scoped>
.container {
  height: 100vh;
  overflow: scroll;
  padding-bottom: 300rpx;
}

.vpb {
  padding: 0 20rpx;
}

.banner {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20rpx 0;

  .img {
    height: 372rpx;
    max-width: 100%;
  }

  .text {
    position: absolute;
    font-size: 38rpx;
    color: #fff;
    top: 140rpx;
    left: 56rpx;

    .sm-text {
      font-style: 24rpx;
      margin-top: 20rpx;
    }
  }
}

.content {
  .desc {
    font-size: 20rpx;
    color: #763030;
    line-height: 38rpx;
    text-align: left;
    letter-spacing: 1px;
    padding: 20rpx;

    .p {
      font-size: 24rpx;
      color: #333333;
      line-height: 43rpx;
    }

    .bold {
      font-weight: 600;
    }
  }

  .form {
    margin-top: 14rpx;
    background: linear-gradient(
      180deg,
      #ff96bc 0%,
      #ffbccc 34%,
      rgba(253, 234, 246, 0.11) 100%
    );
    border-radius: 24rpx;
    border: 1rpx solid #ffffff;
    padding: 25rpx;
    font-size: 20rpx;
    color: #763030;
    line-height: 35rpx;
    letter-spacing: 1px;

    /deep/ .joinPla {
      color: #666;
    }
  }

  .button-box {
    display: flex;
    margin-top: 24rpx;
    justify-content: center;

    .button {
      border-radius: 44rpx;
      height: 64rpx;
      width: 85%;
      font-weight: 500;
      font-size: 24rpx;
      color: #763030;
      line-height: 34rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(180deg, #ffe7f0, #ffb8d3);
      border: 1rpx solid #fff;
      box-shadow: 2rpx 2rpx 1rpx rgba(114, 109, 109, 0.26);
    }
  }
}
</style>
