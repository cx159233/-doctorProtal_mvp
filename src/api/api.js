/*
 * @Description: 
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-14 15:40:14
 * @LastEditors: renyong
 * @LastEditTime: 2022-05-26 15:12:09
 */
import { axios } from '@/utils/request'

// 全局请求方法
export async function requestFn(url = '', method = 'get', params = undefined, baseURL = '', headers = null) { // url请求地址 method默认为get, params默认undefined
  const parameters = {
    url,
    method
  }
  if (baseURL) parameters['baseURL'] = baseURL
  if (headers) parameters['headers'] = headers
  if (method === 'post') {
    parameters['data'] = params
  } else if (method === 'get') { // 如果是get
    if (params) { // 如果params存在
      parameters['params'] = params // 添加params属性
    }
  }
  const res = await axios(parameters)
  // 请求失败时响应拦截器返回 undefined，而调用方大量使用 const { data } = await xxx() 解构，
  // 解构 undefined 会抛 TypeError 打断整个流程，这里统一兜底成空对象
  return res === undefined ? {} : res
}



