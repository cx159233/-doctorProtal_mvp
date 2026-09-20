import Vue from 'vue'
import {
  SIDEBAR_TYPE, // 侧边栏类型
  DEFAULT_THEME, // 默认主题
  DEFAULT_LAYOUT_MODE, // 默认布局模式
  DEFAULT_COLOR, // 默认颜色
  DEFAULT_COLOR_WEAK,
  DEFAULT_FIXED_HEADER, // 默认固定头部
  DEFAULT_FIXED_SIDEMENU, // 默认固定侧边栏
  DEFAULT_FIXED_HEADER_HIDDEN, // 默认固定头部隐藏
  DEFAULT_CONTENT_WIDTH_TYPE, // 默认主内容宽度类型
  DEFAULT_MULTI_TAB, // 默认多选tab
  DEFAULT_TAB_PANE, // 默认标签页容器
  DEFAULT_ACTIVE_KEY, // 默认激活的标签页
  DEFAULT_DELETE_TAB_PANE // 删除标签
} from '../mutation-types'

const app = {
  state: {
    sidebar: true,
    device: 'desktop',
    theme: '',
    layout: '',
    contentWidth: '',
    fixedHeader: false,
    fixSiderbar: false,
    autoHideHeader: false,
    color: null,
    weak: false,
    multiTab: false, // 标签页的状态 开启或者关闭
    activeKey: '', // 当前激活的标签页
    tabPane: [] // 标签页
  },
  mutations: {
    SET_SIDEBAR_TYPE: (state, type) => { // 设置侧边栏类型
      state.sidebar = type
      Vue.ls.set(SIDEBAR_TYPE, type)
    },
    CLOSE_SIDEBAR: (state) => { // 关闭侧边栏
      state.sidebar = false
      Vue.ls.set(SIDEBAR_TYPE, true)
    },
    TOGGLE_DEVICE: (state, device) => { // 切换设备
      state.device = device
    },
    TOGGLE_THEME: (state, theme) => { // 切换主题
      state.theme = theme
      Vue.ls.set(DEFAULT_THEME, theme)
    },
    TOGGLE_LAYOUT_MODE: (state, layout) => { // 切换布局模式
      state.layout = layout
      Vue.ls.set(DEFAULT_LAYOUT_MODE, layout)
    },
    TOGGLE_FIXED_HEADER: (state, fixed) => { // 切换固定header
      Vue.ls.set(DEFAULT_FIXED_HEADER, fixed)
      state.fixedHeader = fixed
    },
    TOGGLE_FIXED_SIDERBAR: (state, fixed) => { // 切换固定侧边栏
      Vue.ls.set(DEFAULT_FIXED_SIDEMENU, fixed)
      state.fixSiderbar = fixed
    },
    TOGGLE_FIXED_HEADER_HIDDEN: (state, show) => { // 切换固定隐藏头部
      Vue.ls.set(DEFAULT_FIXED_HEADER_HIDDEN, show)
      state.autoHideHeader = show
    },
    TOGGLE_CONTENT_WIDTH: (state, type) => { // 切换主容器宽度
      Vue.ls.set(DEFAULT_CONTENT_WIDTH_TYPE, type)
      state.contentWidth = type
    },
    TOGGLE_COLOR: (state, color) => { // 切换颜色
      Vue.ls.set(DEFAULT_COLOR, color)
      state.color = color
    },
    TOGGLE_WEAK: (state, flag) => { // 切换标题
      Vue.ls.set(DEFAULT_COLOR_WEAK, flag)
      state.weak = flag
    },
    TOGGLE_MULTI_TAB: (state, bool) => { // tab状态
      state.multiTab = bool
    },
    TOGGLE_Tab_Pane: (state, obj) => { // 标签页
      // Vue.ls.set(DEFAULT_TAB_PANE, obj)
      state.tabPane.push(obj)
    },
    TOGGLE_ACTIVE_KEY: (state, val) => { // 当前激活的key
      // Vue.ls.set(DEFAULT_ACTIVE_KEY, val)
      state.activeKey = val
    },
    DELETE_TAB_PANE: (state, arr) => { // 删减tabpane
      // Vue.ls.set(DEFAULT_DELETE_TAB_PANE, arr)
      state.tabPane = arr
    },
    SPLICE_TAB_PANE: (state, obj) => { // 删减操作
      state.tabPane.splice(obj.startIndex, obj.endIndex)
    },
    MODIFIED_TAB_PANE: (state, obj) => { // 修改操作
      let bol = false
      state.tabPane.some(v => {
        if (v.key.includes('/home/index') && obj.key.includes('/home/index') && v.key !== obj.key && !obj.key.includes('activeSearchMode')) {
          v.key = obj.key
          bol = true
          return bol
        }
      })
      // console.log(state.tabPane)
    },
    INSERT_FIRST_PANE: (state, obj) => { // 插入到第一个位置第一个
      state.tabPane.unshift(obj)
    }
  },
  actions: {
    setSidebar ({ commit }, type) {
      commit('SET_SIDEBAR_TYPE', type)
    },
    CloseSidebar ({ commit }) {
      commit('CLOSE_SIDEBAR')
    },
    ToggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    ToggleTheme ({ commit }, theme) {
      commit('TOGGLE_THEME', theme)
    },
    ToggleLayoutMode ({ commit }, mode) {
      commit('TOGGLE_LAYOUT_MODE', mode)
    },
    ToggleFixedHeader ({ commit }, fixedHeader) {
      if (!fixedHeader) {
        commit('TOGGLE_FIXED_HEADER_HIDDEN', false)
      }
      commit('TOGGLE_FIXED_HEADER', fixedHeader)
    },
    ToggleFixSiderbar ({ commit }, fixSiderbar) {
      commit('TOGGLE_FIXED_SIDERBAR', fixSiderbar)
    },
    ToggleFixedHeaderHidden ({ commit }, show) {
      commit('TOGGLE_FIXED_HEADER_HIDDEN', show)
    },
    ToggleContentWidth ({ commit }, type) {
      commit('TOGGLE_CONTENT_WIDTH', type)
    },
    ToggleColor ({ commit }, color) {
      commit('TOGGLE_COLOR', color)
    },
    ToggleWeak ({ commit }, weakFlag) {
      commit('TOGGLE_WEAK', weakFlag)
    },
    // 是否展示多标签页
    ToggleMultiTab ({ commit }, bool) {
      // console.log(bool)
      commit('TOGGLE_MULTI_TAB', bool)
    },
    // 新增保存标签页
    PushTabPane({ commit }, obj) {
      commit('TOGGLE_Tab_Pane', obj)
    },
    // 切换当前激活的标签页
    ToggleActiceKey({ commit }, val) {
      commit('TOGGLE_ACTIVE_KEY', val)
    },
    // 重新赋值
    DeleteTabPane({ commit }, arr) {
      commit('DELETE_TAB_PANE', arr)
    },
    // 删减操作
    SpliceTabPane( {commit }, obj) {
      commit('SPLICE_TAB_PANE', obj)
    },
    // 修改tabPane状态
    ModifiedTabPane({ commit }, obj) {
      // console.log(obj)
      commit('MODIFIED_TAB_PANE', obj)
    },
    insertFirstPane({ commit }, obj) {
      commit('INSERT_FIRST_PANE', obj)
    }
  }
}
export default app