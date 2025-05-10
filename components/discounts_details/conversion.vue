<!-- 团购兑换组件 -->
<template>
  <view class="conversion">
    <view class="topImage">
      <image src="@/static/dy.png" mode="widthFix"></image>
    </view>
    <view class="titleBox"> 美团，大众点评，抖音自助体验券 </view>
    <view class="formBox">
      <view class="inputBox">
        <input
          type="text"
          v-model="shopDefault.storeName"
          disabled
          @click="show = true"
        />
        <image src="@/static/icon/caret-bottom.png" mode="heightFix"></image>
      </view>
      <view class="inputBox">
        <input
          type="text"
          v-model="code"
          placeholder="点击输入卡券兑换码"
          placeholder-class="formPla"
          style="width: 80%"
        />
        <view class="tool" @click="scanCodeConfirm">
          <image src="@/static/icon/ma.png" mode="heightFix"></image>
        </view>
      </view>

      <!-- 			<view class="tool" @click="scanCodeConfirm">
				<image src="@/static/icon/ma.png" mode="heightFix"></image>
			</view> -->

      <view class="button" @click="submit"> 兑换 </view>
    </view>
    <u-picker
      :show="show"
      :columns="columns"
      keyName="storeName"
      @confirm="confirm"
      @cancel="cancel"
    ></u-picker>
  </view>
</template>

<script>
import { TopUpSelect } from "../../utils/request/gather.js";
import { storeNameList } from "@/api/mtstore";
import { dianpingPrepare, dianpingConsume, douyinConsume } from "@/api/coupon";
export default {
  data() {
    return {
      show: false, // 店铺选择列表的显示状态
      columns: [[]], // 店铺列表
      storeId: 0,
      shopDefault: {}, // 默认选择的店铺
      code: null, // 券码
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    submit() {
      // 提交兑换
      const app = this;
      if (!this.code) {
        uni.showToast({
          title: "请输入券码",
          icon: "none",
        });
        return false;
      }
      console.log("this.code.length:" + this.code.length);
      var isCorrect = 0; //

      /* 				if (this.code.length !== 10) {
					

				} */

      // 如果输入的10位数，则表示跳转到美团大众兑换
      if (this.code.length === 10) {
        let paramData = {
          storeId: app.storeId,
          receiptCode: app.code,
        };
        dianpingPrepare(paramData).then((res) => {
          if (res.status == 200) {
            var dianpingPrepareResult = res.data;
            var count = dianpingPrepareResult.count;
            var random = dianpingPrepareResult.random;
            let paramData1 = {
              storeId: app.storeId,
              receiptCode: app.code,
              count: count,
              random: random,
            };
            dianpingConsume(paramData1).then((res1) => {
              var dianpingResult = res1.data;
              uni.showToast({
                title: dianpingResult.msg,
                icon: "none",
              });
              if (res1.status == 200) {
                app.code = "";
              }
            });

            // 验验不正确情况
          } else {
          }
        });

        // 如果输入的15位数，则表示跳转到抖音兑换
      } else if (this.code.length === 15) {
        let paramData2 = {
          storeId: app.storeId,
          code: app.code,
        };

        douyinConsume(paramData2).then((res) => {
          if (res.status == 200) {
            var douyinResult = res.data;
            var errorCode = douyinResult.errorCode;
            var description = douyinResult.description;
            if (errorCode == 0) {
              uni.showToast({
                title: "抖音券兑换成功，请到个人中心查看卡券",
                icon: "none",
              });
              app.code = "";
            } else {
              uni.showToast({
                title: description,
                icon: "none",
              });
            }
            // 验验不正确情况
          } else {
          }
        });

        // 如果输入的不是10位数或15位数，提示输入兑换码格式不对
      } else {
        uni.showToast({
          title: "输入兑换码格式不对",
          icon: "none",
        });
        return false;
      }
    },
    goPage(url) {
      // 跳转页面
      uni.navigateTo({
        url,
      });
    },
    init() {
      // 内容初始化
      this.getShopList(); // 获取店铺列表
    },
    getShopList() {
      // 获取店铺列表
      let that = this;
      /* 				TopUpSelect().then(res => {
					that.shopDefault = res.data.data[0] // 默认选择第一个
					that.columns = [res.data.data]
				}) */
      storeNameList({ isAddPlatFlag: 0 }).then((res) => {
        that.shopDefault = res.data[0];
        this.storeId = this.shopDefault.storeId;
        //that.shopDefault.storeName = "所有门店";
        that.columns = [res.data];
      });
    },
    confirm(e) {
      // 确认
      this.shopDefault = e.value[0];
      this.storeId = this.shopDefault.storeId;
      this.cancel();
    },
    cancel() {
      // 取消
      this.show = false;
    },
    scanCodeConfirm() {
      // 扫码核销
      const app = this;
      uni.scanCode({
        success: function (res) {
          console.log("res.result:" + res.result);
          app.code = res.result;
          if (app.code.includes("https://v.douyin.com/")) {
            // 直接调用接口兑换
          }
          //app.$navTo('pages/confirm/doConfirm?code=' + res.result + '&id=0')
        },
      });
    },
  },
};
</script>

<style>
page {
  background: #fff;
}

.formPla {
  font-size: 24rpx;
}
</style>

<style lang="scss" scoped>
.conversion {
  width: 100%;
  height: auto;

  .topImage {
    width: 100%;
    height: auto;
    margin-top: 100rpx;
    display: flex;
    justify-content: center;

    image {
      width: 50%;
    }
  }

  .titleBox {
    margin-top: 50rpx;
    text-align: center;
    font-size: 35rpx;
  }

  .formBox {
    width: 70%;
    height: auto;
    margin: 40rpx auto 0;

    .inputBox {
      border: 1rpx solid #d6d6d6;
      width: 100%;
      height: 70rpx;
      margin-bottom: 60rpx;
      position: relative;

      input {
        flex: 1;
        height: 100%;
        margin-left: 25rpx;
      }

      image {
        height: 30rpx;
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translate(0, -50%);
      }
    }

    .tool {
      margin-bottom: -20rpx;
      image {
        height: 30rpx;
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translate(0, -50%);
      }
    }

    .button {
      width: 90%;
      height: auto;
      padding: 20rpx 0;
      color: #fff;
      text-align: center;
      background: linear-gradient(to right, #b3835b, #f1cfa0);
      border-radius: 50rpx;
      margin: 0rpx auto;
    }
  }
}
</style>
