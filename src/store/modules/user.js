import Vue from 'vue'
import { postLogin, getUserInfo, getCookies, clearCookie } from '@/api'
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'
import { removeCookie, setCookie } from '@/utils/cookie'
import { ssoJump,clearAllCookie } from '@/utils/auth'
import {menuList} from '@/components/GlobalHeader/config/index.js'
const user = {
  state: {
    orgList:[],
    token: '', // 令牌
    cookie: '', // cookie
    name: '', // 名字
    hospital_name: '', // 医院名称
    welcome: '', // 欢迎语
    avatar: '', // 头像
    roles: [], // 角色
    permissions: [],
    userLoginInfo: null, // 存储用户的登录信息，包含token
    timeViewRange: '', // 时间范围
    userInfo: {
      avatar: ''
    },
    message:true,//是否展示提示信息
    navigator:{},
    hospital_data:{},
    menulistInfo: sessionStorage.getItem('menuList')?JSON.parse(sessionStorage.getItem('menuList')): menuList//菜单列表
  },
  mutations: {
    SET_ORG_LIST: (state, arr) => { 
      state.orgList = arr
    },
    RESET_OTHER_INFO: (state) => {
      state.menulistInfo = menuList
      state.hospital_data = {}
    },
    SET_MENULIST_INFO: (state, arr) => { // 设置医院名称
      state.menulistInfo = arr
    },
    SET_HOSPITALDATA: (state, obj) => { // 设置医院名称
      state.hospital_data = obj
    },
    SET_NAVIGATOR: (state, obj) => { // 设置用户登录信息
      state.navigator = obj
    },
    SET_USER_LOGIN_INFO: (state, obj) => { // 设置用户登录信息
      state.userLoginInfo = obj
    },
    SET_TOKEN: (state, token) => { // 设置token
      state.token = token
    },
    SET_COOKIE: (state, cookie) => { // 设置cookie
      state.cookie = cookie
    },
    SET_NAME: (state, name) => { // 设置名字
      state.name = name
    },
    SET_AVATAR: (state, avatar) => { // 设置头像
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => { // 设置角色
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => { // 设置通行许可
      state.permissions = permissions
    },
    SET_INFO: (state, info) => { // 设置信息
      state.userInfo = info
    },
    SET_HOSPITALNAME: (state, name) => { // 设置医院
      state.hospital_name = name
    },
    SET_TIME_VIEW_RANG: (state, val) => { // 全局存储
      state.timeViewRange = val
    },
    SET_MESSAGE: (state, val) => { // 全局存储
      state.message = val
    },
  },
  actions: {
    setOrgList({ commit }, arr) {
      commit('SET_ORG_LIST', arr)
    },
    // 重新赋值
    resetOtherInfo({ commit }, arr) {
      commit('RESET_OTHER_INFO', arr)
    },
    setHospitalData({ commit }, obj) {
      commit('SET_HOSPITAL_DATA', obj)
    },
    // 获取时间范围
    getTimeViewRange: ({ commit }, val) => {
      commit('SET_TIME_VIEW_RANG', val)
    },
    // 获取用户登录
    getUserLogin({commit}, obj) {
      commit('SET_USER_LOGIN_INFO', obj)
    },
    // 登录
    Login ( { commit }, userInfo) {
      return  new Promise((resolve) => {
        postLogin(userInfo).then(res => {
          resolve(res)
        })
      })
    },

    // 设置token
    SetToken({commit}, token) {
      commit('SET_TOKEN', token)
    },
    
    // 设置名字
    SetName({ commit }, name) {
      commit('SET_NAME', name)
    },

    // 设置用户信息
    SetUserInfo({ commit }, userInfo) {
      return new Promise((reslove) => {
        commit('SET_INFO', userInfo)
        reslove()
      })
    },
    // 设置医院名称
    SetHospitalName({commit}, name) {
      return new Promise((resolve) => {
        commit('SET_HOSPITALNAME', name)
        resolve()
      })
    },
    
    // 获取用户信息
    GetInfo({ commit }, token) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          // 接口异常时 res 可能为空，兜底成 {}，避免下游读 userInfo.xxx 报错白屏
          const info = res?.data || {}
          commit('SET_INFO', info)
          const obj = {
            token
          }
          const obj1 = {}
          Object.assign(obj1, info, obj)
          commit('SET_USER_LOGIN_INFO', obj1)
          !token && this._vm.$bus.$emit('userChange')
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    },

    // 登出
    Logout({ commit }, redirect) {
      return new Promise((resolve) => {
        clearCookie().then(res => {
          clearAllCookie()
          ssoJump(redirect)
          resolve()
        })
      })
    },
    // 设置org_id cookie
    SetCookie({ commit }, code) {
      // console.log(code)
      return new Promise((resolve, reject) => {
        setCookie('org_id', code) // 重新设置cookie
        resolve()
      })
    }
  }
}

export default user