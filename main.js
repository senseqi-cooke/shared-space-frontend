import Vue from "vue";
import App from "./App";
import "@/utils/request/requireJS.js";
import uView from "uni_modules/uview-ui";
import store from "./store/index.js";
import schema from "async-validator";
import dialog from "./utils/dialog";
import cookie from "@/utils/store/cookie";
import { router, RouterMount } from "./router/router.js"; //路径换成自己的
import { parseRoute, _router, parseQuery } from "@/utils";
import {
  VUE_APP_RESOURCES_URL,
  VUE_APP_API_URL,
  VUE_APP_PIC_RESOURCES_URL,
} from "@/config";
import { navTo, showToast, queryStringToObject } from "@/utils/index";
import { showSuccess, showError, getShareUrlParams } from "./utils/app";
//import share from '@/utils/share.js'
//import { share } from "@/utils/tool/lib/share"
//import shareMixin from '@/components/share/share'
//import wxshare from '@/uview-ui/libs/mixin/mpShare.js'
//引入分享
import { share } from "./mixins/index.js";
Vue.mixin(share);
Vue.prototype.$store = store;
Vue.prototype.$navTo = navTo;
Vue.prototype.$getShareUrlParams = getShareUrlParams;
Vue.prototype.$toast = showToast;
Vue.prototype.$success = showSuccess;
Vue.prototype.$error = showError;
Vue.prototype.$VUE_APP_API_URL = VUE_APP_API_URL;
Vue.prototype.$VUE_APP_PIC_RESOURCES_URL = VUE_APP_PIC_RESOURCES_URL;
Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV !== "production";
Vue.prototype.$validator = function (rule) {
  return new schema(rule);
};
// #ifndef VUE3
Vue.config.productionTip = false;
Vue.use(uView);
// Vue.use(router)
App.mpType = "app";

const app = new Vue({
  ...App,
  store,
});

Object.defineProperty(Vue.prototype, "$yrouter", {
  get() {
    return _router;
  },
});

Object.defineProperty(Vue.prototype, "$yroute", {
  get() {
    return this._route;
  },
});

try {
  function isPromise(obj) {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  }

  // 统一 vue2 API Promise 化返回格式与 vue3 保持一致
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res;
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0]);
          } else {
            resolve(res[1]);
          }
        });
      });
    },
  });
} catch (error) {}

/* const app = new Vue({
	store,
	...App
}) */

let deviceType = "";
// #ifdef APP-PLUS
// App平台编译的代码
deviceType = "app";
Vue.prototype.$platform = uni.getSystemInfoSync().platform;
// #endif

// #ifdef MP-WEIXIN
// 微信小程序编译的代码
deviceType = "routine";
// #endif

// !!! ps  不建议在 template 中使用 $deviceType 去判断当前环境，很有可能出现 $deviceType 为 undefined 导致判断出错的问题，可以在 script 模块中正常使用
// 建议通过 store 去获取 $deviceType 可以保证 template 中取到的值有效
// import { mapState, mapMutations, mapActions } from 'vuex';
// computed: {
// 		...mapState(['$deviceType'])
// },

// #ifdef H5
// H5编译的代码

import {
  wechat,
  clearAuthStatus,
  oAuth,
  auth,
  toAuth,
  pay,
  openAddress,
  openShareAll,
  openShareAppMessage,
  openShareTimeline,
  wechatEvevt,
  ready,
  wxShowLocation,
} from "@/libs/wechat";

import { isWeixin } from "@/utils";

if (!cookie.has(cookie.CACHE_KEY)) {
  cookie.clearAll();
  cookie.set(cookie.CACHE_KEY, 1);
}

var urlSpread = parseQuery()["spread"];
console.log({ urlSpread }, "spread");
if (urlSpread) {
  cookie.set("spread", urlSpread);
}

// #endif

// #ifdef H5
// H5编译的代码
// 判断是否是微信浏览器
async function init() {
  if (isWeixin()) {
    deviceType = "weixin";
    let wechatInit = wechat();
    if (wechatInit) {
      await oAuth();
    }
  } else {
    deviceType = "weixinh5";
  }
}
init();
// #endif

Vue.prototype.$deviceType = deviceType;

Vue.mixin({
  onLoad(options) {
    const { spread, scene } = options;
    let spreadId;
    // 二维码进入
    if (scene) {
      sceneObj = queryStringToObject(decodeURIComponent(scene));
      spreadId = sceneObj.spread;
      console.log({ spreadId }, "spread 扫码进入");
    }

    if (spread) {
      spreadId = spread;
      console.log({ spreadId }, "spread 分享进入");
    }

    cookie.set("spread", spreadId);
    const { $mp } = this.$root;
    this._route = parseRoute($mp);
  },

  onShow() {
    _router.app = this;
    _router.currentRoute = this._route;
  },

  // 这里为了解决 .vue文件中 template 无法获取 VUE.prototype 绑定的变量
  computed: {
    $VUE_APP_RESOURCES_URL() {
      return VUE_APP_RESOURCES_URL;
    },
  },
  //shareMixin
  //wxshare
});

store.commit("updateDevicetype", deviceType);

app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);

  // #ifdef H5
  RouterMount(app, router, "#app");
  // #endif

  // #ifndef H5
  app.$mount(); //为了兼容小程序及app端必须这样写才有效果
  // #endif

  return {
    app,
  };
}
// #endif
