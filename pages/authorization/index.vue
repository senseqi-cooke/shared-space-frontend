<template>
  <view class="container">
    <!-- #ifdef MP-WEIXIN -->
    <view v-if="!token" class="force-login-wrap">
      <view class="force-login__content">
        <view class="login-notice"> 为了提供更优质的服务，请先登录 </view>
        <button
          class="cu-btn author-btn"
          open-type="getPhoneNumber"
          @getphonenumber="phoneLogin"
          v-if="isChecked"
        >
          手机号快捷登录
        </button>
        <button v-else class="cu-btn author-btn" @tap="phoneLoginBefore">
          手机号快捷登录
        </button>

        <!-- 
        <button class="cu-btn author-btn" v-if="canIUseGetUserProfile" @tap="getUserInfoProfile">授权并查看</button>
        <button class="cu-btn author-btn" v-else @getuserinfo="getUserInfoBtn" open-type="getUserInfo">授权并查看</button>
        -->
        <button class="cu-btn close-btn" @tap="back">暂不登录</button>
      </view>
    </view>

    <view class="hint" style="position: absolute; top: 530rpx">
      <radio :checked="isChecked" @tap.stop="onChange" />
      我已经阅读并遵守
      <text class="link" @tap="goNewsDetail(13)">
        《用户协议》
      </text>
      与
      <text class="link" @tap="goNewsDetail(14)">《隐私政策》</text>
      <!--上面协议是固定的 请添加相应id文章-->
    </view>

    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <view class="force-login-wrap">
      <!-- <image class="logo-bg" :src="`${$VUE_APP_RESOURCES_URL}/images/logo_bg.png`" mode="aspectFill"></image> -->
      <view class="force-login__content y-f">
        <view class="login-notice">为了提供更优质的服务，请先登录</view>
        <button class="cu-btn author-btn" @tap="toLogin">去登录</button>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { wxappAuth, getUser, getUserInfo } from "@/api/user";
import { login, authorize, getProvider } from "@/utils";
import dayjs from "dayjs";
import cookie from "@/utils/store/cookie";
import store from "@/store";

// 公众号登录
import { auth } from "@/libs/wechat.js";

