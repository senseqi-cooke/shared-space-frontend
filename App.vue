<script>
import { getLocation } from "utils/location/getLocation.js";
import getOpenId from "utils/getUserInfo.js";
import store from "@/store";
import cookie from "@/utils/store/cookie";
import { wxappBindOpenid } from "@/api/user";
//import { mapState, mapMutations, mapActions } from 'vuex'
// import { mapGetters } from "vuex";
export default {
  globalData: {
    socketStatus: "closed",
  },
  //computed: mapGetters(["location", "goName"]),
  onLaunch: function (options) {
    var that = this;
    if (that.globalData.socketStatus === "closed") {
      //that.openSocket();
    }
    //			getLocation(); // 获取位置信息
    /* 			
			getOpenId(); // 获取code
			let token = uni.getStorageSync("token")
			if(!token){
				setTimeout(()=>{
					uni.redirectTo({
						url:"/pages/Login/login"
					})
				},1000)
			}
			 */
    //this.getLocation();

    console.log(options.referrerInfo.extraData);
    const { token = "" } = (options.referrerInfo || {}).extraData || {};
    const cacheToken = cookie.get("login_status");
    store.commit("login", token || cacheToken, "");
    store.dispatch("userInfo", true);
    console.log("App Launch");

    if (token) {
      uni.login({
        // 获取code
        provider: "weixin",
        success: function (res) {
          console.log("用户code: " + res.code);

          wxappBindOpenid({ code: res.code })
            .then((res) => {})
            .catch((err) => {
              store.commit("login", "", "");
              store.dispatch("userInfo", true);
            });
        },
      });
    }
  },
  onShow: function (options) {
    const { token = "" } = (options.referrerInfo || {}).extraData || {};
    const cacheToken = cookie.get("login_status");
    store.commit("login", token || cacheToken, "");
    store.dispatch("userInfo", true);
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
    openSocket() {
      //打开时的动作
      wx.onSocketOpen(() => {
        console.log("WebSocket 已连接");
        this.globalData.socketStatus = "connected";
        this.sendMessage();
      });
      //断开时的动作
      wx.onSocketClose(() => {
        console.log("WebSocket 已断开");
        this.globalData.socketStatus = "closed";
      });
      //报错时的动作
      wx.onSocketError((error) => {
        console.error("socket error:", error);
      });
      // 监听服务器推送的消息
      wx.onSocketMessage((message) => {
        //把JSONStr转为JSON
        /* 						          message = message.data.replace(" ", "");
						          if (typeof message != 'object') {
						            message = message.replace(/\ufeff/g, ""); //重点
						            var jj = JSON.parse(message);
						            message = jj;
						          } */
        console.log("【websocket监听到消息】");
        //console.log(message);
      });
      // 打开信道
      wx.connectSocket({
        //url: "wss://" + "shareminiapi2.tonetn.com" + ":8888",
        url: "wss://" + "shareminiapi2.tonetn.com/wss",
      });
    },
    // 关闭通信
    closeSocket() {
      if (this.globalData.socketStatus === "connected") {
        wx.closeSocket({
          success: () => {
            this.globalData.socketStatus = "closed";
          },
        });
      }
    },
    //发送消息函数
    sendMessage() {
      if (this.globalData.socketStatus === "connected") {
        //自定义的发给后台识别的参数 ，我这里发送的是name
        console.log(
          "wx.getStorageSync('openid'):" + wx.getStorageSync("openid")
        );
        wx.sendSocketMessage({
          data: '{"name":"' + wx.getStorageSync("openid") + '"}',
        });
      }
    },
    //...mapActions(['getLocation']),
  },
};
</script>

<style lang="scss">
@import "@/uni_modules/uview-ui/index.scss";
/*每个页面公共css */
</style>

<style lang="less">
/*每个页面公共css */
/* @import 'animate.css'; */
// @import './assets/iconfont/iconfont.css';
// @import './assets/css/base.less';
// @import './assets/css/reset.less';
// @import './assets/css/style.less';

@import "@/assets/iconfont/iconfont.css";
@import "@/assets/css/base1.less";
@import "@/assets/css/reset.less";
@import "@/assets/css/style1.less";
</style>
