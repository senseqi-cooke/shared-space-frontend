import request from "@/utils/request";

// api地址
const api = {
  list: "/cart/list",
  save: "/cart/save",
  clear: "/cart/clear",
};

// 购物车列表
export const list = (
  cartIds,
  goodsId,
  skuId,
  buyNum,
  couponId,
  point,
  storeId,
  additionalServiceIds
) => {
  return request.post(api.list, {
    cartIds,
    goodsId,
    skuId,
    buyNum,
    couponId,
    point,
    storeId,
    additionalServiceIds,
  });
};

// 更新购物车
export const save = (
  goodsId,
  action,
  skuId,
  buyNum,
  storeId,
  additionalServiceIds
) => {
  return request.post(api.save, {
    goodsId,
    action,
    skuId,
    buyNum,
    storeId,
    additionalServiceIds,
  });
};

// 删除购物车商品
export const clear = (cartId) => {
  return request.post(api.clear, { cartId });
};

/**
 * 记录购物车商品总数量
 * @param {*} value
 */
export const setCartTotalNum = (value) => {
  uni.setStorageSync("cartTotalNum", Number(value));
};

/**
 * 设置购物车tabbar的角标
 * 该方法只能在tabbar页面中调用, 其他页面调用会报错
 */
export const setCartTabBadge = () => {
  /*  const cartTabbarIndex = 1
  const cartTotal = uni.getStorageSync('cartTotalNum') || 0
  if (cartTotal > 0) {
    uni.setTabBarBadge({
      index: cartTabbarIndex,
      text: `${cartTotal}`
    })
  } else {
    uni.removeTabBarBadge({
        index: cartTabbarIndex
    })
  } */
  return;
};
