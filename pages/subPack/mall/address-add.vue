<template>
  <view class="container">
    <!-- 表单组件 -->
    <view class="form-wrapper">
      <u-form1 :model="form" ref="uForm" label-width="140rpx">
        <u-form-item1 label="收货人" prop="name">
          <u-input1 v-model="form.name" placeholder="请输入收货人姓名" />
        </u-form-item1>
        <u-form-item1 label="手机号" prop="phone">
          <u-input1 v-model="form.phone" placeholder="请输入收货人手机号" />
        </u-form-item1>
        <u-form-item1 label="所在地区" prop="region">
          <select-region v-model="form.region" />
        </u-form-item1>
        <u-form-item1 label="详细地址" prop="detail" :border-bottom="false">
          <u-textarea
            v-model="form.detail"
            placeholder="小区楼栋/街道/乡村名称"
          />
        </u-form-item1>
        <u-form-item1
          label="设为默认收货地址"
          prop="isDefault"
          label-width="300rpx"
          :border-bottom="false"
        >
          <u-switch
            slot="right"
            size="30"
            activeColor="#fb8fb8"
            :activeValue="'Y'"
            :inactiveValue="'N'"
            v-model="form.isDefault"
          ></u-switch>
        </u-form-item1>
      </u-form1>
    </view>
    <!-- 操作按钮 -->
    <view class="footer">
      <view class="btn-wrapper">
        <view
          class="btn-item btn-item-main"
          :class="{ disabled }"
          @click="handleSubmit()"
        >
          保存
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import SelectRegion from "@/components/select-region/select-region";
import { isMobile } from "@/utils/verify";
import * as AddressApi from "@/api/address";

// 表单字段元素
const form = {
  name: "",
  phone: "",
  region: [],
  detail: "",
  isDefault: "N",
};

// 表单验证规则
const rules = {
  name: [
    {
      required: true,
      message: "请输入收货人",
      trigger: ["blur", "change"],
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: ["blur", "change"],
    },
    {
      // 自定义验证函数
      validator: (rule, value, callback) => {
        // 返回true表示校验通过，返回false表示不通过
        return isMobile(value);
      },
      message: "手机号码不正确",
      // 触发器可以同时用blur和change
      trigger: ["blur"],
    },
  ],
  region: [
    {
      required: true,
      message: "请选择省市区",
      trigger: ["blur", "change"],
      type: "array",
    },
  ],
  detail: [
    {
      required: true,
      message: "请输入详细地址",
      trigger: ["blur", "change"],
    },
  ],
};

export default {
  components: {
    SelectRegion,
  },
  data() {
    return {
      form,
      rules,
      // 按钮禁用
      disabled: false,
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },

  methods: {
    // 表单提交
    handleSubmit() {
      const app = this;
      if (app.disabled) {
        return false;
      }

      app.$refs.uForm.validate((valid) => {
        if (valid) {
          app.disabled = true;
          AddressApi.save(
            form.name,
            form.phone,
            form.region[0].value,
            form.region[1].value,
            form.region[2].value,
            form.detail,
            "A",
            0,
            form.isDefault
          )
            .then((res) => {
              if (res.status == 200) {
                uni.showToast({
                  title: res.data,
                  icon: "success",
                  duration: 5000,
                });

                setTimeout(() => {
                  form.name = "";
                  form.phone = "";
                  form.region = [];
                  form.detail = "";
                  form.isDefault = false;
                  uni.navigateBack();
                }, 1000);
              } else {
                uni.showToast({
                  title: res.data,
                  icon: "none",
                  duration: 5000,
                });

                setTimeout(() => {
                  uni.navigateBack();
                }, 1000);
              }
            })
            .finally(() => (app.disabled = false));
        }
      });
    },
  },
};
</script>

<style>
page {
  background: #f7f8fa;
}
</style>
<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
}
.form-wrapper {
  margin: 0 auto;
  padding: 20rpx 40rpx;
  width: 94%;
  box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
  border-radius: 16rpx;
  background: #fff;
}

/* 底部操作栏 */
.footer {
  margin-top: 60rpx;
  .btn-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
  }

  .btn-item {
    flex: 1;
    width: 640rpx;
    height: 98rpx;
    font-weight: 500;
    font-size: 29rpx;
    color: #763030;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30rpx;
  }

  .btn-item-main {
    background: linear-gradient(180deg, #ffe7f0 0%, #ffb8d3 100%);
  }
}
</style>
