/* 常用方法 */
import Moment from 'moment'
// post普通数据
export function postNormalData(json) {
  const formData = new FormData()
  for (const key in json) {
    const val = json[key]
    formData.append(key, val)
  }
  return formData
}

// 数组转化成',’隔开的字符串
export function arrTransferStr(arr) {
  return arr.join(',')
}

// json 转化
export function jsonTransfer(json) {
  const arr = []
  for (const key in json) {
    arr.push({
      key,
      text: json[key]
    })
  }
  return arr
}

// 去掉字符串首尾的空格
export function trimStr(str) {
  return (str = str && str.trim())
}
// 去掉字符串首中尾的空格
export function trimStrAll(str) {
  if(str){
    return str.replace(/\s/g,'')
  }else{
    return str
  }
}
// 字符串转化为数组
export function strToArr(str) {
  if (str.length === 1) {
    return (str = str === '0' ? [] : [str])
  } else {
    return str && str.indexOf(',') && str.split(',')
  }
}

// 深度克隆
export function cloneObj(obj) {
  let str,
    newobj = obj.constructor === Array ? [] : {}
  if (typeof obj !== 'object') {
    return
  } else if (window.JSON) {
      str = JSON.stringify(obj), //序列化对象
      newobj = JSON.parse(str) //还原
  } else {
    for (const i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i]
    }
  }
  return newobj
}

// 获取url问号后面的参数
export function getQueryString(name) {
  const r =
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')
    ) || null
  return r
}

/*
  时间格式化
  fmt：格式 （YYYY-MM-DD hh:mm:ss）
  data: 时间（new Date()）
*/
export function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  // author: meizz
  typeof date !== 'object' && (date = new Date(date))
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return fmt
}


/**
 * @Description: 获取两个日期间的所有日期
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @return {*}
 * @author: renyong
 */
export const getAllDateBetweenDates = ({startDate, endDate }) => {
  const start = Moment(startDate)
  let dayList = [Moment(startDate).format('YYYY-MM-DD')] // 返回所有日期
  const end = Moment(endDate)
  const day = Math.abs(end.diff(start, 'days')) // 结束日期和开始日期相差多少天
  for(let i = 1; i < day; i++) {
    dayList.push(start.add(1, 'days').format('YYYY-MM-DD'))
  }
  dayList.push(Moment(endDate).format('YYYY-MM-DD'))
  dayList = [...new Set(dayList)] // 去重处理
  return dayList
}

/**
 * @Description: 身份证脱敏
 * @param {*} str  传入的身份证号
 * @param {*} beginLen 开始脱敏的位置
 * @param {*} endLen 结束脱敏的位置
 * @return {*}
 * @author: renyong
 */
export const desensitization = (str, beginLen, endLen) => {
  const len = str.length
  const firstStr = str.substr(0, beginLen)
  const lastStr = str.substr(endLen)
  const middleStr = str.substring(beginLen, len - Math.abs(endLen)).replace(/[\s\S]/ig, '*')
  return firstStr + middleStr + lastStr
}
/**
 * 复制到剪切板
 * @param {*} message 
 */
export const copyToClipbord = (message) => {
  var input = document.createElement('textarea')
  input.value = message
  document.body.appendChild(input)
  input.select()
  input.setSelectionRange(0, input.value.length)
  document.execCommand('Copy')
  document.body.removeChild(input)
}