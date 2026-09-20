/**
 * 登录用户与埋点接口的演示数据。
 * 这两个接口都在页面跳转链路上：拿不到响应时路由守卫会一直卡在超时上，
 * 所以离线演示必须让它们立刻有结果。
 */

// uid 会被拼进详情页路由的 query，路由守卫会用它和 /user/info 的返回值比对，
// 所以这里必须和 getStatus 的 uid 保持一致，否则点进详情会被弹回列表。
export const DEMO_UID = 'demo0001'

export function buildUserInfo() {
  return {
    code: 200,
    message: 'ok',
    data: {
      uid: DEMO_UID,
      user_name: '陈*医生',
      org_id: '3204000001',
      hospital_name: '常州市第一人民医院',
      avatar: ''
    }
  }
}

export function buildTracking() {
  return { code: 200, message: 'ok', data: null }
}

/**
 * /org/list 的演示数据：用户可访问的机构列表。
 * UserMenu 拿这份数据设置医院名称和 org_id cookie；
 * 返回空数组会被当成“没有可用账号”弹无权限提示，所以至少要有一个 status 为 1 的机构。
 * error 字段不能省：UserMenu 会直接读 error.code，缺字段会抛错中断后续的 cookie 设置。
 */
export function buildOrgList() {
  return {
    code: 200,
    message: 'ok',
    error: { code: 200, message: 'ok' },
    data: [
      { code: '3204000001', name: '常州市第一人民医院', status: 1 },
      { code: '3204000002', name: '常州市第二人民医院', status: 1 }
    ]
  }
}
