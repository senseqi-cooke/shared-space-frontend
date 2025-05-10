import Mock, { Random } from "better-mock/dist/mock.mp.js";

// 首页
const getTeaList = () => {
  // 馆列表
  return {
    "data|5-10": [
      {
        "id|+1": 1,
        image:
          "https://img2.baidu.com/it/u=200181870,3251520681&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=364",
        startTime: Random.date("HH:mm"),
        "startingTime|1-24": 1,
        title: Random.cword(4, 10),
        endTime: Random.date("HH:mm"),
        province: Random.province(),
        city: Random.city(),
        region: Random.region(),
        siteNum: Random.natural(1, 200),
        "list|5-10": [
          {
            "id|+1": 1,
            image:
              "https://img2.baidu.com/it/u=200181870,3251520681&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=364",
            name: Random.cword(2, 4),
            "iconList|1-3": [
              {
                "id|+1": 1,
                icon: Random.cword(2),
              },
            ],
            "money|50-100": 50,
            "renewMoney|40-90": 40,
            start: {
              "data|0-2": 0,
              time: Random.date("HH:mm"),
            },
          },
        ],
      },
    ],
  };
};
Mock.mock("api/getTeaList", "post", getTeaList());

const getTeaDetail = () => {
  // 馆详情
  return {
    data: {
      "bannerList|2-4": [
        {
          "id|+1": 1,
          image:
            "https://img2.baidu.com/it/u=200181870,3251520681&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=364",
        },
      ],
      name: Random.cword(4, 10),
      "number|2-20": 2,
      "iconList|1-3": [
        {
          "id|+1": 1,
          text: Random.cword(2),
        },
      ],
      "money|50-100": 50,
      "renewMoney|40-90": 40,
      site: Random.province() + Random.city() + Random.region(),
      siteNum: Random.natural(1, 200),
      siteTime: Random.date("HH小时mm分钟"),
      "lng|40-42.6": 40.08605,
      "lat|114-118.6": 116.479604,
      phone: 123456789,
      content: `<p>${Random.cword(130, 140)}</p>`,
    },
  };
};
Mock.mock("api/getTeaDetail", "post", getTeaDetail());

const getOpenCity = () => {
  // 获取开通城市
  return {
    "data|10-20": [
      {
        "id|+1": 1,
        city: Random.city(),
        "lng|40-42.6": 40.08605,
        "lat|114-118.6": 116.479604,
      },
    ],
  };
};
Mock.mock("api/getOpenCity", "post", getOpenCity());

const selectTeaList = () => {
  // 搜索
  return {
    "data|5-10": [
      {
        "id|+1": 1,
        image:
          "https://img2.baidu.com/it/u=200181870,3251520681&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=364",
        startTime: Random.date("HH:mm"),
        "startingTime|1-24": 1,
        title: Random.cword(4, 10),
        endTime: Random.date("HH:mm"),
        province: Random.province(),
        city: Random.city(),
        region: Random.region(),
        siteNum: Random.natural(1, 200),
        "list|5-10": [
          {
            "id|+1": 1,
            image:
              "https://img2.baidu.com/it/u=200181870,3251520681&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=364",
            name: Random.cword(2, 4),
            "iconList|1-5": [
              {
                "id|+1": 1,
                icon: Random.cword(2, 5),
              },
            ],
            "money|50-100": 50,
            "renewMoney|40-90": 40,
            start: {
              "data|0-2": 0,
              "time|1-100": 1,
            },
          },
        ],
      },
    ],
  };
};
Mock.mock("api/selectTeaList", "post", selectTeaList());

const getOrderDetail = () => {
  // 订单结算
  return {
    data: {
      endTimeNum: "",
      image:
        "https://img2.baidu.com/it/u=200181870,3251520681&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=364",
      name: Random.cword(4, 10),
      roomName: Random.cword(4, 10),
      "money|1-10000": 1,
      startTime: Random.date("MM月dd日hh:mm"),
      endTime: Random.date("MM月dd日hh:mm"),
      "money|50-100": 50,
      "renewMoney|40-90": 40,
      "deal|100-120": 100,
    },
  };
};
Mock.mock("api/getOrderDetail", "post", getOrderDetail());

// 订单页
const getOrderList = () => {
  // 订单列表
  return {
    "data|1-10": [
      {
        "id|+1": 1,
        startTime: Random.date("yyyy年MM月dd日HH:mm"),
        endTime: Random.date("HH:mm"),
        startText: Random.cword(3),
        image:
          "https://img2.baidu.com/it/u=200181870,3251520681&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=364",
        name: Random.cword(3, 6),
        box: Random.cword(3, 6),
        "money|1-100": 1,
        "start|1-4": 1,
      },
    ],
  };
};
Mock.mock("api/getOrderList", "post", getOrderList());

