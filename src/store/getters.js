
const getters = {
  device: state => state.app.device, // 设备
  theme: state => state.app.theme, // 主题
  color: state => state.app.color, // 颜色
  token: state => state.user.token, // 用户令牌
  avatar: state => state.user.avatar, // 用户头像
  userName: state => state.user.name, // 用户名
  welcome: state => state.user.welcome, // 欢迎
  userInfo: state => state.user.userInfo, // 用户信息
  userLoginInfo: state => state.user.userLoginInfo, // 获取用户的全量登录信息
  hospitalName: state => state.user.hospital_name, // 医院名称
  // addRouters: state => state.permission.addRouters, // 增加路由
  multiTab: state => state.app.multiTab, // 多个tab
  tabPane: state => state.app.tabPane, // 标签页
  activeKey: state => state.app.activeKey, // 当前激活的标签页
  // lang: state => state.i18n.lang,
  init: state => state.system.init,
  citys: state => state.system.city,
  timeViewRange: state => state.user.timeViewRange, // 获取时间范围  
  message: state => state.user.message // 获取时间范围  
}

export default getters