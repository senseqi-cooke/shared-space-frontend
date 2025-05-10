<template>
  <view class="homePageBox">
    <view class="linear-box">
      <view class="custom-nav">
        <view class="vpb">
          <view class="content"> 午夜时空· {{ miniappName }} </view>
        </view>
      </view>
      <view class="select-city-box">
        <view
          class="label"
          @click="goSelCityPage(`/pages/subPack/homePage/selectCity`)"
        >
          {{ selectCity.city ? selectCity.city : "选择城市" }}
        </view>
        <view class="input">
          <input
            confirm-type="search"
            :value="keywords"
            placeholder-class="placeholder-class"
            placeholder="输入关键字"
            class="side-input"
            type="text"
          />
        </view>
        <view class="search">搜索</view>
      </view>
      <view class="tip">让每一刻体验都称为难忘的回忆</view>
    </view>

    <view class="list-box">
      <view
        class="item-box"
        v-for="(item, index) in computedStoreList"
        :key="item.id"
        @click="toDetail(item)"
      >
        <view class="preview">
          <image class="image" :src="item.image" mode="heightFix"></image>
        </view>
        <view class="content">
          <view class="title"> {{ item.name }}</view>
          <view class="tag-box">
            <view
              class="tag"
              v-for="icon in getStoreRoom(index).iconList || []"
              :key="icon.id"
            >
              {{ icon.icon }}
            </view>
          </view>
          <view class="address">{{ item.address }}</view>
          <view class="price">
            <view class="num">
              ￥{{ moneyFilter(getStoreRoom(index).price) }}
            </view>
            <view class="time-tag">全天营业</view>
            <view class="distance">{{ item.distance }}km</view>
          </view>
        </view>
      </view>
    </view>
    <view
      class="bottom-text"
      v-if="!computedStoreList || computedStoreList.length == 0"
    >
      没有更多了哟~
    </view>
  </view>
</template>

<script>
import { storeListApi } from "@/api/mtstore";
import { mapGetters } from "vuex";
import store from "@/store/index.js";
import { getAddress } from "@/utils/location/getAddress.js";
import { objectToQueryString } from "@/utils/index";
import * as Setting from "@/api/setting";

export default {
  computed: mapGetters(["location", "goName", "userInfo"]),
  data() {
    return {
      miniappName: "",
      miniappSiteType: "",

      storeList: [], // 门店列表
      selectCity: {}, // 当前选择的城市
      token: uni.getStorageSync("token"), // token
      globalData: {
        socketStatus: "closed",
      },
      keywords: "",

      isInit: true,
    };
  },

  computed: {
    computedStoreList() {
      return this.storeList.map((store) => {
        return {
          ...store,
          storeRoom: store.storeRoomList?.[0],
        };
      });
    },
  },

  methods: {
    getStoreRoom(index) {
      return this.computedStoreList?.[index]?.storeRoom || [];
    },

    formatePrice(money) {
      return parseInt(money);
    },

    moneyFilter(value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2);
      return realVal;
    },

    call(phone) {
      // 拨打电话
      uni.makePhoneCall({
        phoneNumber: phone,
        success: function () {
          console.log("拨打电话成功");
        },
        fail() {
          uni.showToast({
            title: "拨打电话失败，请确认电话格式是否正确",
            icon: "none",
          });
        },
      });
    },

    goSelCityPage(url) {
      uni.navigateTo({
        url,
      });
    },

    toDetail(store) {
      const url = `/pages/subPack/homePage/detailsFast`;
      const storeRoom = store.storeRoom;

      const icons = storeRoom.iconList.map((el) => el.icon);

      const params = {
        storeId: store.id,
        storeName: store.name,
        roomId: storeRoom.roomId,
        storeRoomName: storeRoom.storeRoomName,
        recommended: storeRoom.recommended,
        icons,
        address: store.address,
        distance: store.distance,
        phone: store.phone,
        images: storeRoom.images,
        descImage: storeRoom.descImage,
        price: storeRoom.price,
        image: storeRoom.icon,
        repeatPrice: storeRoom.repeatPrice,
        isRepeat: 0,
        startTimeNum: store.startTimeNum,
        roomDescription: encodeURIComponent(storeRoom.description),
        parentOrderId: 0,
        latitude: store.latitude,
        longitude: store.longitude,
      };
      console.log("desc=", params.roomDescription);
      const queryString = objectToQueryString(params);

      uni.navigateTo({
        url: `${url}?${queryString}`,
      });
    },

    async initLocation() {
      try {
        if (this.isInit) {
          // 获取标题名字
          //请求接口获取
          const { data } = await Setting.homeSetting();
          const { miniappName,miniappSiteType } = data;

          this.miniappSiteType = miniappSiteType || "list";
          this.miniappName = miniappName || "体验馆";

          console.log("miniappSetting:",miniappName,miniappSiteType);

          const { longitude, latitude } = await this.getLocation();
          await this.processLocation(longitude, latitude);
        } else {
          this.fetchListByCity();
        }
      } catch (error) {
        console.error("获取或处理位置失败:", error);
        this.handleLocationFailure();
      }
    },

    // 非初始化, 根据选择获取列表
    fetchListByCity() {
      this.getSelectCity();

      this.fetchStoreList();
    },

    // 获取选择城市
    getSelectCity() {
      const selectCity = this.$store.getters.getSelectCity;
      if (JSON.stringify(selectCity) != "{}") {
        this.selectCity = selectCity;
      }
    },

    getLocation() {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: "gcj02",
          success(res) {
            resolve({ longitude: res.longitude, latitude: res.latitude });
          },
          fail(err) {
            reject(err);
            uni.showToast({
              title: "位置获取失败，请检查是否开启获取位置权限",
              icon: "none",
              duration: 2000,
            });
          },
        });
      });
    },

    async processLocation(longitude, latitude) {
      try {
        const addressInfo = await getAddress(longitude, latitude);
        this.setCityInfo(addressInfo, longitude, latitude);
      } catch (error) {
        console.error("地址解析失败:", error);
        this.handleLocationFailure();
      }
    },

    setCityInfo(addressInfo, longitude, latitude) {
      const {
        address_component: { city },
        ad_info: { adcode },
      } = addressInfo.result;
      const cityCode = adcode ? adcode.substring(0, 4) + "00" : "";
      const selectCity = {
        city,
        cityCode,
        lng: longitude,
        lat: latitude,
      };

      store.commit("setSelectCity", selectCity);
      store.commit("setLocation", { ...selectCity, name: city });
      console.log("Set city info:", selectCity);
      this.selectCity = selectCity;

      this.fetchStoreList();
    },

    fetchStoreList() {
      const data = {
        longitude: this.selectCity.lng,
        latitude: this.selectCity.lat,
        cityCode: this.selectCity.cityCode,
		    status: "N"
      };
      storeListApi(data)
        .then((res) => {
          this.storeList = res.data;

          if (this.isInit) {
            this.isInit = false;
          }
        })
        .catch((err) => {
          console.log("fetchStoreList - error: ", err);
        });
    },

    handleLocationFailure() {
      // 处理位置获取失败的情况, 这里直接用大连的坐标作为备选
      this.selectCity = {
        city: "大连",
        cityCode: "210200",
        lng: 121,
        lat: 38,
      };
      this.fetchStoreList();
    },
  },
};
</script>

