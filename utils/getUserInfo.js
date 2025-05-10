import {
		UserInfo
	} from "@/utils/request/gather.js"

	const getOpenId = () => {
		uni.login({ // 获取code
			provider: "weixin",
			success: function(res) {
				console.log("用户code: " + res.code);
				UserInfo().then(res => {
					let data = JSON.stringify(res.data.data)
					uni.setStorageSync("userInfo",data)
				})
			},
		});
	}

	export default getOpenId
