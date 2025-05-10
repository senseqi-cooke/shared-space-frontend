import request from "@/utils/request";


export function getSettingInfo(data) {
	return request.post("/balance/setting", data, {
		login: true
	});
}

export function saveSetting(data) {
	return request.post("/balance/saveSetting", data, {
		login: true
	});
}






