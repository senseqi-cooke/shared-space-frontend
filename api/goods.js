import request from '@/utils/request'

// api地址
const api = {
  brandsCategories: '/goodsApi/brandsCategories',
  cateList: '/goodsApi/cateList',
  list: '/goodsApi/list',
  search: '/goodsApi/search',
  detail: '/goodsApi/detail'
}

// 商品分类列表
export const cateList = param => {
  return request.get(api.brandsCategories, param)
}

// 商品列表
export const list = param => {
  return request.get(api.list, param)
}

// 商品搜索
export const search = param => {
  return request.post(api.search,  param)
}

// 商品详情
export const detail = goodsId => {
  return request.post(api.detail, { goodsId })
}
