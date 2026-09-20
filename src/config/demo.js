/**
 * 演示开关。整套假数据兜底见 src/mock。
 *
 * OFFLINE_DEMO = true 时，后端不可达（连不上 / 5xx 代理错误）会让请求快速失败，
 * 之后所有接口直接返回 src/mock 的假数据，不再逐个等待超时。
 * 回到院内网络联调时把它改成 false，即恢复「真实接口优先、只兜底空数据」。
 */
export const OFFLINE_DEMO = true

// 离线演示下收窄超时：首个请求失败后才会切到离线模式，这一步会卡在路由守卫上，
// 超时太长首屏就是一片空白，所以只留够确认连不上的时间
export const REQUEST_TIMEOUT = OFFLINE_DEMO ? 1200 : 20000

/**
 * 查询页默认患者信息：默认写入并置灰，配合假数据让列表和详情可以直接点开。
 */
export const DEFAULT_PATIENT = {
  name: '张伟',
  idCard: '320402197103154733'
}
