<template>
  <div class="portrait-page">
    <iframe
      v-if="url"
      class="portrait-frame"
      :src="url"
      frameborder="0"
      allowfullscreen="true"
    ></iframe>
    <!-- 授权弹窗挂在这里而不是大屏里：弹窗要和路由、sessionStorage 同源才拿得到患者身份 -->
    <AuthModal :visible.sync="showAuth" start-step="choose" @success="onAuthSuccess" />
  </div>
</template>

<script>
import { DEFAULT_PATIENT } from '@/config/demo'
import AuthModal from '@/components/AuthModal'

// 记住上一次看的患者：菜单点进来时 URL 上没有参数，没有它就会退回默认患者
const LAST_PATIENT_KEY = 'portrait-last-patient'
// 已授权的患者身份证号。和大屏同域的 sessionStorage——HIS 是整页跳转，
// 同标签页同源，跳过来还读得到；大屏在 iframe 里跨进程则读不到，只能靠 URL 收结果。
const AUTH_KEY = 'portrait-authorized-idcard'

export default {
  name: 'portrait',
  components: { AuthModal },
  data() {
    return {
      url: '',
      base: '',
      patientName: '',
      patientIdCard: '',
      entry: '',
      showAuth: false,
    }
  },
  created() {
    // 大屏是独立工程（portrait-src）构建出的静态产物，放在 public/portrait 下。
    // 生产环境 publicPath 是 './'，写死 '/portrait/index.html' 在子路径部署时会 404，
    // 所以按当前文档基址拼相对地址（和查看影像加载 dicom.png 是同一个坑）
    // 开发环境直连 portrait-src 的 vite 开发服务器（改代码即时热更新）；
    // 生产/打包仍走 public/portrait 静态产物
    this.base =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173/'
        : new URL('portrait/index.html', document.baseURI).href

    // 大屏在 iframe 里跨进程，拿不到主应用的状态，患者身份只能走 URL 传。
    // 大屏内部按 IdCard 派生年龄/性别/出生日期，所以这里只传姓名和身份证。
    // 从 HIS 整页跳进来带 ?name=&idcard=&entry=his；从菜单点「个人医保画像」
    // 进的是光秃秃的 /portrait/index，没有参数——此时沿用上次的患者，
    // 否则会退回默认患者，而默认患者未必是刚授权过的那位。
    const { name, idcard, entry } = this.$route.query
    const last = this.lastPatient()
    this.patientName = name || last.name || DEFAULT_PATIENT.name
    this.patientIdCard = idcard || last.idCard || DEFAULT_PATIENT.idCard
    this.entry = entry || ''
    sessionStorage.setItem(
      LAST_PATIENT_KEY,
      JSON.stringify({ name: this.patientName, idCard: this.patientIdCard })
    )

    // 从 HIS 进来是「当场给这位患者授权」，先把旧记录清掉强制重走一遍
    if (this.entry === 'his') {
      try {
        sessionStorage.removeItem(AUTH_KEY)
      } catch (e) {}
    }

    const authorized = this.isAuthorized()
    this.showAuth = !authorized
    this.url = this.buildUrl(authorized)
  },
  mounted() {
    window.addEventListener('message', this.handleFrameMessage)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleFrameMessage)
  },
  methods: {
    // 授权状态变了就整个换掉 iframe 的地址：大屏那边只认 URL 参数，重载一次最省事
    buildUrl(authorized) {
      return (
        `${this.base}?name=${encodeURIComponent(this.patientName)}` +
        `&idcard=${encodeURIComponent(this.patientIdCard)}` +
        `&authorized=${authorized ? 1 : 0}`
      )
    },
    isAuthorized() {
      try {
        return sessionStorage.getItem(AUTH_KEY) === this.patientIdCard
      } catch (e) {
        return false
      }
    },
    onAuthSuccess() {
      try {
        sessionStorage.setItem(AUTH_KEY, this.patientIdCard)
      } catch (e) {}
      this.showAuth = false
      this.url = this.buildUrl(true)
    },
    // 大屏在 iframe 里跨进程，拿不到这里的 router：全景视图卡片点击只能 postMessage 传出来，
    // 由这边跳转到医保健康档案对应的查询页（路由命中哪条，页面上的查询页签就选中哪条）
    handleFrameMessage(event) {
      const { type, path } = event.data || {}
      if (type !== 'portraitNavigate') return
      if (typeof path !== 'string' || path.indexOf('/') !== 0) return
      this.$router.push(path)
    },
    lastPatient() {
      try {
        return JSON.parse(sessionStorage.getItem(LAST_PATIENT_KEY)) || {}
      } catch (e) {
        return {}
      }
    },
  },
}
</script>

<style lang="less" scoped>
// 内容区已按 fullBleed 去掉内边距，这里撑满即可
.portrait-page {
  width: 100%;
  height: 100%;
}
.portrait-frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
