import QQMapWX from './qqmap-wx-jssdk.min.js' //引入下载的js
import store from "@/store/index.js"

const key = store.getters.getKey
// 腾讯地图经纬度转中文地址
export function getAddress (lng, lat) {
  return new Promise((resove, reject) => {
    const qqmapsdk = new QQMapWX({
      key,  //在腾讯位置服务申请的key
    })
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng,
      },
      success: (res) => {
        resove(res)
      },
      fail: (e) => {
        reject(e)
      },
    })
  })
}