/*
 * 订单确认
 * */
import request from "@/utils/request";

/**
 * 提交订单
 * @param data
 * @returns {*}
 */
export function orderPay(data) {
  return request.post("/orderPay", data, {
    login: true,
  });
}

/**
 * 支付押金预约
 * @param data
 * @returns {*}
 */
export function depositPay(data) {
  return request.post("/depositPay", data, {
    login: true,
  });
}

/**
 * 成为会员
 */
export function becomePromoterApi(data) {
  return request.post("/becomeSpread", data, {
    login: true,
  });
}

/**
 * 代客下单
 * @param data
 * @returns {*}
 */
export function proxyUserOrder(data) {
  return request.post("/proxyOrder", data, {
    login: true,
  });
}

/**
 * 预约时间单内订单预约时间点已使用查询接口
 * @param data
 * @returns {*}
 */
export function getTimeListOrder(data) {
  return request.post("/getTimeListOrder", data, {
    login: true,
  });
}

/**
 * 预约时间单内订单预约时间点已使用查询接口V3
 * @param data
 * @returns {*}
 */
export function getTimeListOrderV3(data) {
  return request.post("/getTimeListOrderV3", data, {
    login: true,
  });
}

/**
 * 预约时间单内订单预约时间点已使用查询接口V2
 * @param data
 * @returns {*}
 */
export function getTimeListOrderV2(data) {
  return request.post("/getTimeListOrderV2", data, {
    login: true,
  });
}

/**
 * 立即支付订单接口
 * @param data
 * @returns {*}
 */
export function immediatePay(data) {
  return request.post("/immediatePay", data, {
    login: true,
  });
}

/**
 * 用户取消订单-退款接口
 * @param data
 * @returns {*}
 */
export function cancelOrderPay(data) {
  return request.post("/cancelOrderPay", data, {
    login: true,
  });
}

/**
 * 首页续单接口
 * @param data
 * @returns {*}
 */
export function getRepeatOrder(data) {
  return request.post("/repeatOrder", data, {
    login: true,
  });
}

/**
 * 保洁人员订单管理接口
 * @param data
 * @returns {*}
 */
export function getManagerStoreOrder(data) {
  return request.post("/loadTeaHouseOrder4Manage", data, {
    login: true,
  });
}

/**
 * 保洁人员订单管理接口
 * @param data
 * @returns {*}
 */
export function getManagerStoreOrderByClean(data) {
  return request.post("/loadTeaHouseOrder4ManageByClean", data, {
    login: true,
  });
}

export function cleanRecord(data) {
  return request.post("/insertIntoRecord", data, {
    login: false,
  });
}

/**
 * 根据门店Id、房间Id,获取房间的大门、房间智能开关
 * @param data
 * @returns {*}
 */
export function getStoreRoomDevice(data) {
  return request.post("/storeRoomDevice", data, {
    login: true,
  });
}

// 获取续订价格列表
export function getStoreRoomRenewalMinute(data) {
  return request.get("/mtStoreRoomRenewalMinute", data, {
    login: true,
  });
}

/**
 * 用户订单查询接口
 * @param data
 * @returns {*}
 */
export function getOrderListByUserId(data) {
  return request.post("/getOrderListByUserId", data, {
    login: true,
  });
}

/**
 * 通过购物车 id 获取订单信息
 * @param cartId
 * @returns {*}
 */
export function postOrderConfirm(cartId) {
  return request.post("/order/confirm", {
    cartId,
  });
}

/**
 * 计算订单金额
 * @param key
 * @param data
 * @returns {*}
 */
export function postOrderComputed(key, data) {
  return request.post("/order/computed/" + key, data);
}

/**
 * 获取指定金额可用优惠券
 * @param price
 * @returns {*}
 */
export function getOrderCoupon(cartId) {
  return request.get("/coupons/order/" + cartId);
}

/**
 * 生成订单
 * @param key
 * @param data
 * @returns {*}
 */
export function createOrder(key, data) {
  return request.post("/order/create/" + key, data || {});
}

/**
 * 订单统计数据
 * @returns {*}
 */
export function getOrderData() {
  return request.get("/order/data");
}

/**
 * 订单列表
 * @returns {*}
 */
export function getOrderList(data) {
  return request.get("/order/list", data);
}

/**
 * 取消订单
 * @returns {*}
 */
export function cancelOrder(id) {
  return request.post("/order/cancel", {
    id,
  });
}

/**
 * 订单详情
 * @returns {*}
 */
export function orderDetail(id) {
  return request.get("/order/detail/" + id);
}

/**
 * 退款理由
 * @returns {*}
 */
export function getRefundReason() {
  return request.get("/order/refund/reason");
}

/**
 * 提交退款
 * @returns {*}
 */
export function postOrderRefund(data) {
  return request.post("/order/refund/verify", data);
}

/**
 * 确认收货
 * @returns {*}
 */
export function takeOrder(uni) {
  return request.post("/order/take", {
    uni,
  });
}

/**
 * 删除订单
 * @returns {*}
 */
export function delOrder(uni) {
  return request.post("/order/del", {
    uni,
  });
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function express(params) {
  return request.post("order/express", params);
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function payOrder(uni, paytype, from) {
  return request.post("order/pay", {
    uni,
    paytype,
    from,
  });
}
/**
 * 订单核销
 * @returns {*}
 */

export function orderVerific(verifyCode, isConfirm) {
  return request.post("order/order_verific", { verifyCode, isConfirm });
}
/**
 * 获取订阅消息ID
 * @param price
 * @returns {*}
 */
export function getSubscribeTemplate() {
  return request.get("/order/getSubscribeTemplate");
}
