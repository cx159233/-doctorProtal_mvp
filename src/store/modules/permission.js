import { constantRouterMap } from '@/config/router.config'

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */

// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => { // 设置路由
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routes)
    }
  },
  actions: {
    GenerateRoutes () {
      return new Promise(resolve => {
        resolve()
      })
    }
  }
}

export default permission
