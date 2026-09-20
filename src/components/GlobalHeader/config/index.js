/*
 * @Description: 
 * @version: 1.0
 * @Author: renyong
 * @Date: 2022-05-16 14:58:39
 * @LastEditors: ranfenghua ranfenghua@cecinvestment.com
 * @LastEditTime: 2026-02-26 16:15:09
 */

/**
 * @Description: 菜单列表
 * @return {*}
 * @author: renyong
 */
const _menuList = [
  {
    // 个人医保画像：整屏大屏页面，内容由独立工程构建后嵌在 iframe 里
    title: '个人医保画像',
    key: '/portrait/index',
    icon: 'user',
    keyPath: '/portrait/index',
    children:[]
  },
  {
    // 影像查询 / 检验查询合并成一条，页内用二级页签条切换
    title: '医保健康档案',
    key: '/home/index',
    icon: 'search',
    keyPath: '/home/index',
    children:[]
  },
  {
    title: '医保信息档案',
    key: '/archive/index',
    icon: 'profile',
    keyPath: '/archive/index',
    children:[]
  },
  {
    title: '',
    key: '/iframe',
    icon: 'search',
    keyPath: '/iframe',
    isHide:true,
    children:[]
  },

  {
    title: '异常反馈',
    key: '/abnormal',
    icon: 'exception',
    keyPath: '/abnormal',
    children:[{
      title: '异常反馈',
      key: '/abnormal/feedback',
      keyPath: '/abnormal/feedback',
    },{
      title: '反馈记录',
      key: '/abnormal/record',
      keyPath: '/abnormal/record',
    }]
  },
  // 等保交付
  {
    title: '互认管理统计',
    isStatisic: false,
    key: '/mutual-statisic',
    icon: 'bar-chart',
    keyPath: '/mutual-statisic', // 互认统计
    children: [
      {
        title: '综合统计',
        key: '/mutual-statisic/integrate-statistic',
        icon: '',
        keyPath: '/mutual-statisic/integrate-statistic',
        query: {},
      },
      {
        title: '历史互认清单',
        key: '/mutual-statisic/history-mutual',
        icon: '',
        keyPath: '/mutual-statisic/history-mutual',
        query: {},
      }
    ],
    query: {}
  },
  {
    title: '开单统计',
    isStatisic: false,
    key: '/order/statistic',
    icon: 'fund',
    keyPath: '/order/statistic',
    query: {},
    children:[
    ]
  }
]

// console.log('window.CONFIG.hiddenStatisicMenu', window.CONFIG.hiddenStatisicMenu)

const menuList = window.CONFIG.hiddenStatisicMenu ? _menuList.filter(item => !item.isStatisic) : _menuList

export {
  menuList
}