export default {
  data() {
    return {
      authorize: false,
      canIUseGetUserProfile: false,
      isChecked: false,
    };
  },
  computed: {
    ...mapState(["isAuthorization", "$deviceType", "token"]),
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.canIUseGetUserProfile = true;
    }
    // // 先校验用户是否授权，如果没有授权，显示授权按钮
  },
  onHide() {
    this.updateAuthorizationPage(false);
    this.changeAuthorization(false);
  },
  onUnload() {
    this.updateAuthorizationPage(false);
    this.changeAuthorization(false);
  },
  methods: {
    ...mapActions(["changeAuthorization", "setUserInfo"]),
    ...mapMutations(["updateAuthorizationPage"]),
    onChange() {
      console.log("isChecked;", this.isChecked);
      this.isChecked = !this.isChecked;
    },
    goNewsDetail(id) {
      this.$yrouter.push({
        path: "/pages/news/NewsDetail/index",
        query: { id: id, isCustom: 1 },
      });
    },
    toLogin() {
      this.$yrouter.push({
        path: "/pages/user/Login/index",
        query: {},
      });
    },
    back() {
      this.$yrouter.switchTab({
        path: "/pages/homePage_V2/homePage_V2",
        query: {},
      });
    },
    getUserInfoBtn(data) {
      console.log(data);
      console.log("getUserInfoBtn");
      if (data.detail.errMsg == "getUserInfo:fail auth deny") {
        uni.showToast({
          title: "取消授权",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      uni.showLoading({
        title: "登录中",
      });
      login()
        .then((e) => {
          uni.hideLoading();
          console.log("重定向");
          this.$yrouter.reLaunch({
            path: cookie.get("redirect").replace(/\ /g, ""),
          });
        })
        .catch((error) => {
          uni.hideLoading();
          console.log(error);
          uni.showToast({
            title: error,
            icon: "none",
            duration: 2000,
          });
        });
    },
    // 申请获取用户信息
    getUserInfoProfile(data) {
      console.log("getUserInfoProfile");
      wx.getUserProfile({
        lang: "zh_CN",
        desc: "需要获取您的信息用来展示",
        success: (res) => {
          console.log("用户信息", res);
          uni.showLoading({
            title: "登录中",
          });
          login(res)
            .then((e) => {
              console.log("重定向");
              this.$yrouter.reLaunch({
                path: cookie.get("redirect").replace(/\ /g, ""),
              });
            })
            .catch((error) => {
              console.log(error);
              uni.showToast({
                title: error,
                icon: "none",
                duration: 2000,
              });
            });
        },
      });
    },
    // 微信用户手机号登录
    phoneLoginBefore() {
      if (!this.isChecked) {
        uni.showToast({
          title: "请勾选下面协议",
          icon: "none",
          duration: 2000,
        });
        return;
      }
    },
    // 微信用户手机号登录
    phoneLogin(e) {
      console.log("用户手机号登录");
      if (e.mp.detail.errMsg == "getPhoneNumber:ok") {
        console.log(e.mp.detail);
        getProvider()
          .then((provider) => {
            console.log("当前的环境商", provider);
            if (!provider) {
              reject();
            }
            // uni登录
            uni.login({
              provider: provider,
              success: async (loginRes) => {
                console.log(loginRes);
                let code = loginRes.code; // 获取开发code
                cookie.set("wxLoginCode", loginRes.code);
                let param = {
                  encryptedData: e.mp.detail.encryptedData,
                  iv: e.mp.detail.iv,
                  code: code,
                  spread: cookie.get("spread"),
                };
                console.log("wxappAuth：", param);
                wxappAuth(param)
                  .then((res) => {
                    console.log(
                      "登录成功,开始处理登录信息保存，并获取用户详情"
                    );
                    uni.hideLoading();
                    store.commit(
                      "login",
                      res.data.token,
                      dayjs(res.data.expires_time)
                    );
                    store.dispatch("userInfo", true);
                    getUserInfo()
                      .then((user) => {
                        console.log("获取用户信息成功");
                        uni.setStorageSync("uid", user.data.uid);
                        store.dispatch("setUserInfo", user.data);
                        this.$yrouter.reLaunch({
                          path: cookie.get("redirect").replace(/\ /g, ""),
                          //path: "userPage",
                        });
                      })
                      .catch((error) => {
                        console.log("获取用户信息失败");
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    console.log("登录接口调用失败3");
                  });
              },
            });
          })
          .catch((err) => {});
      } else {
        uni.showToast({
          title: "已拒绝授权",
          icon: "none",
          duration: 2000,
        });
      }
    },
  },
  mounted() {
    if (wx.getUserProfile) {
      this.canIUseGetUserProfile = true;
      console.log(this.canIUseGetUserProfile);
    }
  },
};
</script>

<style lang="less">
.hint {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 40rpx;
  font-size: 25rpx;
  color: #000;
  .link {
    color: #ff8e3c;
  }
  z-index: 100;
}
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
}

.force-login-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 10;
  // padding-top: 10px;
  top: 0;

  .logo-bg {
    width: 640rpx;
    height: 300rpx;
  }

  .force-login__content {
    position: absolute;
    left: 50%;
    top: 380rpx;
    transform: translate(-50%, -50%);

    .user-avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 40rpx;
    }

    .user-name {
      font-size: 35rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #000;
      margin-left: 50%;
      margin-bottom: 30rpx;
    }

    .login-notice {
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #000;
      line-height: 44rpx;
      width: 500rpx;
      text-align: center;
      margin-bottom: 40rpx;
    }

    .author-btn {
      width: 630rpx;
      height: 80rpx;
      background: linear-gradient(to right, #f35447 0%, #ff8e3c 100%);
      background: -moz-linear-gradient(to right, #f35447 0%, #ff8e3c 100%);
      // box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
      border-radius: 40rpx;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }

    .close-btn {
      width: 630rpx;
      height: 80rpx;
      margin-top: 30rpx;
      border-radius: 40rpx;
      border: 2rpx solid #eb3729;
      background: none;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #eb3729;
    }
  }
}
</style>
