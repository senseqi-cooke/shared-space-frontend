import request from "@/utils/request";

// api地址
const api = {
  recharge: "/system/recharge",
  system: "/system/config",
  storeInfor: "/store/storeInfor",
  storeList: "/store/list",
  storeDetail: "/store/detail",
  homeSetting: "/goodsApi/homePath",
};

// 充值配置
export function recharge() {
  return request.get(api.recharge);
}

// 根据门店Id获取门店详情
export function storeInfor(param) {
  return request.post(api.storeInfor, param);
}

// 系统配置
export function systemConfig(param) {
  return request.get(api.system, param);
}

// 店铺列表
export const storeList = (keyword) => {
  return request.post(api.storeList, { keyword });
};

// 店铺详情
export function storeDetail() {
  return request.get(api.storeDetail);
}

// 首页配置 - 用于过审
export function homeSetting() {
  return request.get(api.homeSetting);
}
