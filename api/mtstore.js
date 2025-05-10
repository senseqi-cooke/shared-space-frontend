import request from "@/utils/request";

export function storeListApi(data) {
	return request.post("/store/storeList", data, {
		login: false
	});
}

export function storeListApiV2(data) {
	return request.post("/store/storeListV2", data, {
		login: false
	});
}

export function storeNameList(data) {
	return request.post("/store/storeNameList", data, {
		login: false
	});
}

/**
 * 开门 (大门、房间)
 * @param {Object} data
 */
export function openDoorStoreOrStoreRoom(data) {
	return request.post("/device/openDoor", data, {
		login: true
	});
}

/**
 * 门店管理员开门 (大门、房间)
 * @param {Object} data
 */
export function adminOpenDoorStoreOrStoreRoom(data) {
	return request.post("/device/adminOpenDoor", data, {
		login: true
	});
}

/**
 * 获取开通城市接口
 * @param {Object} data
 */
export function openCity(data) {
	return request.post("/city/opencity", data, {
		login: false
	});
}

/**
 * 获取门店的总营收(元)、预约订单金额(元)、购买卡券金额(元)、充值金额(元)
 * @param {Object} data
 */
export function getStoreStat(data) {
	return request.post("/store/getStoreStat", data, {
		login: false
	});
}

/**
 * 根据天数获取订单（已支付、服务中、已完成）的实际支付金额总数、订单总数
 * @param {Object} data
 */
export function getOrderStatByDayNum(data) {
	return request.post("/store/getOrderStatByDayNum", data, {
		login: false
	});
}



/**
 * 根据门店Id获取该门店的房间列表
 * @param {Object} data
 */
export function storeRoomList(data) {
	return request.post("/storeRoom/storeRoomList", data, {
		login: false
	});
}


// 服务设施列表
export function getServiceFacList(data) {
  return request.post("/mtservicefac/getList", data, {
  	login: false
  });
}

export function storeoomSave(data) {
	return request.post("/storeoom/save", data, {
		login: false
	});
}

// 获取小程序端店铺员工列表
export function getStaffList(data) {
  return request.post("/staff/list", data, {
  	login: false
  });
}

// 保存员工信息接口
export function staffSave(data) {
	return request.post("/staff/save", data, {
		login: false
	});
}

// 获取小程序端保洁日志管理列表
export function getCleaningList(data) {
  return request.post("/cleaning/list", data, {
  	login: false
  });
}

/**
 * 更新房间上线状态，A：有效/启用；D：无效 接口
 * @param {Object} data
 */
export function updateRoomOnlineStatus(data) {
	return request.post("/storeRoom/updateRoomOnlineStatus", data, {
		login: true
	});
}

/**
 * 包厢电源是否常开 默认0表示没有设置常开，1表示有设置常开
 * @param {Object} data
 */
export function updateRoomPowerNorOpenStatus(data) {
	return request.post("/storeRoom/updateRoomPowerNorOpenStatus", data, {
		login: true
	});
}

// 根据包厢Id获取该包厢套餐设置列表
export function getStoreRoomPackageList(data) {
  return request.post("/storeRoom/storeRoomPackageList", data, {
  	login: false
  });
}

// 根据包厢Id获取该包厢小时模式设置列表
export function getStoreRoomHourList(data) {
  return request.post("/storeRoom/storeRoomHourList", data, {
  	login: false
  });
}

/**
 * 根据门店的包间、台桌Id获取包间、台桌的时间段价格
 * @param {Object} data
 */
export function storeRoomTimeSlotList(data) {
	return request.post("/storeRoom/storeRoomTimeSlotList", data, {
		login: false
	});
}

// 根据包厢Id,硬件方案1表示自研硬件,2表示每三方硬件，获取包厢硬件
export function getStoreRoomDeviceList(data) {
  return request.post("/device/storeRoomDeviceList", data, {
  	login: false
  });
}

/**
 * 设置通通锁  passageMode 常开模式：1-开启、2-关闭
 * @param {Object} data
 */
export function executeConfigPassageMode(data) {
	return request.post("/device/configPassageMode", data, {
		login: true
	});
}












