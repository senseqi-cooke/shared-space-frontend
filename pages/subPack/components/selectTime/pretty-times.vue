<template>
  <view class="container">
    <view class="image">
      <image
        src="https://ss-admin-api.wgjpt.cn/file/other/20240927172824246079.webp"
        mode="widthFix"
      ></image>
    </view>

    <!-- 日期列表 -->
    <view class="date-select">
      <u-scroll-list
        indicatorColor="rgba(255, 108, 160, .35)"
        indicatorActiveColor="rgb(255, 108, 160)"
      >
        <view class="scroll-view_H">
          <view
            v-for="(item, index) in dateArr"
            :key="index"
            class="flex-box"
            @click="selectDateEvent(index, item)"
            :class="{
              active: index == dateActive,
            }"
          >
            <view
              class="date-box"
              :style="{
                color: index == dateActive ? selectedTabColor : '#666',
              }"
            >
              <text>{{ item.date }}</text>
              <text class="font-w">{{ item.week }}</text>
            </view>
          </view>
        </view>
      </u-scroll-list>

      <view class="tip"> 套餐时长: {{ packageMin }}分钟 </view>
    </view>

    <view class="tip">
      <view class="title">
        <u-icon
          class="icon"
          name="info-circle"
          color="#333"
          size="28rpx"
        ></u-icon>
        <view class="text">特别提示</view>
      </view>
      <view class="p">
        红色时间是代表已预约满，白色时间是代表空闲，您只需要选择开始时间即可，系统会自动按照您的套餐时间自动处理 (例如您想12:30开始就点击12:30即可)
      </view>
    </view>

    <!-- 时间选项 -->
    <view class="time-box">
      <template v-for="(item, _index) in timeArr">
        <view class="item" :key="_index" v-if="!item.disable">
          <view
            class="item-box"
            :class="[
              selectMinTime != null && selectMaxTime != null && item.isSub == 0
                ? _index >= selectMinTime && _index <= selectMaxTime
                  ? 'active'
                  : ''
                : selectTimeNum == _index
                ? 'active'
                : '',
              item.isSub == 1 ? 'makeActive' : '',
              item.isSub == 2 ? 'sweepClass' : '',
            ]"
            @click="
              item.isSub == 1 || item.isSub == 2
                ? ''
                : selectTimes(_index, item)
            "
            style="padding: 0"
          >
            <text>
              <text v-if="item.nextDay == 1">
                次日 {{ item.begin }}~{{ item.end }}
              </text>

              <text v-if="item.nextDay == 0">
                {{ item.begin }}~{{ item.end }}
              </text>
            </text>

            <text class="all" v-if="item.isSub == 0 || item.isSub == 1">
              {{
                item.disable
                  ? disableText
                  : item.isSub == 1
                  ? "已预约"
                  : unDisableText
              }}
            </text>

            <text class="all" v-if="item.isSub == 2"> 预留打扫时间 </text>
          </view>
        </view>
      </template>
    </view>

    <view class="bottom b-t">
      <view class="clear button" @click="cancel"> 取消 </view>

      <view class="isOk button" @click="select">
        确认
        {{
          selectMaxTime - selectMinTime > 0
            ? "(" + timeInterval * (selectMaxTime - selectMinTime + 1) + "小时)"
            : selectTimeNum != null
            ? "(" + timeInterval + "小时)"
            : ""
        }}
      </view>
    </view>
  </view>
</template>

