<template>
  <goods-sku-popup
    :value="value"
    :isAI="isAI"
    @input="onChangeValue"
    border-radius="20"
    :custom-action="findGoodsInfo"
    :mode="skuMode"
    :defaultPrice="goods.price"
    :defaultStock="goods.stock"
    :maskCloseAble="true"
    @open="openSkuPopup"
    @close="closeSkuPopup"
    @add-cart="addCart"
    @buy-now="buyNow"
  />
</template>

<script>
//import { setCartTotalNum } from '@/utils/app'
import { setCartTotalNum } from "@/api/cart";
import * as CartApi from "@/api/cart";
import * as GoodsApi from "@/api/goods";
import GoodsSkuPopup from "@/components/goods-sku-popup";

let goodsInfo;

export default {
  components: {
    GoodsSkuPopup,
  },
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    // true 组件显示 false 组件隐藏
    value: {
      Type: Boolean,
      default: false,
    },
    // 模式 1:都显示 2:只显示购物车 3:只显示立即购买
    skuMode: {
      type: Number,
      default: 1,
    },
    // 商品详情信息
    goods: {
      type: Object,
      default: {},
    },
    isAI: {
      type: [Number, String],
      default: 0,
    },
  },

  data() {
    return {};
  },

  created() {
    const app = this;
    const { goods } = app;
    console.log("goods-storeRoomId:" + goods.storeRoomId);
    goodsInfo = {
      ...goods,
      _id: goods.goodsId,
      name: goods.name,
      goods_thumb: goods.logo,
      storeId: goods.storeId,
      storeRoomId: goods.storeRoomId,
      sku_list: app.getSkuList(),
      spec_list: app.getSpecList(),
    };
  },

  methods: {
    // 监听组件显示隐藏
    onChangeValue(val) {
      this.$emit("input", val);
    },

    /**
     * 获取商品信息
     * 这里可以看到每次打开SKU都会去重新请求商品信息,为的是每次打开SKU组件可以实时看到剩余库存
     */
    findGoodsInfo() {
      return new Promise((resolve, reject) => {
        resolve(goodsInfo);
      });
    },

    // 整理商品SKU列表
    getSkuList() {
      const app = this;
      const {
        goods: { name, logo, skuList },
      } = app;
      const skuData = [];
      if (skuList) {
        skuList.forEach((item) => {
          skuData.push({
            _id: item.id,
            sku_id: item.skuId,
            goods_id: item.goodsId,
            name: name,
            image: item.logo ? item.logo : logo,
            price: item.price,
            stock: item.stock,
            spec_value_ids: item.specIds,
            sku_name_arr: app.getSkuNameArr(item.specIds),
          });
        });
      }
      return skuData;
    },

    // 获取sku记录的规格值列表
    getSkuNameArr(specValueIds) {
      const app = this;
      const defaultData = ["默认"];
      const skuNameArr = [];

      if (specValueIds != "" && specValueIds.length > 0) {
        specValueIds.forEach((valueId, specId) => {
          const specValueName = app.getSpecValueName(valueId, specId);
          skuNameArr.push(specValueName);
        });
      }

      const result = skuNameArr.length ? skuNameArr : defaultData;

      return result;
    },

    // 获取指定的规格值名称
    getSpecValueName(valueId, specId) {
      const app = this;
      const {
        goods: { specList },
      } = app;

      if (specList.length > 0) {
        const res = specList[specId].valueList.find((specValue) => {
          return specValue.specValueId == valueId;
        });

        if (res) {
          return res.specValue;
        } else {
          return "";
        }
      } else {
        return "";
      }
    },

    // 整理规格数据
    getSpecList() {
      const {
        goods: { specList },
      } = this;
      const defaultData = [{ name: "默认", list: [{ name: "默认" }] }];
      const specData = [];
      if (specList.length > 0) {
        // 取第一个规格列表进行添加价格, 价格是取得SKU列表, 专门用于AI商城的回显
        specList.forEach((group, gi) => {
          const children = [];
          group.valueList.forEach((specValue) => {
            children.push({
              name: specValue.specValue,
              price:
                gi === 0 && this.isAI == 1
                  ? this.getPrice(specValue.specValueId)
                  : -1,
            });
          });
          specData.push({
            name: group.name,
            list: children,
          });
        });
      }
      return specData.length > 0 ? specData : defaultData;
    },

    // 根据规格获取SKU中的价格, 需求有问题, 需要限制场景: 是AI商城 && 只有一个规格分类(超出不会考虑)
    getPrice(specValueId) {
      const { skuList = [] } = this.goods || {};
      // 根据规格ID进行查找
      const findItem =
        skuList.find((el) => {
          const matchId = el.specIds[0] || '';
          return matchId == specValueId;
        }) || {};
      return +(findItem.price || 0);
    },

    // sku组件 开始-----------------------------------------------------------
    openSkuPopup() {
      // console.log("监听 - 打开sku组件")
    },

    closeSkuPopup() {
      // console.log("监听 - 关闭sku组件")
    },

    // 加入购物车按钮
    addCart(selectShop) {
      const app = this;

      console.log(selectShop);
      console.log("addCart-storeId:" + goodsInfo.storeId);
      const { goods_id, sku_id, buy_num, additionalServiceIds } = selectShop;
      CartApi.save(
        goods_id,
        "+",
        sku_id,
        buy_num,
        goodsInfo.storeId,
        additionalServiceIds
      ).then((result) => {
        // 隐藏当前弹窗
        app.onChangeValue(false);
        // 购物车商品总数量
        const cartTotal = result.data.cartTotal;
        // 缓存购物车数量
        setCartTotalNum(cartTotal);
        // 传递给父级
        app.$emit("addCart", cartTotal);
      });
    },

    // 立即购买
    buyNow(selectShop) {
      console.log(selectShop);
      // 跳转到订单结算页
      this.$navTo("pages/shopmall/settlement/goods", {
        mode: "buyNow",
        goodsId: selectShop.goods_id,
        skuId: selectShop.sku_id,
        buyNum: selectShop.buy_num,
        additionalServiceIds: selectShop.additionalServiceIds,
        storeId: goodsInfo.storeId,
        storeRoomId: goodsInfo.storeRoomId,
      });
      // 隐藏当前弹窗
      this.onChangeValue(false);
    },
  },
};
</script>

<style lang="scss" scoped></style>
