/**
 * 演示用假数据兜底。
 *
 * 真实接口优先：只有在请求失败（网络异常 / code 非 200）或返回空数据时，
 * 才回落到 mock 数据，保证列表有内容、详情可点进去。
 * 演示结束把 MOCK_ENABLED 改成 false 即可完全关闭；
 * OFFLINE_DEMO（见 src/config/demo.js）打开时，首个连接失败即进入离线模式。
 */
export const MOCK_ENABLED = true

// 后端不可达时置为 true：后续接口不再发起请求，直接返回假数据，避免逐个等超时
let offline = false

export function markOffline() {
  if (offline) return
  offline = true
  console.warn('[mock] 后端不可达，已切换到离线演示模式：后续接口直接返回模拟数据')
}

const isEmptyData = (res) => {
  const { data } = res || {}
  if (data === undefined || data === null) return true
  if (Array.isArray(data)) return data.length === 0
  if (typeof data === 'object') return Object.keys(data).length === 0
  return false
}

const warn = (name) => {
  console.warn(`[mock] ${name}：接口无数据或请求失败，已使用模拟数据`)
}

/**
 * @param {string} name 接口中文名，仅用于日志
 * @param {Function} request 真实请求，返回 Promise
 * @param {Object|Function} mockData 假数据，或 (params) => 假数据
 * @param {Object} params 原始请求参数，会传给 mockData
 * @param {Object} options
 * @param {boolean} options.fallbackOnEmpty 接口返回空数据时是否兜底。
 *   授权类接口传 false：只在请求失败时兜底，后端明确返回“未授权”时仍然走授权流程。
 */
export async function withMock(name, request, mockData, params, options = {}) {
  if (!MOCK_ENABLED) return request()

  const { fallbackOnEmpty = true } = options

  const build = () => {
    const source = typeof mockData === 'function' ? mockData(params) : mockData
    return JSON.parse(JSON.stringify(source))
  }

  if (offline) return build()

  let res
  try {
    res = await request()
  } catch (e) {
    warn(name)
    return build()
  }
  // 请求失败时 requestFn 会兜底成 {}（见 src/api/api.js），这里把它当作失败继续回落假数据。
  // 注意不要用 isEmptyData 判断：后端明确回答“无数据”不等于请求失败。
  const noResponse = !res || (res.code === undefined && Object.keys(res).length === 0)
  const failed = noResponse || (res.code !== undefined && res.code !== 200)
  if (failed || (fallbackOnEmpty && isEmptyData(res))) {
    warn(name)
    return build()
  }
  return res
}

// 请求参数可能是 FormData，也可能是普通对象
export function readParam(params, key) {
  if (!params) return ''
  if (typeof params.get === 'function') return params.get(key) || ''
  return params[key] || ''
}
