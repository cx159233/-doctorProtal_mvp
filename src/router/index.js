/*
 * @Description:
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-12 11:36:22
 * @LastEditors: renyong
 * @LastEditTime: 2022-08-08 20:18:59
 */
import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'

Vue.use(Router)

// router push callback
const routerPush = Router.prototype.push
Router.prototype.push = function push(location, reslove, reject) {
  if (reslove || reject) return routerPush.call(this, location, reslove, reject)
  return routerPush.call(this, location).catch(e => e)
}
// console.log(routes)
export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior: () => {
    // console.log(123)
    const history = sessionStorage.getItem('history') ? Number(sessionStorage.getItem('history')) : 0

    sessionStorage.setItem('history', history + 1)
    return {
      y: 0
    }
  },
  routes: asyncRouterMap
  // routes: constantRouterMap.concat(asyncRouterMap)
})
