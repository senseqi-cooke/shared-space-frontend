let plugin = requirePlugin("routePlan");
let key = "IBKBZ-EBX3Q-7QS5Z-4YSIN-ET2TJ-FEFWZ"; //使用在腾讯位置服务申请的key
let referer = "蜜桃成人馆"; //调用插件的app的名称

export function goTenXunLoca(name, latitude, longitude) {
  var endPoint = {
    name: name,
    latitude: latitude,
    longitude: longitude,
  };

  endPoint = JSON.stringify(endPoint);
  console.log("endPoint:" + endPoint);
  wx.navigateTo({
    url:
      "plugin://routePlan/index?key=" +
      key +
      "&referer=" +
      referer +
      "&endPoint=" +
      endPoint,
  });
}
