/*
 * @Description: 
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-14 15:40:14
 * @LastEditors: renyong
 * @LastEditTime: 2022-05-16 17:31:03
 */
export default [
  {
    // 个人医保画像：整屏大屏，走 iframe 嵌独立构建的静态产物。
    // showTab 关掉，免得这条查询页签栏和 GlobalTab 出现在大屏上面
    path: '/portrait/index',
    name: 'portrait',
    component: () => import('@/views/portrait/index.vue'),
    meta: { title: '个人医保画像', icon: 'user', keepAlive: false, showTab: false, fullBleed: true }
  },
  {
    path: '/home/index',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '医保健康档案', icon: 'home', keepAlive: true, showTab: true }
  },
  {
    path: '/home/cross-province/:id/:type',
    name: 'crossProvince',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '跨省调阅', icon: 'home', keepAlive: false, showTab: true }
  },
  
  {
    path: '/inspection/index',
    name: 'inspection',
    component: () => import('@/views/home/inspection.vue'),
    meta: { title: '检验查询', icon: 'home', keepAlive: false, showTab: true }
  },
  {
    path: '/outpatient/index',
    name: 'outpatient',
    component: () => import('@/views/outpatient/index.vue'),
    meta: { title: '门诊查询', icon: 'home', keepAlive: false, showTab: true }
  },
  {
    path: '/inpatient/index',
    name: 'inpatient',
    component: () => import('@/views/inpatient/index.vue'),
    meta: { title: '住院查询', icon: 'home', keepAlive: false, showTab: true }
  },
  {
    path: '/vital/index',
    name: 'vital',
    component: () => import('@/views/vital/index.vue'),
    meta: { title: '穿戴数据查询', icon: 'home', keepAlive: false, showTab: true }
  },
  {
    path: '/pathology/index',
    name: 'pathology',
    component: () => import('@/views/pathology/index.vue'),
    meta: { title: '病理查询', icon: 'home', keepAlive: false, showTab: true }
  },
  {
    path: '/archive/index',
    name: 'archive',
    component: () => import('@/views/archive/index.vue'),
    meta: { title: '医保信息档案', icon: 'home', keepAlive: false, showTab: false }
  },
  {
    path: '/iframe',
    name: 'iframe',
    component: () => import('@/views/iframe/index.vue'),
    meta: { title: '外部', keepAlive: false, showTab: false },
    children: []
  },
  {
    path: '/detail/inspection/report',
    name: 'inspectionReportDetail',
    component: () => import('@/views/detail/report/inspection'),
    meta: { title: '报告详情', keepAlive: false, showTab: true },
    children: []
  },
  {
    path: '/detail/outpatient/report',
    name: 'outpatientReportDetail',
    component: () => import('@/views/detail/report/outpatient'),
    meta: { title: '门诊病历详情', keepAlive: false, showTab: true },
    children: []
  },
  {
    path: '/detail/inpatient/report',
    name: 'inpatientReportDetail',
    component: () => import('@/views/detail/report/inpatient'),
    meta: { title: '病案首页', keepAlive: false, showTab: true },
    children: []
  },
  {
    path: '/detail/vital/report',
    name: 'vitalReportDetail',
    component: () => import('@/views/detail/report/vital'),
    meta: { title: '穿戴设备监测报告', keepAlive: false, showTab: true },
    children: []
  },
  {
    path: '/detail/pathology/report',
    name: 'pathologyReportDetail',
    component: () => import('@/views/detail/report/pathology'),
    meta: { title: '病理检查报告', keepAlive: false, showTab: true },
    children: []
  },
  {
    path: '/detail/image',
    // redirect: '/detail/image',
    name: 'imageDetail',
    component: () => import('@/views/detail/image'),
    meta: { title: '影像详情', keepAlive: false, showTab: true },
    children: []
  },
  {
    path: '/detail/report',
    // redirect: '/detail/report',
    name: 'reportDetail',
    component: () => import('@/views/detail/report'),
    meta: { title: '报告详情', keepAlive: false, showTab: true },
    children: []
  },
  {
    path: '/mutual-statisic/integrate-statistic',
    name: 'integrateStatistic', // 综合统计
    component: () => import('@/views/mutual-recognize/integrate-statistic'),
    meta: { title: '综合统计', keepAlive: false, showTab: false },
    children: []
  },
  {
    path: '/mutual-statisic/history-mutual',
    name: 'historyMutual', // 历史互认清单
    component: () => import('@/views/mutual-recognize/history-mutual-recognize'),
    meta: { title: '历史互认清单', keepAlive: false, showTab: false },
    children: []
  },
  {
    path: '/order/statistic',
    name: 'orderStatistic', // 历史互认清单
    component: () => import('@/views/order/statistic'),
    meta: { title: '开单统计', keepAlive: false, showTab: false },
    children: []
  },
  {
    path: '/abnormal/feedback',
    name: 'feedback',
    component: () => import('@/views/abnormal/feedback/index.vue'),
    meta: { title: '异常反馈', keepAlive: false, showTab: false }
  },
  {
    path: '/abnormal/record',
    name: 'record',
    component: () => import('@/views/abnormal/record/index.vue'),
    meta: { title: '反馈记录', keepAlive: false, showTab: false }
  },
]
