import request from "@/utils/request";

export function getCouponList(data) {
	return request.post("/coupon/list", data, {
		login: false
	});
}

export function userBuyConpon(data) {
	return request.post("/pay/userBuyConpon", data, {
		login: true
	});
}

export function myCouponList(data) {
	return request.post("/myCoupon/list", data, {
		login: true
	});
}

/**
 * 美团大众验券校验接口
 * @param {Object} data
 */
export function dianpingPrepare(data) {
	return request.post("/prepare", data, {
		login: true
	});
}

/**
 * 美团大众验券接口
 * @param {Object} data
 */
export function dianpingConsume(data) {
	return request.post("/consume", data, {
		login: true
	});
}

/**
 * 抖音兑换验券接口
 * @param {Object} data
 */
export function douyinConsume(data) {
	return request.post("/douyinVerifyCoupon", data, {
		login: true
	});
}

// 获取可用星期、可用时间段、适用房间
export function getCouponBaseList(data) {
  return request.post("/coupon/baseList", data, {
  	login: false
  });
}

// 新增、修改卡券接口
export function saveCoupon(data) {
	return request.post("/coupon/save", data, {
		login: false
	});
}

// 发放卡券接口
export function sendCoupon(data) {
	return request.post("/coupon/sendCoupon", data, {
		login: false
	});
}

/**
 * 更新卡券（小时卡、次卡、优惠券）是否新注册用户赠送，A：是；D：否
 * @param {Object} data
 */
export function updateIsNewGiveStatus(data) {
	return request.post("/coupon/updateIsNewGiveStatus", data, {
		login: true
	});
}

