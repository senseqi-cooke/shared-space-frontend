<!-- 个人中心（我的）首页 -->
<template>
  <view class="user-page">
    <template v-if="$store.getters.token || userInfo.uid">
      <view class="header">
        <view class="rect">
          <image
            v-if="avatar"
            class="avatar"
            :src="avatar"
            mode="widthFix"
            @click="updateInfo"
          >
          </image>
          <u-icon
            v-else
            name="account-fill"
            color="#666"
            size="120rpx"
            @click="updateInfo"
          ></u-icon>

          <view class="info">
            <view class="user-name">
              <view>{{ nickname ? nickname : "微信用户" }}</view>

              <view
                class="promoter"
                :class="isPromoter === 1 ? 'vip' : 'normal'"
              >
                <template v-if="isPromoter === 1">
                  <image
                    class="icon"
                    src="/static/images/v2/vip.png"
                    mode="widthFix"
                  />
                  <text>VIP1</text>
                </template>
                <template v-else>
                  <image
                    class="icon"
                    src="/static/images/v2/normal.png"
                    mode="widthFix"
                  />
                  <text>普通会员</text>
                </template>
              </view>
            </view>

            <view class="user-id"> 账户：{{isPromoter}}{{ userInfo.uid + 932000 }} </view>
          </view>
        </view>
      </view>

      <view class="content">
        <view class="card" v-for="menuItem in menu" :key="menuItem.id">
          <view v-if="menuItem.title" class="card-header">
            <view class="card-title">{{ menuItem.title }}</view>
            <view
              v-if="menuItem.subTitle"
              class="card-sub-title"
              @click="subTitleClick(menuItem)"
            >
              {{ menuItem.subTitle }}
            </view>
          </view>
          <u-grid :border="false" :col="menuItem.gridCol">
            <u-grid-item
              v-for="item in menuItem.list"
              :key="item.id"
              @click="clickFn(item)"
            >
              <view class="icon-box">
                <u-icon
                  v-if="item.useIcon"
                  :name="item.icon"
                  color="#666"
                  size="50rpx"
                ></u-icon>
                <image
                  v-else
                  class="icon"
                  :src="item.icon"
                  mode="widthFix"
                ></image>
              </view>
              <text class="grid-text">{{ item.title }}</text>
            </u-grid-item>
          </u-grid>
        </view>
      </view>
    </template>

    <Authorization v-else />

    <promotion
      :visible="promotionVisible"
      :avatar="avatar"
      :isPromoter="isPromoter"
      @close="promotionVisible = false"
      @confirm="promotionVisible = false"
    />

    <view>
      <u-popup :show="show" mode="center" style="border-radius: 10px">
        <view class="u-popup-slot">
          <view class="cuohao">
            <u-icon
              size="24"
              @click="show = !show"
              name="close-circle"
            ></u-icon>
          </view>
          <p>获取头像</p>
          <button
            class="touxiang1"
            style="
              background-color: transparent;
              color: transparent;
              border: none;
              border: 0;
            "
            size="mini"
            open-type="chooseAvatar"
            @chooseavatar="chooseavatar"
          >
            <image
              class="touxiang1-img"
              :src="
                avatar
                  ? avatar
                  : `${$VUE_APP_PIC_RESOURCES_URL}/images/default.png`
              "
              mode=""
            ></image>

            <div class="camera">
              <u-icon name="camera-fill"></u-icon>
            </div>
          </button>
          <div class="shurukuang">
            <p class="shurukuang-p">昵称</p>
            <u-input
              v-model="inputName"
              placeholder="请输入昵称"
              :type="type"
              :border="border"
            />
          </div>
          <button class="quchongzhi" @click="updateUserInforNickname()">
            确认
          </button>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
  getUserStat,
  getUserInfo,
  getMenuUser,
  wxappAuth,
  bindingPhone,
  wxappBindingPhone,
  wxappGetUserInfo,
  getUserGradeByUserId,
  userInfor,
  updateUserAvatar,
  updateUserNickname,
} from "@/api/user";
import {
  isWeixin,
  VUE_APP_PIC_RESOURCES_URL,
  parseQuery,
  getProvider,
} from "@/utils";
import { UserPageKefu } from "../../utils/request/gather.js";
import Authorization from "@/pages/authorization/index";
import Promotion from "@/components/promotion/index";
import { VUE_APP_API_URL } from "@/config";
import store from "@/store";

