import baseUrl from './config.js'

const request = {}
const headers = {}
request.globalRequest = (url, method, data) => {
	// 权限判断 因为有的接口请求头可能需要添加的参数不一样，所以这里做了区分
	// 1 == 不通过access_token校验的接口
	// 2 == 文件下载接口列表
	let token = ""
	if (token) {
		headers['token'] = token
	}
	headers['content-type'] = 'application/x-www-form-urlencoded'
	return new Promise((resolve, reject) => {
		uni.request({
			timeout: 60000,
			url: baseUrl + url,
			method,
			data: data,
			dataType: 'json',
			header: headers,
			success: res => {
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
			// complete() {
			// 	uni.hideLoading();
			// }
		})
	})
}
export default request
