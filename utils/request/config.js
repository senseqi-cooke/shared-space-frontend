let baseUrl = ""
if (process.env.NODE_ENV === 'development') {
	baseUrl = ''  // 开发环境
} else {
	baseUrl = '' // 生产环境
}
export default baseUrl
