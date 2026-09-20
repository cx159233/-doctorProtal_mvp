import { dataTracking as tracking } from './point'
import { requestFn } from './api'
// import axios from 'axios'
import {getBrowserAndOsInfo} from '@/utils/navigation'
import { getCookie } from '@/utils/cookie'
import store from '../store'
import projectInfo from '../../package.json'
import { withMock } from '@/mock'
import { buildUserInfo, buildTracking, buildOrgList } from '@/mock/user'
// 登录
// export function postLogin(params) {
//   return requestFn('', 'post', params)
// }

// 获取用户信息
// 请求失败时兜底：拿不到用户信息会让路由守卫一直等超时，页面跳转全被拖住。
// fallbackOnEmpty 传 false——后端明确回答“没有这个用户”时不冒充已登录。
export function getUserInfo() {
  return withMock('用户信息', () => requestFn('/user/info', 'get'), () => buildUserInfo(), null, {
    fallbackOnEmpty: false
  })
}
// 获取外部用户信息
export function getWaibuUserInfo(params) {
  return requestFn('/param/decrypt', 'post',params)
}

// 获取cookie
// 请求失败时兜底：拿不到机构列表会被当成“没有可用账号”，弹无权限提示挡住整个页面。
// fallbackOnEmpty 传 false——后端明确回答“没有任何机构”时那是真的没权限，不能拿假数据顶。
export function getUserCookies() {
  return withMock('机构列表', () => requestFn('/org/list', 'get'), () => buildOrgList(), null, {
    fallbackOnEmpty: false
  })
}

export function clearCookie() {
  return requestFn('/ucenter-org-api/v3/api/user/loginout', 'get')
}

// 数据埋点
// 埋点结果没人在意，但请求失败时会白等一个超时，演示环境直接兜底
export function dataTracking(params) {
  const {OS,browser,browserVersion} = getBrowserAndOsInfo.init()
  if( params.extension){
    params.extension={...params.extension,
      browser,
      browser_version_number:browserVersion,
      OS
    }
  }
  return withMock('数据埋点', () => requestFn('/tracking', 'post', params, '', {
    appid: 'js-iis'
  }), () => buildTracking())
}
// 数据埋点
export async function commonTracking(params) {
  const uid=store.state.user.userInfo.uid
  const org_id=getCookie('org_id')
  await tracking( {
    ...params,
    uid: uid,
    org_code: org_id,
    app_code: 'IIS',
    appver: projectInfo.version
  })
}
// 获取验证码
export function getUserCaptcha() {
  return requestFn('v2/user/captcha', 'get',{},`/${window.CONFIG.apiPath}/v2-api`)
}
// 登录
export function postLogin (params) {
  return requestFn('v2/user/login', 'post',params,`/${window.CONFIG.apiPath}/v2-api`)
}
