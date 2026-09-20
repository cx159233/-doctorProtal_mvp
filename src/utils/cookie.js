import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

export const getCookie = (name) => {
  return Vue.prototype.$cookies.get(name)
}

export const removeCookie = (name) => {
  return Vue.prototype.$cookies.remove(name)
}

// 设置cookie
export const setCookie = (name, value) => {
  return Vue.prototype.$cookies.set(name, value)
}
