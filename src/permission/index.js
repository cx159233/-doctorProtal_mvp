/*
 * @Description:
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-14 15:40:14
 * @LastEditors: renyong
 * @LastEditTime: 2022-08-05 16:09:43
 */
import Vue from 'vue'
import router from '../router'
import store from '../store'
import { ssoJump } from '@/utils/auth'
import { getCookie, setCookie } from '@/utils/cookie'
import defaultConfig from '@/config/default.config'
import { modifyToken,getInterDyUrl } from '@/api/image-list'
// import NProgress from 'nprogress' // 进入条
import ClientMonitor from 'skywalking-client-js'
import { OFFLINE_DEMO } from '@/config/demo'
import {menuList} from '@/components/GlobalHeader/config/index.js'
const whiteList = ['/landing','/login'] // 白名单
const pageRouteMonitor = () => {
  if (OFFLINE_DEMO) return // 演示环境无 APM 后端，跳过性能上报
  ClientMonitor.setPerformance({
    pagePath: location.href, // 当前路由地址。
    useFmp: true,
    vue: Vue
  })
}
// const defaultRoutePath = '/home' // 默认路径
const storeInfo = (token, next, to) => {
  // 初始化用户信息
  // if (token) { // 如果有token
  //   setCookie('uuc_token', token)
  // }
  // 然后再获取用户信息
  const oldInfo = store.getters.userLoginInfo
  
  store
    .dispatch('GetInfo', token)
    .then(res => {
      // 接口失败时 res 为 undefined，直接放行，不要抛错
      if (res?.code === 200) {
        if(oldInfo?.uid !== res.data.uid){
          store.dispatch('DeleteTabPane',[])
        }
        if((to.path === '/detail/image' || to.path === '/detail/report') && to.query.uid !== res.data.uid){
          store.dispatch('DeleteTabPane',[])
          location.href = location.pathname
          return 
        }
        store.dispatch('GetGlobal').then(res => {
          // if (path)
          next()
        })
      } else {
        next()
      }
    })
    .catch(() => {
      next()
      // defaultConfig.development ? next() : ssoJump()
    })
}
const initSystem = () => {
  // 初始化系统
  store.dispatch('SetUserInfo', {})
  store.dispatch('SetHospitalName', '')
  store.dispatch('ResetSystem', false) // 系统重置
}
router.beforeEach((to, from, next) => {
  pageRouteMonitor()
  const url_token = to.query.token // 如果能获取到token
  const app_dpt_name = to.query.app_dpt_name
  const uid = store.getters.userInfo?.uid
  // const uuc_token = getCookie('uuc_token')
if(to.path === '/login' && uid){
  next('/')
} else if(whiteList.includes(to.path)){
    return next()
  }else if (url_token) {
    try {
      modifyToken({
        token: url_token,
        app_dpt_name
       }).then(async res => {
        if (res.code === 200) {
          const paramsData = to.query.params || getCookie('url_params')
          sessionStorage.setItem('iframe_url', '')
            sessionStorage.setItem('menuList', '')
      if (paramsData && window.CONFIG.source.syptdz) {
        const res = await getInterDyUrl({ encryptParams: paramsData })
        if (res.code === 200) {
          const { tabName, url } = res.data || {}
          if (tabName) {
            menuList.forEach((item)=>{
              if(item.key === '/iframe'){
                item.title = tabName
                item.key = `/iframe`
                item.isHide = false
                item.keyPath = `/iframe`
              }
            })
            sessionStorage.setItem('iframe_url', url)
            sessionStorage.setItem('menuList', JSON.stringify(menuList))
            store.commit('SET_MENULIST_INFO', menuList)
          }
        }
      }
          initSystem() // 系统初始化
          storeInfo('', next, to) // 存用户信息
          store.dispatch('SetToken', url_token)
        }
      })
    } catch(e) {
      console.log(e)
    }
  } else {
    storeInfo('', next, to)
  }
})
