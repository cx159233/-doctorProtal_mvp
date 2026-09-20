/*
 * @Description:
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-14 15:40:14
 * @LastEditors: renyong
 * @LastEditTime: 2022-06-28 11:30:10
 */
import { requestFn } from '../api'
import { withMock } from '@/mock'
import {
  buildStudyList,
  buildCrossProvinceStudyList,
  buildStudyConditions,
  buildTimeRange,
  buildAuthStatus
} from '@/mock/image'

// 查询影像列表
export function queryTableList(params) {
  // console.log('params', params)
  return withMock(
    '影像列表',
    () => requestFn('/study/list', 'post', params),
    () => buildStudyList(params),
    params
  )
}

// 查询省外调阅列表
export function queryCrossProvinceList(params) {
  return withMock(
    '省外调阅列表',
    () => requestFn('/study/cross_province_list', 'post', params),
    () => buildCrossProvinceStudyList(params),
    params
  )
}

// 查询影像列表
export function queryList(params) {
  // console.log('params', params)
  return requestFn('/recognition/check_report', 'post', params)
}
// 查询医院名称
export function queryHospitalName(params) {
  return withMock(
    '影像查询条件',
    () => requestFn('/study/conditions', 'post', params),
    () => buildStudyConditions(),
    params
  )
}

// 查询检查类型
export function queryCheckType() {
  return requestFn('/study/study_method', 'get')
}

// 获取时间查看范围
export function getTimeRange() {
  return withMock('时间范围', () => requestFn('/user/time_range', 'get'), () => buildTimeRange())
}

// 查询影像列表mock数据
export function queryMockTableList(params) {
  return requestFn('http://192.168.0.82:30080/v1/study/list', 'post', params)
}

// 查询详情mock数据
export function queryMockDetail() {
  return requestFn('http://192.168.0.82:30080/v1/study/detail', 'get', params)
}

// 修改token
export function modifyToken(params) {
  return requestFn(`/v2/inject/token`, 'get', params, `/${window.CONFIG.apiPath}/v2-api`)
}
// 授权关系创建
export function createAuth(params) {
  return requestFn('/auth/create', 'post', params)
}

// 获取授权状态：后端能答就必须听它的，只有请求失败（离线演示）才兜底
export function getAuthStatus(params) {
  return withMock(
    '授权状态',
    () => requestFn('/auth/info', 'get', params),
    () => buildAuthStatus(),
    params,
    { fallbackOnEmpty: false }
  )
}

// 确认授权关系
export function confirmAuth(params) {
  return requestFn('/auth/confirm', 'post', params)
}

// 获取健康通二维码
export function getAppQRCode(params) {
  return requestFn('/user/app_qr_code', 'get', params)
}
// 获取第三方授权二维码
export function getMiniQRCode(params) {
  return requestFn('/user/miniapp_qr_code', 'get', params)
}
// 获取验证码
export function getSms(params) {
  return requestFn('/sms/send', 'post', params)
}

// 验证码校验
export function smsValidate(params) {
  return requestFn('/sms/validate', 'post', params)
}

// 验证码校验
export function getHistoryPhone(cardno) {
  return requestFn(`/patient/phone/history?cardno=${cardno}`, 'get')
}
// 获取健康通二维码
export function getAuthMethod(params) {
  return requestFn('/org/auth/method', 'get', params)
}
export function getInterDyUrl(params) {
  return requestFn('/test-api/admin/kydy/getInterDyUrl', 'post', params)
}
