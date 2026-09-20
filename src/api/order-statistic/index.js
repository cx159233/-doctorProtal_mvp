import { requestFn } from '../api'

// 个人开单统计
export function queryOrderStatistics(params) {
  return requestFn('/personal/order/statistics', 'get', params)
}
// 个人开单记录
export function queryOrderRecord(params) {
  return requestFn('/personal/order/record', 'get', params)
}