// 我的
const getUserInfo = () => {
  // 用户信息
  return {
    data: {
      image: Random.image(),
      name: Random.cname(),
      "userId|1-10000": 1,
      "coupon|1-10000": 1,
      "money|1-10000": 1,
      "integral|1-10000": 1,
    },
  };
};
Mock.mock("api/getUserInfo", "post", getUserInfo());

const getTicketList = () => {
  // 优惠券列表
  return {
    "data|5-10": [
      {
        "id|+1": 1,
        startText: Random.cword(3, 6),
      },
    ],
  };
};
Mock.mock("api/getTicketList", "post", getTicketList());

const getCouponShop = () => {
  // 卡券店铺列表
  return {
    "data|5-10": [
      {
        "id|+1": 1,
        startText: Random.cword(3, 6),
      },
    ],
  };
};
Mock.mock("api/getCouponShop", "post", getCouponShop());
const getCouponList = () => {
  // 卡券列表
  return {
    "data|5-10": [
      {
        "id|+1": 1,
        "time|1-48": 1,
        iconName: Random.cword(3, 4),
        title: Random.cword(6, 8),
        condition: Random.cword(2, 4),
        "money|1-100": 1,
      },
    ],
  };
};
Mock.mock("api/getCouponList", "post", getCouponList());

const getTopUpSelect = () => {
  // 充值选项列表
  return {
    "data|5-10": [
      {
        "id|+1": 1,
        startText: Random.cword(3, 6),
      },
    ],
  };
};
Mock.mock("api/getTopUpSelect", "post", getTopUpSelect());

const getConversionShop = () => {
  // 团购兑换店铺列表
  return {
    "data|5-10": [
      {
        "id|+1": 1,
        startText: Random.cword(3, 6),
      },
    ],
  };
};
Mock.mock("api/getConversionShop", "post", getConversionShop());

const gettopUpList = () => {
  // 充值金额列表
  return {
    "data|5-6": [
      {
        "id|+1": 1,
        "money|100-1000": 100,
        "moneyTwo|1-100": 1,
      },
    ],
  };
};
Mock.mock("api/gettopUpList", "post", gettopUpList());

const gettopUpText = () => {
  // 充值金额储值须知
  return {
    data: {
      content: `<p>${Random.cparagraph(20)}</p>`,
    },
  };
};
Mock.mock("api/gettopUpText", "post", gettopUpText());

const getUserPageKefu = () => {
  // 联系客服的图片
  return {
    data: {
      image: Random.image(),
    },
  };
};
Mock.mock("api/getUserPageKefu", "post", getUserPageKefu());

const getCommonProList = () => {
  // 常见问题列表
  return {
    /* 		'data|1-5': [{
			'id|+1':1,
			title: Random.cword(4, 10),
			content:Random.cparagraph(10)
		}] */
    data: [
      {
        id: 1,
        title: "如何开门?",
        content:
          "下单完成后，在订单有效期内点击小程序的开门按钮即可。点击开大门是开启门店大厅的大门，点击包厢设备中的门禁，是打开预定的包厢的门",
      },
      {
        id: 2,
        title: "可以自带茶叶吗?",
        content:
          "可以自行携带茶叶如果使用完，或者忘记带，可以在扫码货柜中自行购买",
      },
      {
        id: 3,
        title: "是否提供招商加盟?",
        content: "有的，可以联系客服13800138000获取详细招商加盟政策",
      },
    ],
  };
};
Mock.mock("api/getCommonProList", "post", getCommonProList());

const getOrderDetailMsg = () => {
  // 订单详情
  return {
    data: {
      shopMsg: {
        image:
          "https://img2.baidu.com/it/u=200181870,3251520681&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=364",
        title: Random.cword(4, 10),
        shopName: Random.cword(4, 8),
        siteName: Random.city(),
      },
      siteMsg: {
        site: Random.province() + Random.city() + Random.region(),
        siteNum: Random.natural(1, 200),
        siteTime: Random.date("HH小时mm分钟"),
      },
      timeMsg: {
        startDate: "2023-04-10",
        startTime: "11:00",
        endDate: "2023-04-10",
        endTime: "16:00",
        sumTime: 5,
      },
      "equipmentList|1-3": [
        {
          "id|+1": 1,
          text: "设备名称",
        },
      ],
      content: `<p>${Random.cword(130, 140)}</p>`,
    },
  };
};
Mock.mock("api/getOrderDetailMsg", "post", getOrderDetailMsg());
