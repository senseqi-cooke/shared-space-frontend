import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

import cookie from "@/utils/store/cookie";
import { getUserInfo, getUser } from "@/api/user";
import dialog from "@/utils/dialog";

const loginKey = "login_status";

const store = new Vuex.Store({
  state: {
    location: {}, // 位置信息
    selectCity: {}, // 选择的城市
    key: "IBKBZ-EBX3Q-7QS5Z-4YSIN-ET2TJ-FEFWZ", // 腾讯地图申请的key
    // 是否已经在授权页面
    isAuthorizationPage: false,
    // 是否授权
    isAuthorization: false,
    // 不建议从这里取 token，但是删除掉会影响其他的页面
    token: cookie.get(loginKey) || null,
    userInfo: cookie.get("userInfo"),
    $deviceType: null,
    location: {
      latitude: "",
      longitude: "",
    },
    storeItems: cookie.get("storeItems") || null,
    goName: cookie.get("goName") || "",
  },
  getters: {
    isAuthorizationPage: (state) => state.isAuthorizationPage,
    isAuthorization: (state) => state.isAuthorization,
    token: (state) => state.token,
    isLogin: (state) => !!state.token,
    userInfo: (state) => state.userInfo || {},
    location: (state) => state.location,
    storeItems: (state) => state.storeItems,
    goName: (state) => state.goName,
    $deviceType: (state) => state.$deviceType,
    getLocation(state) {
      // 获取位置信息
      return state.location;
    },
    getSelectCity(state) {
      // 获取选择的城市
      return state.selectCity;
    },
    getKey(state) {
      // 返回key
      return state.key;
    },
  },
  strict: debug,
  mutations: {
    login(state, token, expires_time) {
      console.log("设置token");
      state.token = token;
      cookie.set(loginKey, token, expires_time);
    },
    logout(state) {
      console.log("清除数据");
      state.token = null;
      state.userInfo = null;
      cookie.clearAll();
    },
    backgroundColor(state, color) {
      state.color = color;
      // document.body.style.backgroundColor = color;
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      if (userInfo) {
        cookie.set("userInfo", userInfo);
      } else {
        cookie.set("userInfo", null);
      }
    },
    updateAuthorizationPage(state, isAuthorizationPage) {
      state.isAuthorizationPage = isAuthorizationPage;
    },
    updateAuthorization(state, isAuthorization) {
      state.isAuthorization = isAuthorization;
    },
    updateDevicetype(state, $deviceType) {
      state.$deviceType = $deviceType;
    },
    setLocation(state, location) {
      state.location = location;
    },
    get_store(state, storeItems) {
      state.storeItems = storeItems;
      cookie.set("storeItems", storeItems);
    },
    get_to(state, goName) {
      state.goName = goName;
      cookie.set("goName", goName);
    },
    setLocation(state, n) {
      // 设置位置信息
      state.location = n;
    },
    setSelectCity(state, n) {
      // 设置选择的城市
      state.selectCity = n;
    },
  },
  actions: {
    getLocation({ state, commit }, force) {
      uni.getLocation({
        type: "gcj02",
        success: function (res) {
          console.log(res);
          commit("setLocation", {
            longitude: res.longitude,
            latitude: res.latitude,
          });
        },
      });
    },
    userInfo({ state, commit }, force) {
      if (state.userInfo !== null && !force) {
        return Promise.resolve(state.userInfo);
      }
      return new Promise((reslove) => {
        getUserInfo().then((res) => {
          commit("updateUserInfo", res.data);
          reslove(res.data);
        });
      }).catch(() => {
        uni.showToast({
          title: "获取信息失败!",
          icon: "none",
          duration: 2000,
        });
      });
    },
    getUser({ state, commit }) {
      if (!state.token) {
        return Promise.reject("未获取到token");
      }
      return new Promise((reslove) => {
        getUserInfo().then((res) => {
          console.log(res);
          commit("updateUserInfo", res.data);
          reslove(res.data);
        });
      }).catch((error) => {
        console.log(error);
        uni.showToast({
          title: "获取信息失败!",
          icon: "none",
          duration: 2000,
        });
      });
    },
    changeLogin({ state, commit }, data, date) {
      commit("login", data, date);
    },
    setUserInfo({ state, commit }, user) {
      commit("updateUserInfo", user);
    },
    changeAuthorizationPage({ state, commit }, index) {
      commit("updateAuthorizationPage", index);
    },
    changeAuthorization({ state, commit }, index) {
      commit("updateAuthorization", index);
    },
  },
});
export default store;
