import request from "@/utils/request";

// api地址
const api = {
  list: '/address/list',
  detail: '/address/detail',
  save: '/address/save'
}

// 个人收货地址列表
export const list = (param) => {
  return request.get(api.list, param)
}

// 收货地址详情
export const detail = (addressId) => {
  return request.post(api.detail, { addressId })
}

// 保存收货地址
export const save = (name, mobile, provinceId, cityId, regionId, detail, status, addressId, isDefault ) => {
  return request.post(api.save, { name, mobile, provinceId, cityId, regionId, detail, status, addressId, isDefault })
}

// 设置默认收货地址
export const setDefault = (addressId, isDefault) => {
  return request.post(api.save, { addressId, isDefault })
}

// 删除收货地址
export const remove = (addressId, status) => {
  return request.post(api.save, { addressId, status })
}
