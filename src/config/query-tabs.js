/**
 * 顶部导航下面那条「查询类」页签栏（tab1）。
 *
 * 有 path 的点了就跳转，和点顶部导航是同一件事；没有 path 的是占位项，
 * 本应用没有对应模块（体检/用药），点了只提示，用来对齐宿主系统的页签。
 *
 * 报告/影像页签不走这里，它们归 GlobalTab（tab2）。
 */
export const QUERY_TABS = [
  { key: 'outpatient', text: '门诊记录', path: '/outpatient/index' },
  { key: 'inpatient', text: '住院记录', path: '/inpatient/index' },
  { key: 'image', text: '全国影像检查', path: '/home/index' },
  { key: 'inspection', text: '检验记录', path: '/inspection/index' },
  { key: 'pathology', text: '病理记录', path: '/pathology/index' },
  { key: 'vital', text: '穿戴数据', path: '/vital/index' },
  { key: 'physical', text: '体检报告', disabled: true },
  { key: 'medication', text: '用药记录', disabled: true }
]

/** 当前路由命中哪个查询页签。详情页（报告/影像）返回空串，此时沿用上一次命中的页签。 */
export function queryTabKeyOfRoute(path) {
  if (!path) return ''
  if (path.includes('/inspection')) return 'inspection'
  if (path.includes('/outpatient')) return 'outpatient'
  if (path.includes('/inpatient')) return 'inpatient'
  if (path.includes('/pathology')) return 'pathology'
  if (path.includes('/vital')) return 'vital'
  if (path.includes('/home/index') || path.includes('/home/cross-province')) return 'image'
  return ''
}
