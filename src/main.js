/*
 * @Description: 文件入口
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-12 11:36:22
 * @LastEditors: renyong
 * @LastEditTime: 2022-08-05 17:05:57
 */
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import config from './config/default.config'
import projectInfo from '../package.json'

import './core/global'
import './core/install_use'
import './permission'
import './style/global.less'
import './style/component/index.less'
import table from './components/sk-table'
import './skywalking'
Vue.component('sk-table', table)
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
const vm = new Vue({
  router,
  store,
  render: h => h(App),
})
vm.$mount('#app')

if (config.production) {
  console.log('%c' + config.projectName + '', 'color:blue; font-size: 16px;')
  console.log('当前版本: %c ' + projectInfo.version, 'color: #fccc00;')
  console.log('%c请不要在此粘贴任何代码，否则后果很严重', 'color:red; font-size: 16px;')
}

// 卸载前，清除localStorage
window.onbeforeunload = (e) => {
  // console.log(1)
  localStorage.clear()
}
