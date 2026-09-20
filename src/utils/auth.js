// import Vue from 'vue'
// import CONFIG from '@/config/global.config'
// import defaultConfig from '@/config/default.config'

/**
 * 单点登录跳转
 */
export const ssoJump = () => {
  window.location.href = `${window.CONFIG.ssoLoginUrl}/#/user/login`
  // const redirect = window.location.href.split('#')[0] + '#/home/index'
  // window.location.href = `${window.CONFIG.ssoLoginUrl}/#/user/login?redirect=${encodeURIComponent(redirect)}&code=IIS`
  // // 生成环境才跳转单点登录
  // if (defaultConfig.production) {
  //   window.location.href = CONFIG.sso
  // } else {
  //   console.warn('本地还没有登录信息')
  // }
}
export const clearAllCookie = () => {
  var keys = document.cookie.match(/[^ =;]+(?==)/g)
  if (keys) {
    for (var i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString()
      document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString()
      document.cookie = keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString()
    }
  }
}
