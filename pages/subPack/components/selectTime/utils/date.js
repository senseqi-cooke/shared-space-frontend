//字符串拼接
function strFormat(str) {
  return str < 10 ? `0${str}` : str;
}
// 获取当前时间
export function currentTime() {
  const myDate = new Date();
  const y = myDate.getFullYear();
  const m = myDate.getMonth() + 1;
  const d = myDate.getDate();
  const date = strFormat(m) + "-" + strFormat(d);

  const hour = myDate.getHours();
  const min = myDate.getMinutes();
  const secon = myDate.getSeconds();
  const time = strFormat(hour) + ":" + strFormat(min) + ":" + strFormat(secon);
  return {
    date,
    time,
  };
}

//时间戳转日期
export function timeStamp(time, isQuantum) {
  const dates = new Date(time);
  const year = dates.getFullYear();
  const month = dates.getMonth() + 1;
  const date = dates.getDate();
  const day = dates.getDay();
  const hour = dates.getHours();
  const min = dates.getMinutes();
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  return {
    allDate: `${year}/${strFormat(month)}/${strFormat(date)}`,
    date: `${strFormat(month)}-${strFormat(date)}`, //返回的日期 07-01
    date1: `${strFormat(year)}-${strFormat(month)}-${strFormat(date)}`, //返回的日期 07-01
    day: `周${days[day]}`, //返回的礼拜天数  星期一
    hour: strFormat(hour) + ":" + strFormat(min) + (isQuantum ? "" : ":00"), //返回的时钟 08:00
  };
}

//获取最近7天的日期和礼拜天数
export function initData() {
  const time = [];
  const date = new Date();

  const now = date.getTime(); //获取当前日期的时间戳
  let timeStr = 3600 * 24 * 1000; //一天的时间戳
  let obj = {
    0: "今天",
  };
  for (let i = 0; i < 7; i++) {
    time.push({
      date: timeStamp(now + timeStr * i).date, //保存日期
      date1: timeStamp(now + timeStr * i).date1, //保存日期
      timeStamp: now + timeStr * i, //保存时间戳
      week: obj[i] ?? timeStamp(now + timeStr * i).day,
    });
  }
  return time;
}

// 获取当前选择的日期
export function getSelCurrentday(selectDate) {
  var date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? "0" + month : month; //月小于10，加0
  day = day < 10 ? "0" + day : day; //day小于10，加0
  return `${year}-` + selectDate;
}

export function computeNextDate(selectDate) {
  var selCurrentday = getSelCurrentday(selectDate);
  // 后一天
  let odata = new Date(new Date(selCurrentday).getTime() + 24 * 60 * 60 * 1000);
  // 计算当前日期 +1
  // 格式化日期并赋值
  return getFormatNextDate(odata);
}

export function computePreDate(selectDate) {
  var selCurrentday = getSelCurrentday(selectDate);
  // 前一天
  let odata = new Date(new Date(selCurrentday).getTime() - 24 * 60 * 60 * 1000);
  // 计算当前日期 -1
  // 格式化日期并赋值
  return getFormatNextDate(odata);
}

export function getFormatNextDate(date) {
  var date = new Date(date);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? "0" + month : month; //月小于10，加0
  day = day < 10 ? "0" + day : day; //day小于10，加0
  //return `${ year}-${ month}-${ day}`;
  return `${month}-${day}`;
}

export function formatTodayDate() {
  var date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? "0" + month : month; //月小于10，加0
  day = day < 10 ? "0" + day : day; //day小于10，加0
  //return `${ year}-${ month}-${ day}`;
  return `${month}-${day}`;
}

export function getFormatNextDateForYear(date) {
  var date = new Date(date);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? "0" + month : month; //月小于10，加0
  day = day < 10 ? "0" + day : day; //day小于10，加0
  return `${year}-${month}-${day}`;
  //return `${month}-${day}`;
}

// 时间数组
export function initTime(
  selectDate = "10-08",
  startTime = "00:00:00",
  endTime = "24:00:00",
  timeInterval = 1,
  isQuantum = true
) {
  const time = [];
  const date = timeStamp(Date.now()).allDate;
  const startDate = `${date} ${startTime}`;
  const endDate = `${date} ${endTime}`;
  const startTimeStamp = new Date(startDate).getTime();
  const endTimeStamp = new Date(endDate).getTime();
  const endTimeStampAdd = endTimeStamp + 1000 * 60;
  const timeStr = 3600 * 1000 * timeInterval;
  const sum = (endTimeStampAdd - startTimeStamp) / timeStr;
  const count = sum % 2 == 0 ? sum : sum - 1;
  let num = 0;

  for (let i = startTimeStamp; i <= endTimeStampAdd; i = i + timeStr) {
    if (isQuantum) {
      num++;

      time.push({
        begin: timeStamp(i, isQuantum).hour,
        end: timeStamp(i + timeStr, isQuantum).hour,
        disable: false,
        nextDay: 0,
        selectDate: selectDate,
        isSub: 0,
      });
    } else {
      time.push({
        time: timeStamp(i).hour,
        disable: false,
      });
    }

    if (isQuantum && num >= count) return time;
  }
  return time;
}

// 时间数组
export function initNextTime(
  selectDate = "10-08",
  startTime = "00:00:00",
  endTime = "24:00:00",
  timeInterval = 1,
  isQuantum = true
) {
  //var selNextDate = computeNextDate(selectDate);
  // console.log("initTime-selNextDate:"+selNextDate);
  const time = [];
  const date = timeStamp(Date.now()).allDate;
  const startDate = `${date} ${startTime}`;
  const endDate = `${date} ${endTime}`;
  const startTimeStamp = new Date(startDate).getTime();
  const endTimeStamp = new Date(endDate).getTime();
  const endTimeStampAdd = endTimeStamp + 1000 * 60;
  const timeStr = 3600 * 1000 * timeInterval;
  const sum = (endTimeStampAdd - startTimeStamp) / timeStr;
  const count = sum % 2 == 0 ? sum : sum - 1;
  let num = 0;

  // console.log("startTimeStamp:"+startTimeStamp);
  // console.log("endTimeStamp:"+endTimeStamp);
  // console.log("endTimeStampAdd:"+endTimeStampAdd);

  for (let i = startTimeStamp; i <= endTimeStampAdd; i = i + timeStr) {
    if (isQuantum) {
      num++;
      //console.log("timeStamp(i, isQuantum).hour:"+timeStamp(i, isQuantum).hour);
      //console.log("timeStamp(i + timeStr, isQuantum).hour:"+timeStamp(i + timeStr, isQuantum).hour);

      time.push({
        begin: timeStamp(i, isQuantum).hour,
        end: timeStamp(i + timeStr, isQuantum).hour,
        disable: false,
        nextDay: 1,
        selectDate: selectDate,
        isSub: 0,
      });
    } else {
      time.push({
        time: timeStamp(i).hour,
        disable: false,
      });
    }

    if (isQuantum && num >= count) return time;
  }

  return time;
}
