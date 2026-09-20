/*
 * @Description: 
 * @version: 1.0
 * @Author: renyong
 * @Date: 2022-05-18 13:38:44
 * @LastEditors: renyong
 * @LastEditTime: 2022-05-19 14:36:54
 */
import { requestFn } from '../api'

// 查询互认统计
export function queryMutualStatistic(params) {
  return requestFn('/recognition/statistics', 'get', params)
}

// 查询互认统计
export function queryMutualTrend(params) {
  return requestFn('/trend/statistics', 'get', params)
}

// 查询互认记录
export function queryMutualHistory(params) {
  return requestFn('/recognition/list', 'get', params)
}

// 查询检查类型
export function queryConditions(params) {
  return requestFn('/recognition/conditions', 'get', params)
}

