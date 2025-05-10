import request from "./request.js"

// 首页
function TeaList(data = {}){ // 获取首页的馆列表
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getTeaList", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
function TeaDetails(data = {}){ // 获取首页的馆列表
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getTeaDetail", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
function OpenCity(data = {}){ // 获取开通城市
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getOpenCity", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
function selectTea(data = {}){ // 搜索馆
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/selectTeaList", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
function OrderDetail(data = {}){ // 订单结算页数据
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getOrderDetail", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 订单页
function OrderList(data = {}){ // 订单列表
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getOrderList", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
function TicketList(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getTicketList", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 用户信息
function UserInfo(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getUserInfo", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 卡券店铺列表
function CouponShop(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getCouponShop", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 卡券列表
function CouponList(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getCouponList", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 充值选项列表
function TopUpSelect(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getTopUpSelect", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 充值金额列表
function TopUpList(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/gettopUpList", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 充值金额储值须知
function TopUpText(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/gettopUpText", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 团购兑换店铺列表
function ConversionShop(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getConversionShop", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 联系客服的图片
function UserPageKefu(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getUserPageKefu", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 常见问题列表
function CommonProList(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getCommonProList", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 订单详情
function OrderDetailMsg(data = {}){
	return new Promise((resolve, reject)=>{
		request.globalRequest("api/getOrderDetailMsg", "POST", data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export {
	TeaList,
	TeaDetails,
	OpenCity,
	selectTea,
	OrderList,
	OrderDetail,
	TicketList,
	UserInfo,
	CouponShop,
	TopUpSelect,
	TopUpList,
	TopUpText,
	ConversionShop,
	CouponList,
	UserPageKefu,
	CommonProList,
	OrderDetailMsg,
}