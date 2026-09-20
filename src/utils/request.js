import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import { USER_INFO } from '../store/mutation-types'
import { notification } from 'ant-design-vue'
import { VueAxios } from './axios'
import { ssoJump, clearAllCookie } from '@/utils/auth'
import hmacAuth from '@/utils/hmac-auth'
import { async } from 'regenerator-runtime'
import { OFFLINE_DEMO, REQUEST_TIMEOUT } from '@/config/demo'
import { markOffline } from '@/mock'
// import { getCookie } from './cookie'

// console.log('process.env.NODE_ENV', process.env.NODE_ENV)
// api 根路径
const API_ROOT = window.CONFIG.apiRoot

// 创建axios实例
const instance = axios.create({
  baseURL: API_ROOT,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})
// 响应错误
const err = (error) => {
  // console.log(error.response)
  // const { config } = error.response
  const status = error?.response?.status
  // 连不上后端（超时、代理 502/503/504）：离线演示下后续接口直接走假数据，不再逐个等超时
  if (OFFLINE_DEMO && (!error?.response || (status >= 502 && status <= 504))) markOffline()
  const { config, code, message } = error?.response?.data || {}
  if(config?.url?.includes('tracking') && code === 400) return
  Vue.prototype.$destroyAll && Vue.prototype.$destroyAll()
  if (code === 401 || code === 403 || code === 400) {
    if(code === 401 && window.location.hash.includes('/login')){
      return  // 是为了检查用户是否已经登录  现在路由守卫用的userinfo 但是关闭窗口会被清除
    }
    Vue.prototype.$warning({
      title: '该用户暂无权限',
      content: h => <div><p style="color: red;">{message}</p></div>,
      icon: h => <a-icon type="exclamation-circle" />,
      centered: true,
      okText: '请重新登录',
      onOk: () => {
        store.dispatch('DeleteTabPane', [])
        clearAllCookie()
        ssoJump() // 到登录页面
      }
    })
    return
  }
}

// 请求拦截
instance.interceptors.request.use( async config => {
   await hmacAuth(config)
  // 后面需删除   账户管理需移出去
  // 在发送请求之前做些什么
  if(config.url.indexOf('/ucenter-org-api/v3') !== -1){
    config.baseURL = ''
  }
  if(config.url.indexOf('v2/user/login') !== -1){
    config.headers['Content-Type'] = 'application/json'
  }
  if(config.url.indexOf('test-api') !== -1){
    config.headers['Content-Type'] = 'application/json'
    config.url = config.url.replace('/test-api', '')
    config.baseURL = config.baseURL.replace('/api', '/test-api')
  }
  if (!config.data) config.data = {}
  return config
}, err)

// 相应拦截
instance.interceptors.response.use(res => {
  const { code, message, config } = res.data
  // if(config.url.includes('tracking') && code === 400) return
  if( code === 401 && res.config.url === 'v2/user/login'){
    Vue.prototype.$message.error(message)
    return
  }
  if (code === 401 || code === 403) { // 401 或者 403处理
    Vue.prototype.$destroyAll && Vue.prototype.$destroyAll() // 销毁多余模态框
    Vue.prototype.$warning({
      title: '该用户暂无权限',
      content: h => <div><p style="color: red;">{message}</p></div>,
      icon: h => <a-icon type="exclamation-circle" />,
      centered: true,
      okText: '请重新登录',
      onOk: () => {
        store.dispatch('DeleteTabPane', [])
        clearAllCookie()
        ssoJump() // 到登录页面
      }
    })
    return
  }
  // 处理其他不等于200的状态码
  if (code !== 200) {
    const userInfo = JSON.parse(Vue.ls.get(USER_INFO)) // 如果能缓存中获取
    if(userInfo && userInfo.debug) {
      notification.error({
        duration: 5,
        message: res.config.url,
        description: `参数： ${res.config.data} 错误日志：${message}`,
        btn: h => {
          return h(
            'a-button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  Vue.prototype.$copyText(`${response.config.url}参数: ${response.config.data}错误日志：${message}`)
                  Vue.prototype.$message.success('复制成功')
                }
              }
            },
            '复制'
          )
        }
      })
    } else {
      notification.error({ message })
    }
  }
  return res.data || res
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, instance)
  }
}

export {
  installer as VueAxios,
  instance as axios,
  API_ROOT
}