<script>
import {
  initData,
  initTime,
  currentTime,
  computeNextDate,
  initNextTime,
  computePreDate,
} from "./utils/date.js";
import Bus from "@/utils/Bus.js";
export default {
  name: "times",
  model: {
    prop: "showPop",
    event: "change",
  },
  props: {
    disableText: {
      //禁用显示的文本
      type: String,
      default: "已约满",
    },
    unDisableText: {
      //未禁用显示的文本
      type: String,
      default: "空闲",
    },
    timeInterval: {
      // 时间间隔，小时为单位
      type: Number,
      default: 1,
    },
    selectedTabColor: {
      // 日期栏选中的颜色
      type: String,
      default: "#fff",
    },
    beginTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    // 打扫所需的时间段
    sweepTime: {
      type: Number,
      default: 2,
    },
    packageMin: {
      // 套餐时长
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      orderDateTime: "暂无选择", // 选中时间
      dateArr: [], //日期数据
      timeArr: [], //时间数据
      nowDate: "", // 当前日期
      dateActive: 0, //选中的日期索引
      timeActive: 0, //选中的时间索引
      selectDate: "", //选择的日期

      selectTimeNum: null, // 单个选择的下标记
      selectMinTime: null, // 开始值
      selectMaxTime: null, // 结束值

      beginIndex: 0, // 预约时间开始的下标
      endIndex: 0, // 预约时间结束的下标
    };
  },
  inject: ["subscribeObj"],
  computed: {
    subscribeObjs() {
      return this.subscribeObj.timeList;
    },
  },
  created() {
    this.selectDate = this.nowDate = currentTime().date;
    this.initOnload();
  },
  methods: {
    select() {
      let data = {
        timeInterval: null,
        date: this.dateArr[this.dateActive],
        startTime: null,
        endTime: null,
      };

      if (
        this.selectMaxTime - this.selectMinTime > 0 ||
        this.selectTimeNum != null
      ) {
        if (this.selectTimeNum != null) {
          data.timeInterval = this.timeInterval;
          data.startTime = this.timeArr[this.selectTimeNum];
          data.endTime = this.timeArr[this.selectTimeNum];
        }

        if (this.selectMinTime != null && this.selectMaxTime != null) {
          data.timeInterval =
            this.timeInterval * (this.selectMaxTime - this.selectMinTime + 1);
          data.startTime = this.timeArr[this.selectMinTime];
          data.endTime = this.timeArr[this.selectMaxTime];
        }

        this.$emit("submit", data);
      } else {
        uni.showToast({
          title: "请确认是否选择了时间段",
          icon: "none",
        });
      }
    },

    cancel() {
      this.$yrouter.back();
    },

    initOnload() {
      console.log("initOnload:" + this.selectDate);
      this.dateArr = initData(); // 日期栏初始化
      this.timeArr = initTime(
        this.selectDate,
        this.beginTime,
        this.endTime,
        this.timeInterval
      ); // 时间选项初始化
      var selNextDate = computeNextDate(this.selectDate);
      // 00:00~08:30
      var nextTimeArr = initNextTime(
        selNextDate,
        "00:00",
        "08:30",
        this.timeInterval
      );

      // 今天的时间点与明天的00:00~08:30时间点合并
      this.timeArr = this.timeArr.concat(nextTimeArr);

      this.beginIndex = 0; // 预约时间开始的下标
      this.endIndex = 0; // 预约时间结束的下标
      let that = this;
      let isFullTime = true;

      // 被预约的时间段的操作
      this.subscribeObjs.forEach((sub) => {
        that.beginIndex = 0; // 预约时间开始的下标
        that.endIndex = 0; // 预约时间结束的下标

        // 当天预定的订单
        if (sub.date == this.dateArr[this.dateActive].date) {
          console.log("sub:" + JSON.stringify(sub));

          this.timeArr.forEach((item, index) => {
            // 表示当日的才设置预定标识
            if (item.nextDay == 0) {
              item.dateState = true;
              // that.sweepTime = sub.sweep;
              if (item.dateState) {
                if (sub.selectBeginTime == item.begin) {
                  that.beginIndex = index;
                }

                if (sub.selectEndTime == item.end) {
                  that.endIndex = index;
                }
              }
            }
          });

          this.timeArr.forEach((item, index) => {
            // 表示当日的才设置预定标识
            if (item.nextDay == 0) {
              // 不是跨天订单
              if (sub.date == sub.endDate) {
                if (that.sweepTime > 0) {
                  // 表示当前遍历item-index 等于已预定的区间结束+加打扫时间index,则设置打扫状态
                  if (
                    index - that.endIndex > -1 &&
                    index - that.endIndex <= that.sweepTime
                  ) {
                    item.isSub = 2;
                  }
                }

                // 表示当前遍历item,在已预定的时间区间内
                if (index >= that.beginIndex && index <= that.endIndex) {
                  item.isSub = 1;
                }
              }

              // 如果是跨天订单
              if (sub.date != sub.endDate) {
                if (that.sweepTime > 0) {
                  if (index - 48 > -1 && index - 48 <= that.sweepTime) {
                    item.isSub = 2;
                  }
                }

                if (index >= that.beginIndex && index <= 48) {
                  item.isSub = 1;
                }
              }
            }

            // 如果不是跨天订单，刚刚好到23:00~00:00,不是续单的情况下，
            // 则设置次日的00:00~00:30设置预留打扫时间
            console.log("刚刚好到23:30~00:00 that.endIndex:" + that.endIndex);
            if (item.nextDay == 1) {
              if (that.endIndex == 47 && that.sweepTime == 1) {
                if (index == 48) {
                  item.isSub = 2;
                }
              }
            }
          });
        }

        var selNextDate = computeNextDate(this.dateArr[this.dateActive].date);

        // 次日有没有被预约
        if (sub.endDate == selNextDate) {
          var tmpNextBeginTime = sub.selectBeginTime;
          var firstBeginIndex = 0;
          var firstEndIndex = 0;
          this.timeArr.forEach((item, index) => {
            //console.log("item, index:"+index+"-"+JSON.stringify(item));
            if (item.nextDay == 1) {
              item.dateState = true;
              that.sweepTime = sub.sweep;

              if (item.dateState) {
                if (tmpNextBeginTime == item.begin) {
                  if (firstBeginIndex == 0) {
                    that.beginIndex = index;
                    firstBeginIndex = 1;
                  }
                }

                if (sub.selectEndTime == item.end) {
                  if (firstEndIndex == 0) {
                    that.endIndex = index;
                    firstEndIndex = 1;
                  }
                }
              }
            }
          });

          this.timeArr.forEach((item, index) => {
            if (item.nextDay == 1) {
              if (that.endIndex != 0) {
                if (index >= that.beginIndex && index <= that.endIndex) {
                  item.isSub = 1;
                }

                if (that.sweepTime == 1) {
                  if (that.endIndex + that.sweepTime == index) {
                    item.isSub = 2;
                  }
                }
              }
            }
          });
        }

        // 开始时间 = 选择日期减一日
        var preMonthDayDate = computePreDate(
          this.dateArr[this.dateActive].date
        );

        // 选择不是当天的日期，判断前一日订单是否刚刚好到23:30~00:00
        // 如果不是跨天订单，,不是续单的情况下，
        // 则设置次日的00:00~00:30设置预留打扫时间
        if (sub.endDate == preMonthDayDate) {
          if (sub.selectEndTime == "00:00") {
            this.timeArr.forEach((item, index) => {
              if (index == 0 && sub.sweep == 1) {
                item.isSub = 2;
              }
            });
          }
        }

        // 切换下一天有没有被预约,但不是当天的，这样不会冲突
        if (
          sub.endDate == this.dateArr[this.dateActive].date &&
          sub.date == preMonthDayDate
        ) {
          var tmpBeginTime = "00:00";
          var firstBeginIndex = 0;
          var firstEndIndex = 0;
          console.log("切换下一天有没有被预约");
          console.log("sub.selectEndTime:" + sub.selectEndTime);
          this.timeArr.forEach((item, index) => {
            if (item.nextDay == 0) {
              item.dateState = true;
              that.sweepTime = sub.sweep;
              if (item.dateState) {
                if (tmpBeginTime == item.begin) {
                  if (firstBeginIndex == 0) {
                    that.beginIndex = index;
                    firstBeginIndex = 1;
                  }
                }

                if (sub.selectEndTime == item.end) {
                  if (firstEndIndex == 0) {
                    that.endIndex = index;
                    firstEndIndex = 1;
                  }
                }
              }
            }
          });

          console.log("that.beginIndex:" + that.beginIndex);
          console.log("that.endIndex:" + that.endIndex);
          this.timeArr.forEach((item, index) => {
            if (item.nextDay == 0) {
              if (index >= that.beginIndex && index <= that.endIndex) {
                item.isSub = 1;
              }

              if (that.sweepTime == 1) {
                if (that.endIndex + that.sweepTime == index) {
                  item.isSub = 2;
                }
              }
            }
          });
        }
      });

      // 设置当天过期的时间不显示
      this.timeArr.forEach((item, index) => {
        if (item.nextDay == 0) {
          if (
            this.selectDate == this.nowDate &&
            currentTime().time > `${item.begin}:00`
          ) {
            item.disable = true;
          }
        }
      });

      this.orderDateTime = isFullTime ? "暂无选择" : this.selectDate;
      this.timeActive = -1;
      for (let i = 0, len = this.timeArr.length; i < len; i++) {
        if (!this.timeArr[i].disable) {
          this.orderDateTime = `${this.selectDate} ${this.timeArr[i].time}`;
          this.timeActive = i;
          return;
        }
      }
    },

    // 日期选择事件
    selectDateEvent(index, item) {
      this.selectMinTime = null; // 开始值
      this.selectMaxTime = null; // 结束值
      this.selectTimeNum = null; // 单个选择的下标记
      this.beginIndex = 0; // 预约时间开始的下标
      this.endIndex = 0; // 预约时间结束的下标
      this.dateActive = index;
      this.selectDate = item.date;
      this.initOnload();
    },

    // 时间段的时间选择器
    selectTimes(index, item) {
      if (item.disabled === false && item.isSub === 0) {
        uni.showToast({
          title: "不可选择非空闲时间",
          icon: "none",
        });
        return;
      }

      this.selectTimeNum = null;
      this.selectMinTime = null;
      this.selectMaxTime = null;

      let minIndex = index;
      let maxIndex = this.timeArr.length - 1;

      let tmpMaxIndex = index;
      for (let i = minIndex; i <= maxIndex; i++) {
        if (this.timeArr[i].isSub == 0) {
          tmpMaxIndex++;
        } else {
          break;
        }
      }

      if (
        this.packageMin + this.sweepTime * this.timeInterval * 60 >
        (tmpMaxIndex - minIndex) * this.timeInterval * 60
      ) {
        uni.showToast({
          title: `您的套餐时长为${this.packageMin}分钟, 所选时间段空闲时长不足`,
          icon: "none",
        });
      } else {
        let startTime = minIndex;
        let endTime = startTime + this.packageMin / 60 / this.timeInterval - 1;
        console.log("startTime:" + startTime);
        console.log("endTime:" + endTime);
        this.selectTimeNum = index;
        this.selectMinTime = startTime;
        this.selectMaxTime = endTime;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./pretty-times.scss";
</style>
