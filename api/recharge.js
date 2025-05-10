import request from "@/utils/request";

export function rechargeRuleList(data) {
	return request.post("/recharge/rechargeRuleList", data, {
		login: false
	});
}

export function userBalanceList(data) {
	return request.post("/user/userBalanceList", data, {
		login: true
	});
}

export function doRecharge(data) {
	return request.post("/balance/doRecharge", data, {
		login: true
	});
}

export function myBalanceList(data) {
	return request.post("/myBalance/list", data, {
		login: true
	});
}

export function getUserBalanceList(data) {
	return request.post("/userBalance/list", data, {
		login: true
	});
}



