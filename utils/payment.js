const payment = (timeStamp,nonceStr,packages,signType,paySign) => {
	return new Promise((resolve, reject)=>{
		uni.requestPayment({
			provider: 'wxpay',    //支付类型-固定值
			timeStamp, // 时间戳（单位：秒）
			nonceStr, // 随机字符串
			package:packages, // 固定值
			signType, //固定值
			paySign, //签名
			
			success: function (res) {
				uni.showToast({
					icon: 'success',
					title: '支付成功',
					duration:2000
				})
				resolve(true)
			},
			
			fail: function (err) {
				uni.showToast({
					icon: 'none',
					title: '支付失败',
					duration:2000
				})
				reject(false)
			}
		});
	})
}

export default payment