import wodedianpu from "../../static/images/v2/wodedianpu.webp";
import tuiguangyaoqing from "../../static/images/v2/tuiguangyaoqing.webp";
import yue from "../../static/images/v2/yue.webp";
import youhuijuan from "../../static/images/v2/youhuijuan.webp";
import daifukuan from "../../static/images/v2/daifukuan.webp";
import daipingjia from "../../static/images/v2/daipingjia.webp";
import tuikuan from "../../static/images/v2/tuikuan.webp";
import icon2 from "../../static/images/v2/icon2.webp";
import daishouhuo from "../../static/images/v2/daishouhuo.webp";
import fenxiao from "../../static/images/v2/fenxiao.webp";
import shouhuodizhi from "../../static/images/v2/shouhuodizhi.webp";
import shoucang2 from "../../static/images/v2/shoucang-2.webp";
import iconzuji from "../../static/images/v2/icon-zuji.webp";
import yonghufankui from "../../static/images/v2/yonghufankui.webp";
import fnsYaoqing from "../../static/tuiguang/fns-yaoqing.png";

export default {
  components: {
    Authorization,
    Promotion,
  },
  data() {
    return {
      show: false,
      info: {}, // 用户信息
      kefuShow: false, // 客服层的显示
      kefuImage: "", // 客服图片路径
      canIUseGetUserProfile: false,
      isWeixin: false,
      userCouponNum: 0,
      sumUserBalance: 0,
      mtStaff: {},
      userGradeName: "",
      userGradeDiscount: 10,
      avatar: "",
      nickname: "",
      promotionVisible: false,
      inputName: "",
      miniappSiteType: "list",
      isPromoter: 0,
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),

    // 操作菜单
    menu() {
		// 获取是否体验版
		let { miniappSiteType } = JSON.parse(
		  uni.getStorageSync("miniappSetting") || "{}"
		);
		this.miniappSiteType = miniappSiteType || "list";
		// miniappSiteType = "home";
      const defaultMenu = [
        {
          title: "账户",
          subTitle: "",
          id: 1,
          list: [
            {
              icon: wodedianpu,
              id: 1,
              title: "商家",
			  hide: miniappSiteType == "list"
            },
            {
              icon: tuiguangyaoqing,
              id: 2,
              title: "推广",
            },
            {
              icon: yue,
              id: 3,
              title: "账户余额",
            },
            {
              icon: youhuijuan,
              id: 4,
              title: "优惠券",
            },
          ],
          gridCol: 4,
        },
        {
          title: "订单",
          subTitle: "",
          id: 2,
          list: [
            {
              icon: daifukuan,
              id: 5,
              title: "待付款",
            },
            {
              useIcon: true,
              icon: "clock",
              id: 6,
              title: "待使用",
            },
            {
              icon: daipingjia,
              id: 7,
              title: "待评价",
            },
            {
              icon: tuikuan,
              id: 8,
              title: "退款",
            },
          ],
          gridCol: 4,
        },
        {
          title: "商城订单",
          id: 3,
          subTitle: "全部订单",
		  hide: miniappSiteType == "list",
          subTitleClick: () => {},
          list: [
            {
              icon: daifukuan,
              id: 9,
              title: "待付款",
            },
            {
              icon: icon2,
              id: 10,
              title: "待发货",
            },
            {
              icon: daishouhuo,
              id: 11,
              title: "待收货",
            },
            {
              icon: daipingjia,
              id: 12,
              title: "待评价",
            },
            {
              icon: tuikuan,
              id: 13,
              title: "退款",
            },
          ],
          gridCol: 5,
        },
        {
          title: "其他",
          subTitle: "",
          id: 4,
          list: [
            {
              icon: fenxiao,
              id: 14,
              title: "商品分销",
			  hide: miniappSiteType == "list"
            },
            {
              icon: youhuijuan,
              id: 15,
              title: "优惠券",
			  hide: miniappSiteType == "list"
            },
            {
              icon: shouhuodizhi,
              id: 16,
              title: "收货地址",
            },
            {
              icon: daipingjia,
              id: 17,
              title: "我的评价",
              hide: true,
            },
            {
              icon: shoucang2,
              id: 18,
              title: "收藏",
              hide: true,
            },
            {
              icon: iconzuji,
              id: 19,
              title: "足迹",
              hide: true,
            },
            {
              useIcon: true,
              icon: "kefu-ermai",
              id: 21,
              title: "官方客服",
            },
            {
              icon: fnsYaoqing,
              id: 22,
              title: "保洁员入口",
              hide: this.mtStaff.category != 2,
            },
          ],
          gridCol: 4,
        },
      ];

      const filterMenu = defaultMenu.filter((el) => {
        if (!el.hide) {
          el.list = el.list.filter((side) => !side.hide);
        }
        return !el.hide;
      });

      return filterMenu;
    },
  },

  onShow() {
    console.log("onShow");
    this.getUserInfor();
    this.userStat();
    this.getKefu();
    // 获取用户会员对应的等级折扣
    this.getUserGrade();
  },
  methods: {
    ...mapMutations(["updateAuthorizationPage"]),

    subTitleClick({ id }) {
      if (id) {
        if (id === 3) {
          // 商城 - 全部订单
          this.goPage("/pages/shopmall/order/index");
        }
      }
    },
    // 点击事件集合
    clickFn({ id }) {
      if (id) {
        switch (id) {
          case 1: // 商家
            this.goPageShop("/pages/subPack/shop/business", this.mtStaff);
            return;
          case 2: // 推广
              //刷新一下用户信息

            return (this.promotionVisible = true);
          case 3: // 账户余额
            return this.goPage("/pages/subPack/userPage/balanceList");
          case 4: // 优惠券
            return this.goPage("/pages/subPack/userPage/myCoupon1");
          case 5: // 待付款
            return this.goTabbar("/pages/orderList/orderList");
          case 6: // 待使用
            return this.goTabbar("/pages/orderList/orderList");
          case 7: // 待评价
            return this.goTabbar("/pages/orderList/orderList");
          case 8: // 退款
            return this.goTabbar("/pages/orderList/orderList");
          case 9: // 商城订单 - 待付款
            return this.goPage("/pages/shopmall/order/index");
          case 10: // 商城订单 - 待发货
            return this.goPage("/pages/shopmall/order/index");
          case 11: // 商城订单 - 待收货
            return this.goPage("/pages/shopmall/order/index");
          case 12: // 商城订单 - 待评价
            return this.goPage("/pages/shopmall/order/index");
          case 13: // 商城订单 - 退款
            return this.doing();
          case 14: // 商品分销
            return this.goPage("/pages/userPage/promotion/UserPromotion/index");
          case 15: // 优惠券
            return this.doing();
          case 16: // 收货地址
            return this.goPage("/pages/subPack/mall/address-list");
          case 17: // 我的评价
            return this.doing();
          case 18: // 收藏
            return this.doing();
          case 19: // 足迹
            return this.doing();
          case 20: // 问题反馈
            return this.doing();
          case 21: // 官方客服
            return this.call();
          case 22: // 保洁员
            return this.goPageShop(
              "/pages/subPack/shop/shopIndex",
              this.mtStaff
            );
        }
        return;
      }
    },

    doing() {
      uni.showToast({
        title: "功能建设中...",
        icon: "none",
      });
    },

    userStat() {
      let param = {
        userId: this.userInfo.uid,
      };
      getUserStat(param).then((res) => {
        var userCouponNum = res.data.userCouponNum;
        var sumUserBalance = res.data.sumUserBalance;
        var mtStaff = res.data.mtStaff;
        this.userCouponNum = userCouponNum;
        this.sumUserBalance = sumUserBalance;
        this.mtStaff = mtStaff;
        console.log("mtStaff:" + JSON.stringify(mtStaff));
      });
    },

    // 获取用户信息
    getUserInfor() {
      console.log("获取用户信息")
      let that = this;
      let param = { nickname: that.nickname };
      userInfor(param).then((res) => {
        const { data } = res;
        this.avatar = data.avatar;
        this.nickname = data.nickname;
        this.inputName = data.nickname;
        console.log("data.isPromoter:",data.isPromoter);
        that.isPromoter = data.isPromoter;
        console.log("that.isPromoter:",that.isPromoter);
      });
    },

    updateInfo() {
      this.show = true;
      this.inputName = this.nickname;
    },

    // 更新用户信息-头像
    updateUserInforAvatar() {
      let that = this;
      let param = { avatar: that.avatar };
      updateUserAvatar(param).then((res) => {
        if (res.status == 200) {
          uni.showToast({
            title: "修改成功",
            icon: "success",
            duration: 1000,
          });
          that.show = false;
        } else {
          uni.showToast({
            title: "修改失败",
            icon: "none",
            duration: 1000,
          });
          that.show = false;
        }
      });
    },

    // 修改用户信息-昵称
    updateUserInforNickname() {
      let that = this;
      let param = { nickname: that.inputName };
      updateUserNickname(param).then((res) => {
        if (res.status == 200) {
          uni.showToast({
            title: "修改成功",
            icon: "success",
            duration: 1000,
          });
          that.show = false;
        }

        this.getUserInfor();
      });
    },

    chooseavatar(e) {
      let that = this;
      console.log("detal:", e.detail);

      uni.uploadFile({
        url: `${VUE_APP_API_URL}/api/upload`,
        filePath: e.detail.avatarUrl,
        header: {
          Authorization: "Bearer " + store.getters.token,
        },
        name: "file",
        success: (res) => {
          console.log("JSON.parse(res.data).link:" + JSON.parse(res.data).link);
          that.avatar = JSON.parse(res.data).link;
          // 更新用户头像
          that.updateUserInforAvatar();
        },
        fail: (err) => {
          uni.showToast({
            title: "上传图片失败",
            icon: "none",
            duration: 2000,
          });
        },
        complete: (res) => {
          uni.hideLoading();
        },
      });
    },

    goPage(url) {
      // 跳转页面
      uni.navigateTo({
        url,
      });
    },

    goPageShop(url, mtStaff) {
      url =
        url +
        "?category=" +
        mtStaff.category +
        "&storeId=" +
        mtStaff.storeId +
        "&mobile=" +
        mtStaff.mobile;
      uni.navigateTo({
        url,
      });

      /* 				if(mtStaff.category===2){
					uni.requestSubscribeMessage({
						tmplIds: ["EZfzMbg9V8eXb8DZqzUwy7NZFvgYzRDWhnjIQW0ZIVM"],
						success(res) {
							console.log(res)
							url = url+'?category='+mtStaff.category+'&storeId='+mtStaff.storeId+'&mobile='+mtStaff.mobile;
							uni.navigateTo({
								url
							})
						},
						fail(error) {
							console.log(error)
						}
					})
				}else{
					url = url+'?category='+mtStaff.category+'&storeId='+mtStaff.storeId+'&mobile='+mtStaff.mobile;
					uni.navigateTo({
						url
					})
				} */
    },

    goTabbar(url) {
      // 跳转tabber页面
      /* 				if (!this.token) {
					uni.navigateTo({
						url: "/pages/Login/login"
					})
				} */
      uni.switchTab({
        url,
      });
    },

    call() {
      // 拨打电话
      let phone = "13800138000";
      uni.makePhoneCall({
        phoneNumber: phone,
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

    getKefu() {
      // 获取联系客服的信息
      let that = this;
      UserPageKefu().then((res) => {
        that.kefuImage = res.data.data.image;
      });
    },

    getUserGrade() {
      let param = {};
      getUserGradeByUserId(param).then((res) => {
        var mtUserGrade = res.data.mtUserGrade;
        if (mtUserGrade != null) {
          this.userGradeName = mtUserGrade.name;
          this.userGradeDiscount = mtUserGrade.discount;
        }
      });
    },
  },
};
</script>

<style>
page {
  background: #f8f8fa;
}

@import url("./my.css");
</style>

<style scoped lang="scss">
.user-page {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow-y: scroll;

  .header {
    background: linear-gradient(
      185deg,
      #ff96bc 0%,
      #ffbccc 34%,
      rgba(253, 234, 246, 0.11) 100%
    );
    height: 576rpx;
    padding-top: 160rpx;

    .rect {
      display: flex;
      align-items: center;
      padding: 0 30rpx;

      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        overflow: hidden;
      }

      .info {
        margin-left: 30rpx;

        .user-name {
          display: flex;
          align-items: center;
          font-weight: 500;
          font-size: 30rpx;
          color: #333333;
          height: 42rpx;

          .promoter {
            flex: 1;
            height: 42rpx;
            display: flex;
            align-items: center;
            margin-left: 28rpx;
            padding: 0 16rpx;
            border-radius: 21rpx;
            font-weight: 600;
            font-size: 17rpx;
            line-height: 24rpx;
            text-wrap: nowrap;

            &.normal {
              background: linear-gradient(270deg, #c9c9c9 0%, #ffffff 100%);
              color: #81898b;
            }

            &.vip {
              background: linear-gradient(180deg, #f5ed81 0%, #e2ab2c 100%);
              font-size: 25rpx;
              color: #7b5706;
              line-height: 35rpx;
              .icon {
                width: 36rpx;
                margin-right: 10rpx;
              }
            }

            .icon {
              width: 26rpx;
              margin-right: 6rpx;
            }
          }
        }

        .user-id {
          margin-top: 6rpx;
          font-size: 23rpx;
          color: #333333;
          line-height: 33rpx;
        }
      }
    }
  }

  .content {
    margin-top: -240rpx;

    .card {
      width: 720rpx;
      padding: 24rpx;
      background-color: #fff;
      border-radius: 14rpx;
      margin: 0 auto;

      &:not(:nth-child(1)) {
        margin-top: 20rpx;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .card-title {
          font-weight: 600;
          font-size: 26rpx;
          color: #333333;
          line-height: 36rpx;
        }

        .card-sub-title {
          font-size: 20rpx;
          color: #999999;
          line-height: 28rpx;
        }
      }

      .icon-box {
        padding-top: 20rpx;
      }

      .icon {
        width: 50rpx;
        height: 0;
      }

      .grid-text {
        font-size: 23rpx;
        color: #333333;
        line-height: 33rpx;
        text-align: center;
      }
    }
  }
}

.edit {
  background-color: #fff;
  padding: 8upx 16upx;
  border-radius: 24upx;
  height: 48upx;
  line-height: 40upx;
}

.edit-img {
  width: 24upx;
  height: 24upx;
}

.edit-span {
  font-size: 24upx;
}

.u-popup-slot {
  width: 600upx;
  border-radius: 20upx;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.cuohao {
  position: relative;
  top: 20upx;
  right: -534upx;
}

.touxiang1 {
  display: flex;
  justify-content: center;
  margin: 40upx 0;
  margin-left: 26upx;
}

.touxiang1-img {
  border-radius: 50%;
  width: 100upx;
  height: 100upx;
}

.camera {
  position: relative;
  top: 60upx;
  right: 24upx;
}
.shurukuang {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #f7f7f7;
  background-color: #f7f7f7;
  margin: 0 40upx;
  border-radius: 20upx;
  padding: 20upx 20upx;
}
.shurukuang-p {
  margin-right: 40upx;
}

/deep/ .u-popup__content {
  border-radius: 20upx;
}
.u-popup-slot {
  background-image: url(https://shareminiapi2.tonetn.com/static/images/yonghubeijing.png);
  background-position: 0 0;
  background-size: 100%;
  background-repeat: no-repeat;
}

.quchongzhi {
  background-color: #ffe100;
  width: 200upx;
  border-radius: 60upx;
  font-weight: 700;
  margin-top: 40upx;
  margin-bottom: 40upx;
}
</style>
