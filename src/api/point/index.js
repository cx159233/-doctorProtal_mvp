import { axios } from './axios.js'
import { getBrowserAndOsInfo, encrypt } from './utils'
const PATH_NAME = `/${window.CONFIG.apiPath}/tracking/`
// 数据埋点
let number = 1 //每次埋点的数量
// let ip = ""; //ip
export async function init(num) {
  //初始化
  number = num
}
export async function dataTracking(external = {}) {
  // if (!ip) {
  //   ip = await getIP();
  // }
  const arr = JSON.parse(sessionStorage.getItem('dataTracking')) || []
  arr.push(external)
  if (arr.length > number - 1) {
    const dealArr = arr.splice(0, number)
    dealArr.forEach(async (item) => {
      tracking(item)
    })
  }
  sessionStorage.setItem('dataTracking', JSON.stringify(arr))
}
async function getToken(app_code) {
  //获取token
  const encryptText = encrypt(app_code)
  return axios({
    // 本地代理
    url: `${window.location.origin}${PATH_NAME}api/v2/token`,
    method: 'get',
    params: {
      app_code,
    },
    headers: {
      sign: encryptText,
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}
async function tracking(external = {}) {
  return new Promise(async (resolve, reject) => {
    const app_code = external.app_code
    if (
      new Date().getTime() >  sessionStorage.getItem('point_time')||
      !sessionStorage.getItem('point_token') ||
      (sessionStorage.getItem('point_token') &&
        sessionStorage.getItem('app_code') !== app_code)
    ) {
      const { data, code } = (await getToken(app_code)) || {}
      if (code === 200) {
        const time = new Date().getTime() + 1000 * 60 * 60 * 2
        sessionStorage.setItem('point_time', time)
        sessionStorage.setItem('point_token', data)
        sessionStorage.setItem('app_code', app_code)
      }
    }
    const {
      model,
      browser,
      os_version,
      os,
      browser_version,
      network_type,
      manufacturer,
    } = getBrowserAndOsInfo.init()
    external = {
      ...external,
      lib_version: '1.0.0',
      screen_height: window.screen.height,
      screen_width: window.screen.width,
      url: window.location.href,
      // ip,
      manufacturer,
      browser,
      browser_version,
      os_version:`${os_version||''}`,
      model,
      os,
      network_type,
      referrer_url: document.referrer,
      timestamp: new Date().getTime(),
    }
    axios({
      // 本地代理
      url: `${window.location.origin}${PATH_NAME}api/v2/tracking`,
      method: 'post',
      data: external,
      headers: {
        'x-token': sessionStorage.getItem('point_token'),
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  })
}
