import {
	getAddress
} from './getAddress.js'
import store from "../../store/"

export function getLocation() {
	uni.getLocation({
		type: "gcj02",
		success(res) {
			let longitude = res.longitude
			let latitude = res.latitude
			getAddress(longitude, latitude)
				.then((res) => {
					
					let cityName = res.result.address_component.city;
					let countyCode = res.result.ad_info.adcode;
					console.log("countyCode=", countyCode)
					let cityCode = "";
					if (countyCode) {
					    cityCode = countyCode.substring(0, 4) + "00";
					}
					console.log("cityCode=", cityCode)
					
					let params = {
						city: res.result.address_component.city,
						name: res.result.address_reference.landmark_l2.title,
						lng: longitude,
						lat: latitude,
						cityCode:cityCode
					}
					store.commit('setLocation', params)
				})
				.catch((e) => {
					console.log(e, '解释地址失败')
				})
		},
		fail(err) {
			console.log(err, '获取经纬度失败')
			uni.showToast({
				title:"位置获取失败，请检查是否开启获取位置权限",
				icon:'none',
				duration:3000
			})
		}
	})
}