<style>
page {
  background: #fdeaf6;
}
</style>

<style lang="scss" scoped>
.homePageBox {
  width: 100%;
  height: auto;
  padding-bottom: 20rpx;
  background: #fdeaf6;

  .vpb {
    padding: 0 20rpx;
  }

  .linear-box {
    background: linear-gradient(180deg, #f9b2c6, #fbd0db, #fdeaf6);
    padding-bottom: 24rpx;
    position: relative;
  }

  .custom-nav {
    height: 200rpx;
    position: relative;

    .content {
      position: absolute;
      bottom: 18rpx;
      font-weight: 600;
      color: #763030;
      font-size: 33rpx;
    }
  }

  .select-city-box {
    width: 682rpx;
    height: 65rpx;
    margin: 0 auto;
    border-radius: 33rpx;
    background: #fdeaf6;
    font-size: 20rpx;
    color: #333333;
    line-height: 29rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      width: 120rpx;
      height: 100%;
      border-radius: 1rpx solid #e9e6e9;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .input {
      flex: 1;

      .side-input {
        text-align: center;
        width: 100%;
      }

      .placeholder-class {
        color: #666666;
      }
    }

    .search {
      width: 100rpx;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .tip {
    padding: 28rpx 0;
    text-align: center;
    color: #999999;
    font-size: 20rpx;
    line-height: 28rpx;
  }

  .list-box {
    position: relative;
    z-index: 1;
    overflow: hidden;
    margin-top: -20rpx;
  }

  .item-box {
    width: 100%;
    height: auto;
    background: #fff;
    padding: 30rpx;
    border-radius: 24rpx;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;

    .preview {
      width: 265rpx;
      height: 332rpx;
      border-radius: 16rpx;
      overflow: hidden;

      .image {
        width: 100%;
        height: 100%;
      }
    }

    .content {
      flex: 1;
      padding: 10rpx 10rpx 20rpx 20rpx;
      display: flex;
      flex-direction: column;

      .title {
        font-size: 30rpx;
        color: #763030;
        font-weight: 500;
        line-height: 43rpx;
      }

      .tag-box {
        margin-top: 20rpx;

        .tag {
          display: inline-block;
          padding: 3rpx 8rpx;
          font-size: 20rpx;
          line-height: 28rpx;
          color: #b2b2b2;
          background: transparent;
          border: 1rpx solid #d7d9de;
          border-radius: 5rpx;
          margin-right: 10rpx;
          margin-bottom: 10rpx;
        }
      }

      .address {
        margin-top: 20rpx;
        font-size: 22rpx;
        color: #333333;
        line-height: 31rpx;
        letter-spacing: 1px;
      }

      .price {
        margin-top: 20rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .num {
          font-weight: 500;
          font-size: 40rpx;
          color: #ff6ca0;
          line-height: 55rpx;
        }

        .time-tag {
          border-radius: 6rpx;
          background: linear-gradient(180deg, #ffe6ef, #fbb7d1);
          padding: 4rpx 16rpx;
          font-size: 24rpx;
          font-weight: 500;
          color: #763030;
        }

        .distance {
          font-size: 19rpx;
          color: #666666;
          line-height: 27rpx;
          letter-spacing: 1px;
        }
      }
    }
  }

  .bottom-text {
    margin: 30rpx auto 0;
    text-align: center;
    color: #999999;
    font-size: 26rpx;
  }
}
</style>
