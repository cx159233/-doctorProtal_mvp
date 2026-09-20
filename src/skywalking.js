import Vue from 'vue'
// skywalking监控系统
import ClientMonitor from 'skywalking-client-js'
import projectInfo from '../package.json'
import { OFFLINE_DEMO } from '@/config/demo'

if (OFFLINE_DEMO) {
  // 演示环境没有 APM 后端，上报只会往控制台刷 500，这里只把报错打到控制台方便排查
  Vue.config.errorHandler = (error) => console.error(error)
} else {
  // 注册skywalking
  ClientMonitor.register({
    collector: `${window.location.origin}/apm`,
    service: projectInfo.name, // 应用名称
    serviceVersion: projectInfo.version, // 应用版本号
    traceSDKInternal: true, // 追踪sdk
    pagePath: location.href, // 当前路由地址
    useFmp: true,
    vue: Vue // vue实例
  })

  // 报错监控，上报错误信息方法
  function reportFrameErrors(error) {
    console.log(error)
    ClientMonitor.reportFrameErrors({
      service: projectInfo.name, // 应用名称
      serviceVersion: projectInfo.version, // 应用版本号
      pagePath: location.href,
      vue: Vue
    }, error)
  }
  // 监听ajax报错
  window.addEventListener('error', error => {
    console.log('error--->', error)
    reportFrameErrors(error)
  }, true)

  // Vue 报错上报到skywalking。
  Vue.config.errorHandler = (error) => {
    // console.error(error)
    reportFrameErrors(error)
  }
}
