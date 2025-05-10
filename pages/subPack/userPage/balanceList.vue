<template>
  <view class="balance-view">
    <view class="card">
      <view class="label-large">账户余额(元)</view>
      <view class="value-large">
        <view>{{ formatNumber(brokerageBalance) }}</view>
        <view class="btn" @click="cashOutVisible = true">提现</view>
      </view>
      <u-line margin="36rpx 0" color="rgba(255,255,255,0.53)"></u-line>
      <view class="money-box">
        <view class="label-small">充值余额(元)</view>
        <view class="value-small">{{ formatNumber(platformBalance) }}</view>
      </view>
    </view>

    <view class="list">
      <view class="title">交易明细</view>
      <u-line margin="30rpx 0 0"></u-line>
      <view class="list__content">
        <u-list :height="listHeight" @scrolltolower="scrolltolower">
          <u-list-item v-for="(item, index) in billList" :key="index">
            <u-cell
              :title="item.title"
              :value="`${item.pm === 1 ? '+' : '-'} ${formatNumber(
                item.number
              )}`"
              :label="item.createTime"
            >
            </u-cell>
          </u-list-item>
        </u-list>
      </view>
    </view>

    <u-popup :show="cashOutVisible" :round="20" @close="cashOutVisible = false">
      <view class="pop-warp">
        <view class="rect" @tap.stop>
          <view class="text-c">可提现总额（元）</view>
          <view class="money text-c">{{ formatNumber(brokerageBalance) }}</view>
          <view class="tip">提现金额</view>
          <view class="input">
            <u--input
              v-model="amount"
              prefixIcon="rmb"
              type="digit"
              placeholder="请输入金额"
              border="bottom"
              clearable
              fontSize="40rpx"
            ></u--input>
          </view>
          <u-radio-group value="weChat">
            <view class="channel">
              <view class="left">
                <image src="/static/images/weixin.png" mode=""></image>
                <text>微信 - 零钱</text>
              </view>
              <u-radio activeColor="#ff6ba0" name="weChat" />
            </view>
          </u-radio-group>
          <view class="btn" @click="cashOut">提现</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getUserBalance, getUserBillList, extractCommission } from "@/api/user";
export default {
  data() {
    return {
      brokerageBalance: "", // 佣金
      platformBalance: "", // 余额
      billList: [], // 明细列表
      page: 0,
      limit: 25,
      total: 0,

      amount: 0,

      listHeight: 0,

      cashOutVisible: false,
    };
  },
  onLoad() {
    this.init();
  },
  methods: {
    init() {
      this.fetchUserBalance();
      this.fetchUserBillList();
      this.initListHeight();
    },

    // 提现
    cashOut() {
      if (isNaN(Number(this.amount))) {
        return uni.showToast({ title: "请输入正确的金额", icon: "none" });
      }
      if (+this.amount > this.brokerageBalance) {
        return uni.showToast({ title: "提现金额不得大于余额", icon: "none" });
      }
      // uni.showToast({ title: "正在建设中...", icon: "none" });
      // return;
      extractCommission({
        money: this.amount,
      })
        .then((res) => {
          uni.showToast({ title: res.data, icon: "none" });
        })
        .catch((err) => {
          uni.showToast({ title: err.msg || "出错了", icon: "none" });
        });
    },

    formatNumber(number) {
      if (number === null || number === undefined) return "-";
      if (number === 0) return "0.00";
      const parts = String(number).toString().split(".");
      if (parts.length === 1 || parts[1].length < 2) {
        return (number || 0).toFixed(2);
      } else {
        return number;
      }
    },

    fetchUserBalance() {
      getUserBalance().then((res) => {
        const { brokerageBalance, platformBalance } = res.data;
        this.brokerageBalance = brokerageBalance; // 佣金
        this.platformBalance = platformBalance; // 余额
      });
    },

    fetchUserBillList() {
      this.page += 1;
      const params = {
        page: this.page,
        limit: this.limit,
      };
      getUserBillList(params)
        .then((res) => {
          const { data } = res;
          this.billList = data.list;
          this.total = data.total;
        })
        .catch((err) => {
          this.page -= 1;
        });
    },

    initListHeight() {
      const that = this;
      uni.getSystemInfo({
        success(res) {
          const list = uni.createSelectorQuery().select(".list__content");
          list
            .boundingClientRect((data) => {
              that.listHeight = res.windowHeight - data.top;
            })
            .exec();
        },
      });
    },

    scrolltolower() {
      this.loadMore();
    },

    loadMore() {
      if (this.billList.length >= this.total || this.billList.length < this.limit) {
        return;
      }

      this.fetchUserBillList();
    },
  },
};
</script>

<style>
page {
  box-sizing: border-box;
}
view {
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.balance-view {
  width: 100%;
  max-height: 100vh;
  padding: 20rpx;
  background-color: #f3f0f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .card {
    width: 100%;
    background: linear-gradient(180deg, #ff8b95 0%, #f6437e 100%);
    border-radius: 34rpx;
    overflow: hidden;
    padding: 40rpx;
    color: #ffffff;
    flex-shrink: 0;

    .label-large {
      font-size: 27rpx;
      line-height: 38rpx;
    }

    .value-large {
      font-weight: 600;
      font-size: 56rpx;
      line-height: 78rpx;
      margin-top: 10rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .btn {
        background-color: #fff;
        color: #f6437e;
        font-size: 36rpx;
        line-height: 1;
        padding: 18rpx 50rpx;
        border-radius: 40rpx;
      }
    }

    .money-box {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label-small {
        font-size: 27rpx;
        line-height: 38rpx;
      }

      .value-small {
        font-weight: 600;
        font-size: 44rpx;
        line-height: 62rpx;
      }
    }
  }

  .list {
    background: #ffffff;
    border-top-left-radius: 48rpx;
    border-top-right-radius: 48rpx;
    margin-top: 40rpx;
    padding: 36rpx;
    // padding-bottom: 60rpx;
    flex: 1;

    .title {
      font-weight: 500;
      font-size: 27rpx;
      color: #333333;
      line-height: 38rpx;
    }
  }
}

.pop-warp {
  width: 100%;
  height: auto;
  background-color: #f3f0f5;
  padding: 20rpx;
  padding-bottom: 100rpx;
}

.rect {
  width: 100%;
  padding: 50rpx;
  background: #ffffff;
  border-radius: 34rpx;
  font-weight: 400;
  font-size: 27rpx;
  color: #333333;
  line-height: 38rpx;

  .text-c {
    text-align: center;
  }

  .money {
    font-weight: 600;
    font-size: 79rpx;
    line-height: 110rpx;
    margin-top: 28rpx;
  }

  .tip {
    margin-top: 120rpx;
    font-size: 33rpx;
    line-height: 45rpx;
  }

  .input {
    margin-top: 40rpx;
  }

  .channel {
    display: flex;
    align-items: center;
    margin-top: 60rpx;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
    }

    image {
      width: 40rpx;
      height: 40rpx;
    }

    text {
      margin-left: 30rpx;
      font-size: 25rpx;
      line-height: 35rpx;
    }
  }

  .btn {
    margin: 70rpx auto 30rpx;
    width: 80%;
    padding: 30rpx 0;
    border-radius: 50rpx;
    font-weight: 600;
    font-size: 31rpx;
    color: #763030;
    line-height: 44rpx;
    letter-spacing: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #ffe7f0, #ffb8d3);
    border: 1rpx solid #fff;
    box-shadow: 2rpx 2rpx 1rpx rgba(114, 109, 109, 0.26);
  }
}
</style>
